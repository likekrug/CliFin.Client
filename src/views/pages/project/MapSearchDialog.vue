<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ensureGoogleMapsLoaded } from '@/utils/googleMaps'

// declare global {
//   interface Window {
//     google: any
//   }
// }

interface Props {
  modelValue: boolean
  initLocation?: { lat: number; lng: number } | null
  initAddress?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'selectLocation'])

// dialog v-model
const dialog = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const defaultCenter = { lat: 36.372161, lng: 127.360382 }
const defaultAddress = 'KAIST, Daejeon, South Korea'

const searchText = ref<string>('') // full address
const pos = ref<{ lat: number; lng: number }>(defaultCenter)
const initFullAddress = ref<string>(defaultAddress)

const suggestions = ref<{ text: string; placeId: string }[]>([])
const showSuggestions = ref(false)

let map: any
let marker: any
let infoWindow: any
let autocompleteToken: any

const currentLat = ref<number | null>(null)
const currentLng = ref<number | null>(null)
const currentAddress = ref<string>('') // city + country only

const isConfirmDisabled = computed(() => !currentLat.value || !currentLng.value)

async function loadFullAddressFromLatLng(lat: number, lng: number): Promise<string | null> {
  const google = await ensureGoogleMapsLoaded()
  const geocoder = new google.maps.Geocoder()

  return new Promise(resolve => {
    geocoder.geocode({ location: { lat, lng }, language: 'en' }, (results, status) => {
      if (status === 'OK' && results?.[0])
        resolve(results[0].formatted_address)
      else
        resolve(null)
    })
  })
}

function extractCityCountry(
  components?: { longText: string; types: string[] }[],
): string {
  if (!components)
    return ''

  let city = ''
  let country = ''

  for (const c of components) {
    if (c.types.includes('locality'))
      city = c.longText
    if (!city && c.types.includes('administrative_area_level_1'))
      city = c.longText
    if (c.types.includes('country'))
      country = c.longText
  }

  return city && country ? `${city}, ${country}` : city || country
}

const isMapInitialized = ref(false)
async function initMap() {
  const google = await ensureGoogleMapsLoaded()

  const mapsLib: any = await google.maps.importLibrary('maps')
  const markerLib: any = await google.maps.importLibrary('marker')
  const placesLib: any = await google.maps.importLibrary('places')
  const geocoderLib: any = await google.maps.importLibrary('geocoding')

  const Map = mapsLib.Map
  const AdvancedMarkerElement = markerLib.AdvancedMarkerElement
  const Geocoder = geocoderLib.Geocoder
  const { AutocompleteSessionToken } = placesLib // Place 클래스 추가

  const mapEl = document.getElementById('map')
  if (!mapEl)
    return

  autocompleteToken = new AutocompleteSessionToken()
  infoWindow = new google.maps.InfoWindow()

  const geocoder = new Geocoder()

  // 부모에서 받은 값 세팅
  pos.value = props.initLocation ?? defaultCenter
  initFullAddress.value = props.initAddress?.trim() || defaultAddress

  // 좌표 기준 fullAddress 재조회
  const resolved = await loadFullAddressFromLatLng(pos.value.lat, pos.value.lng)

  // 검색창 표시값
  searchText.value = resolved || initFullAddress.value

  // short address (city, country) 초기 설정
  currentLat.value = pos.value.lat
  currentLng.value = pos.value.lng
  currentAddress.value = extractCityCountry() // 초기 currentAddress는 정확하지 않을 수 있음

  map = new Map(mapEl, {
    center: pos.value,
    zoom: 14,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
  })

  marker = new AdvancedMarkerElement({
    map,
    position: pos.value,
  })

  // 2. 지도 클릭 리스너 추가 (Place Name 조회 포함)
  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    if (!e.latLng)
      return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    // 마커 이동/생성
    if (!marker) {
      marker = new AdvancedMarkerElement({ map, position: e.latLng })
    }
    else {
      marker.map = map
      marker.position = e.latLng
    }

    // 역지오코딩 (Place ID 포함) 및 상세 정보 조회
    geocoder.geocode({ location: e.latLng, language: 'en' }, async ( // async 추가
      results: google.maps.GeocoderResult[] | null,
      status: google.maps.GeocoderStatus,
    ) => {
      if (status === 'OK' && results && results[0]) {
        const fullAddress = results[0].formatted_address

        // short address (city, country) 추출
        const shortAddr = extractCityCountry(
          results[0].address_components.map(c => ({
            longText: c.long_name,
            types: c.types,
          })),
        )

        currentLat.value = lat
        currentLng.value = lng
        currentAddress.value = shortAddr
        searchText.value = fullAddress // 검색창에도 전체 주소 표시
      }
    })
  })

  isMapInitialized.value = true
}

watch(dialog, async opened => {
  if (!opened) {
    // 다이얼로그가 닫힐 때, 다음 오픈을 위해 초기화 상태를 리셋합니다.
    isMapInitialized.value = false

    return
  }

  // 다이얼로그가 열렸고, 아직 지도가 초기화되지 않았다면
  if (opened && !isMapInitialized.value) {
    await nextTick()
    await initMap()
    isMapInitialized.value = true // 초기화 완료 플래그 설정
  }
})

