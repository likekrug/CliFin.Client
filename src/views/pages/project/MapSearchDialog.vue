<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  initLocation?: { lat: number; lng: number } | null
  initAddress?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'selectLocation', payload: { lat: number; lng: number; address: string }): void
}>()

// ----------------------
// 기본 상태
// ----------------------
const searchText = ref('')
const suggestions = ref<string[]>([])
const defaultCenter = { lat: 36.3725, lng: 127.362 } // 한국 KAIST 기술원 (대전 유성구)
const center = ref(defaultCenter)

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement | null = null
let infoWindow: google.maps.InfoWindow
let autocompleteService: google.maps.places.AutocompleteService
let placesService: google.maps.places.PlacesService

const currentLat = ref<number | null>(null)
const currentLng = ref<number | null>(null)
const currentAddress = ref('')
const showSuggestions = ref(false)
const isConfirmDisabled = computed(() => !currentLat.value || !currentLng.value)

const dialog = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// -------------------
// 지도 초기화
// -------------------
watch(dialog, async val => {
  if (!val)
    return
  await nextTick()
  await initMap()
})

async function initMap() {
  const mapEl = document.getElementById('map')
  if (!mapEl)
    return

  const [{ Map }, { AdvancedMarkerElement }, { PlacesService, AutocompleteService }] = await Promise.all([
    google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
    google.maps.importLibrary('places') as Promise<google.maps.PlacesLibrary>,
  ])

  map = new Map(mapEl, {
    center: props.initLocation || defaultCenter,
    zoom: 13,
    mapTypeControl: false,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
  })

  infoWindow = new google.maps.InfoWindow({})
  placesService = new PlacesService(map)
  autocompleteService = new AutocompleteService()

  // 초기 마커 표시 (기본 KAIST 포함)
  const pos = props.initLocation || defaultCenter

  currentLat.value = pos.lat
  currentLng.value = pos.lng
  currentAddress.value = props.initAddress || 'KAIST, Daejeon, South Korea'
  searchText.value = props.initAddress || 'KAIST, Daejeon, South Korea'

  marker = new AdvancedMarkerElement({ map, position: pos })
  infoWindow.setContent(`<div style="font-weight:600">${currentAddress.value}</div>`)
  infoWindow.open({ map, anchor: marker!, shouldFocus: false })
  map.setCenter(pos)
  map.setZoom(15)

  // 지도 클릭 시 단일 마커 이동
  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    if (!e.latLng)
      return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    if (!marker) {
      marker = new AdvancedMarkerElement({
        map, position: e.latLng,
      })
    }
    else {
      marker.map = map
      marker.position = e.latLng
    }

    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ location: e.latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address

        infoWindow.setContent(`<div style="font-weight:600">${address}</div>`)
        infoWindow.open({ map, anchor: marker!, shouldFocus: false })
        currentLat.value = lat
        currentLng.value = lng
        currentAddress.value = address
        searchText.value = address
      }
    })
  })
}

// -------------------
// 자동완성 검색
// -------------------
function handleInput(val: string) {
  searchText.value = val
  if (!autocompleteService || !val) {
    suggestions.value = []
    showSuggestions.value = false

    return
  }

  autocompleteService.getPlacePredictions(
    { input: val, locationBias: center.value },
    (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        suggestions.value = predictions.map(p => p.description)
        showSuggestions.value = true
      }
      else {
        suggestions.value = []
        showSuggestions.value = false
      }
    },
  )
}

// -------------------
// 검색어 선택 시 textSearch로 이동
// -------------------
function handleSelectSuggestion(description: string) {
  searchText.value = description
  showSuggestions.value = false

  const request = { query: description }

  placesService.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
      const place = results[0]
      const loc = place.geometry?.location
      if (!loc)
        return

      map.setCenter(loc)
      map.setZoom(15)

      if (!marker) {
        marker = new google.maps.marker.AdvancedMarkerElement({
          map, position: loc,
        })
      }
      else {
        marker.map = map
        marker.position = loc
      }

      const addressHtml = `
        <div style="font-weight:600">${place.name}</div>
        <div style="font-size:13px">${place.formatted_address}</div>
        ${place.url ? `<a href="${place.url}" target="_blank" style="font-size:12px;color:#1a73e8;">View on Google Maps</a>` : ''}
      `

      infoWindow.setContent(addressHtml)
      infoWindow.open({ map, anchor: marker!, shouldFocus: false })
      currentLat.value = loc.lat()
      currentLng.value = loc.lng()
      currentAddress.value = place.formatted_address || ''
    }
  })
}

// -------------------
// Clear 버튼 클릭
// -------------------
function handleClear() {
  searchText.value = ''
  suggestions.value = []
  showSuggestions.value = false
  currentLat.value = null
  currentLng.value = null
  currentAddress.value = ''

  // 마커는 유지
  infoWindow.close()
}

// -------------------
// Confirm
// -------------------
function handleConfirm() {
  if (!currentLat.value || !currentLng.value)
    return

  emit('selectLocation', {
    lat: currentLat.value,
    lng: currentLng.value,
    address: currentAddress.value,
  })
  dialog.value = false
}
</script>

<template>
  <VDialog
    v-model="dialog"
    width="850"
    transition="dialog-bottom-transition"
    scrim="false"
  >
    <VCard
      flat
      variant="outlined"
      class="rounded-lg"
      style="background-color: #fff;"
    >
      <!-- Title -->
      <VCardTitle class="d-flex justify-space-between align-center px-6 py-3 border-b">
        <div class="d-flex align-center">
          <VIcon
            icon="ri-map-pin-line"
            color="primary"
            size="20"
            class="me-2"
          />
          <span class="text-h6 font-weight-semibold text-high-emphasis">Search Location</span>
        </div>
        <VBtn
          icon="ri-close-line"
          size="small"
          variant="text"
          color="secondary"
          @click="dialog = false"
        />
      </VCardTitle>

      <!-- Map & Search -->
      <VCardText
        class="pa-4"
        style="position: relative;"
      >
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
            @click:clear="handleClear"
            @update:model-value="handleInput"
          />
          <VList
            v-if="showSuggestions && suggestions.length"
            class="autocomplete-list"
          >
            <VListItem
              v-for="(item, i) in suggestions"
              :key="i"
              @click="handleSelectSuggestion(item)"
            >
              <VListItemTitle>{{ item }}</VListItemTitle>
            </VListItem>
          </VList>
        </div>

        <div
          id="map"
          class="rounded-lg"
          style="border: 1px solid rgba(0, 0, 0, 10%); block-size: 480px; inline-size: calc(100% - 16px); margin-inline: auto;"
        />
      </VCardText>

      <!-- Buttons -->
      <VCardActions class="justify-end px-6 pb-4">
        <VBtn
          variant="outlined"
          color="secondary"
          class="me-2"
          @click="dialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          variant="elevated"
          class="text-end py-0 shadow-md"
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
#map-search-overlay {
  position: absolute;
  z-index: 30;
  inline-size: 340px;
  inset-block-start: 32px;
  inset-inline-start: 32px;
}

.search-input {
  position: relative;
  z-index: 40;
  border-radius: 8px;
  background-color: white !important;
  block-size: 44px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 10%);
  inline-size: 100%;
}

.autocomplete-list {
  position: absolute;
  z-index: 50;
  border: 1px solid rgba(0, 0, 0, 12%);
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 15%);
  inline-size: 100%;
  inset-block-start: 48px;
  inset-inline-start: 0;
  max-block-size: 220px;
  overflow-y: auto;
}

.autocomplete-list .v-list-item {
  cursor: pointer;
}

.autocomplete-list .v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
