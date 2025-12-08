<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ensureGoogleMapsLoaded } from '@/utils/googleMaps'

interface Props {
  modelValue: boolean
  initLocation?: { lat: number; lng: number } | null
  initAddress?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'selectLocation'])

const searchText = ref('')
const suggestions = ref<{ text: string }[]>([])
const defaultCenter = { lat: 36.3725, lng: 127.362 }

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement | null = null
let infoWindow: google.maps.InfoWindow

let autocompleteToken: google.maps.places.AutocompleteSessionToken

const currentLat = ref<number | null>(null)
const currentLng = ref<number | null>(null)
const currentAddress = ref('')
const showSuggestions = ref(false)

const isConfirmDisabled = computed(() => !currentLat.value || !currentLng.value)

const dialog = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

watch(dialog, async v => {
  if (!v)
    return
  await nextTick()
  await initMap()
})

function extractCityCountry(components?: google.maps.places.PlaceAddressComponent[]) {
  if (!components)
    return ''
  let city = ''; let country = ''

  for (const c of components) {
    if (c.types.includes('locality'))
      city = c.longText
    if (c.types.includes('country'))
      country = c.longText
  }

  return city && country ? `${city}, ${country}` : city || country
}

async function initMap() {
  const google = await ensureGoogleMapsLoaded()

  const mapEl = document.getElementById('map')
  if (!mapEl)
    return

  const mapsLib = await google.maps.importLibrary('maps') as google.maps.MapsLibrary
  const markerLib = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary
  const placesLib = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

  const Map = mapsLib.Map
  const AdvancedMarkerElement = markerLib.AdvancedMarkerElement
  const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLib

  autocompleteToken = new AutocompleteSessionToken()

  map = new Map(mapEl, {
    center: props.initLocation || defaultCenter,
    zoom: 13,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
  })

  infoWindow = new google.maps.InfoWindow()

  const initialAddress
    = props.initAddress?.trim() || 'KAIST, Daejeon, South Korea'

  const pos = props.initLocation || defaultCenter

  currentLat.value = pos.lat
  currentLng.value = pos.lng
  currentAddress.value = initialAddress
  searchText.value = initialAddress

  marker = new AdvancedMarkerElement({ map, position: pos })
  infoWindow.setContent(`<div style="font-weight:600">${initialAddress}</div>`)
  infoWindow.open({ map, anchor: marker! })

  const geocoder = new google.maps.Geocoder()

  map.addListener('click', e => {
    if (!e.latLng)
      return

    marker!.position = e.latLng

    geocoder.geocode({ location: e.latLng }, (res, status) => {
      if (status === 'OK' && res?.[0]) {
        const addr = res[0].formatted_address

        infoWindow.setContent(`<div style="font-weight:600">${addr}</div>`)
        infoWindow.open({ map, anchor: marker! })

        currentLat.value = e.latLng!.lat()
        currentLng.value = e.latLng!.lng()
        currentAddress.value = addr
        searchText.value = addr
      }
    })
  })
}

async function handleInput(val: string | null | undefined) {
  const input = val ?? '' // null → '' 변환

  searchText.value = input

  if (!input.trim()) {
    suggestions.value = []
    showSuggestions.value = false

    return
  }

  const placesLib = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
  const { AutocompleteSuggestion } = placesLib

  const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input,
    sessionToken: autocompleteToken,
  })

  suggestions.value = (result.suggestions || []).map(s => ({
    text: s.placePrediction?.text?.text || '',
  }))

  showSuggestions.value = suggestions.value.length > 0
}

async function handleSelectSuggestion(description: string) {
  searchText.value = description
  showSuggestions.value = false

  const placesLib = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
  const { AutocompleteSuggestion, Place } = placesLib

  // 1) placeId 가져오기
  const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input: description,
    sessionToken: autocompleteToken,
  })

  const prediction = result.suggestions?.[0]?.placePrediction
  const placeId = prediction?.placeId

  if (!placeId)
    return

  // 2) place 상세정보 fetch
  const place = new Place({ id: placeId })

  await place.fetchFields({
    fields: [
      'displayName',
      'formattedAddress',
      'location',
      'addressComponents',
    ],
  })

  if (!place.location)
    return

  const loc = place.location

  // 지도 업데이트
  map.setCenter(loc)
  map.setZoom(15)
  marker!.position = loc

  const fullAddr = place.formattedAddress || place.displayName || description

  infoWindow.setContent(`
    <div style="font-weight:600">${place.displayName}</div>
    <div style="font-size:13px">${fullAddr}</div>
  `)
  infoWindow.open({ map, anchor: marker! })

  currentLat.value = loc.lat()
  currentLng.value = loc.lng()

  // 🔥 핵심 수정: formattedAddress 사용
  currentAddress.value = fullAddr

  searchText.value = fullAddr
}

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
      style="background:#fff;"
    >
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
          @click="dialog = false"
        />
      </VCardTitle>

      <VCardText
        class="pa-4"
        style="position:relative;"
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
            @click:clear="() => { searchText = ''; suggestions = []; showSuggestions = false }"
            @update:model-value="handleInput"
          />

          <VList
            v-if="showSuggestions && suggestions.length"
            class="autocomplete-list"
          >
            <VListItem
              v-for="(item, i) in suggestions"
              :key="i"
              @click="handleSelectSuggestion(item.text)"
            >
              <VListItemTitle>{{ item.text }}</VListItemTitle>
            </VListItem>
          </VList>
        </div>

        <div
          id="map"
          class="rounded-lg"
          style="border:1px solid rgba(0,0,0,0.1); height:480px; width:calc(100% - 16px); margin:auto;"
        />
      </VCardText>

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
  width: 340px;
  top: 32px;
  left: 32px;
}
.search-input {
  position: relative;
  z-index: 40;
  border-radius: 8px;
  background-color: white !important;
  height: 44px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  width: 100%;
}
.autocomplete-list {
  position: absolute;
  z-index: 50;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  width: 100%;
  top: 48px;
  left: 0;
  max-height: 220px;
  overflow-y: auto;
}
.autocomplete-list .v-list-item {
  cursor: pointer;
}
.autocomplete-list .v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