const isSelecting = ref(false)

async function handleInput(val: string | null | undefined) {
  if (isSelecting.value)
    return

  const google = await ensureGoogleMapsLoaded()
  const placesLib: any = await google.maps.importLibrary('places')
  const AutocompleteSuggestion = placesLib.AutocompleteSuggestion

  const input = val ?? ''

  searchText.value = input

  if (!input.trim()) {
    suggestions.value = []
    showSuggestions.value = false

    return
  }

  const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input,
    sessionToken: autocompleteToken,
  })

  suggestions.value = (result.suggestions || []).map(s => ({
    text: s.placePrediction?.text?.text || '',
    placeId: s.placePrediction?.placeId || '',
  }))

  showSuggestions.value = suggestions.value.length > 0
}

async function handleSelectSuggestion(text: string, placeId: string) {
  isSelecting.value = true
  showSuggestions.value = false
  suggestions.value = []
  searchText.value = text

  const google = await ensureGoogleMapsLoaded()
  const placesLib: any = await google.maps.importLibrary('places')
  const Place = placesLib.Place

  const place = new Place({ id: placeId })

  await place.fetchFields({
    fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'],
  })

  if (!place.location) {
    isSelecting.value = false

    return
  }

  const loc = place.location
  const fullAddr = place.formattedAddress || place.displayName || text
  const shortAddr = extractCityCountry(place.addressComponents)

  map.setCenter(loc)
  marker.position = loc

  // infoWindow.setContent(`
  // <div class="map-info-title">${place.displayName}</div>
  // <div class="map-info-address">${fullAddr}</div>
  // `)
  // infoWindow.open({ map, anchor: marker })

  currentLat.value = loc.lat()
  currentLng.value = loc.lng()
  currentAddress.value = shortAddr
  searchText.value = fullAddr

  setTimeout(() => (isSelecting.value = false), 150)
}

function handleConfirm() {
  if (!currentLat.value || !currentLng.value)
    return

  emit('selectLocation', {
    lat: currentLat.value,
    lng: currentLng.value,
    address: currentAddress.value,
  })
}
</script>

<template>
  <VDialog
    v-model="dialog"
    width="850"
    transition="dialog-bottom-transition"
    scrim="rgba(0,0,0,0.5)"
  >
    <VCard
      flat
      variant="outlined"
      class="rounded-lg dialog-card"
    >
      <VCardTitle class="d-flex justify-space-between align-center px-6 py-3 border-b">
        <div class="d-flex align-center">
          <VIcon
            icon="ri-map-pin-line"
            color="primary"
            size="20"
            class="me-2"
          />
          <span class="text-h6 font-weight-semibold">Search Location</span>
        </div>

        <VBtn
          icon="ri-close-line"
          size="small"
          variant="text"
          @click="dialog = false"
        />
      </VCardTitle>

      <VCardText class="pa-4 map-wrapper">
        <!-- Search Input -->
        <div id="map-search-overlay">
          <VTextField
            v-model="searchText"
            variant="outlined"
            placeholder="Search place..."
            density="comfortable"
            hide-details
            prepend-inner-icon="ri-search-line"
            clearable
            bg-color="white"
            class="search-input"
            @update:model-value="handleInput"
            @click:clear="() => { searchText = ''; suggestions = []; showSuggestions = false }"
          />

          <VList
            v-if="showSuggestions && suggestions.length"
            class="autocomplete-list"
          >
            <VListItem
              v-for="(item, i) in suggestions"
              :key="i"
              @click="handleSelectSuggestion(item.text, item.placeId)"
            >
              <VListItemTitle>{{ item.text }}</VListItemTitle>
            </VListItem>
          </VList>
        </div>

        <!-- MAP -->
        <div
          id="map"
          class="map-container rounded-lg"
        />
      </VCardText>

      <VCardActions class="justify-end px-6 pb-4">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="dialog = false"
        >
          Cancel
        </VBtn>

        <VBtn
          color="primary"
          variant="elevated"
          :disabled="isConfirmDisabled"
          @click="handleConfirm"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 480px;
  border: 1px solid rgba(0 0 0 / 10%);
}
.map-wrapper {
  position: relative !important;
  overflow: visible !important;
}
#map-search-overlay {
  position: absolute;
  z-index: 30;
  width: 340px;
  top: 20px;
  left: 20px;
}
.search-input {
  background-color: white !important;
  border-radius: 8px;
  height: 44px;
  box-shadow: 0 2px 6px rgba(0 0 0 / 15%);
}
.autocomplete-list {
  position: absolute;
  z-index: 50;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0 0 0 / 12%);
  box-shadow: 0 4px 12px rgba(0 0 0 / 20%);
  max-height: 220px;
  overflow-y: auto;
  width: 100%;
  top: 48px;
  left: 0;
}
:deep(.v-overlay__scrim) {
  backdrop-filter: none !important;
  background-color: rgba(0, 0, 0, 0.45) !important;
}
.dialog-card {
  background-color: white !important;
  opacity: 1 !important;
  backdrop-filter: none !important;
  z-index: 10000 !important;
}
</style>
