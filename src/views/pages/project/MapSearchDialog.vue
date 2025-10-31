<script setup lang="ts">
import { defineEmits, nextTick, watch } from 'vue'

const emit = defineEmits<{
  (e: 'select-location', payload: { lat: number; lng: number; address: string }): void
}>()

const dialog = defineModel<boolean>({ required: true })

const center = { lat: 37.5665, lng: 126.978 } // 서울 기본

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement
let infoWindow: google.maps.InfoWindow
let currentLat = center.lat
let currentLng = center.lng
let currentAddress = ''

// 🔹 다이얼로그 열릴 때 지도 초기화
watch(dialog, async val => {
  if (!val)
    return

  await nextTick() // DOM 완성 대기
  await initMap()
})

async function initMap() {
  const mapEl = document.getElementById('map')
  if (!mapEl)
    return

  const [{ Map }, { AdvancedMarkerElement }, { PlaceAutocompleteElement }] = await Promise.all([
    google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
    google.maps.importLibrary('places') as Promise<google.maps.PlacesLibrary>,
  ])

  map = new Map(mapEl, {
    center,
    zoom: 13,
    mapTypeControl: false,
  })

  marker = new AdvancedMarkerElement({ map })
  infoWindow = new google.maps.InfoWindow({})

  // ✅ 지도 위 검색창 오버레이 (다이얼로그 내부 DOM에 append)
  const overlayEl = document.getElementById('map-search-overlay') as HTMLElement

  overlayEl.innerHTML = '' // 중복 방지

  const placeAutocomplete = new PlaceAutocompleteElement()

  placeAutocomplete.id = 'place-autocomplete-input'
  placeAutocomplete.locationBias = center
  overlayEl.appendChild(placeAutocomplete)

  // ✅ 자동완성 선택 시 지도 이동 + 마커 표시
  placeAutocomplete.addEventListener('gmp-select', async (event: any) => {
    const placePrediction = event.placePrediction
    const place = placePrediction.toPlace()

    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'viewport'] })

    const loc = place.location
    if (!loc)
      return

    if (place.viewport) { map.fitBounds(place.viewport) }
    else {
      map.setCenter(loc)
      map.setZoom(map.getZoom() ?? 17)
    }

    marker.position = loc
    infoWindow.setContent(`
      <div style="font-weight:600">${place.displayName}</div>
      <div style="font-size:13px">${place.formattedAddress}</div>
    `)
    infoWindow.open({ map, anchor: marker, shouldFocus: false })

    currentLat = loc.lat()
    currentLng = loc.lng()
    currentAddress = place.formattedAddress || ''
  })

  // ✅ 지도 클릭 시 마커 이동
  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    if (!e.latLng)
      return
    const loc = e.latLng

    map.setCenter(loc)
    marker.position = loc
    infoWindow.setContent('Selected location')
    infoWindow.setPosition(loc)
    infoWindow.open({ map, anchor: marker, shouldFocus: false })
    currentLat = loc.lat()
    currentLng = loc.lng()
    currentAddress = ''
  })
}

// ✅ 부모에게 결과 전달
function handleConfirm() {
  emit('select-location', {
    lat: currentLat,
    lng: currentLng,
    address: currentAddress,
  })
  dialog.value = false
}
</script>

<template>
  <VDialog
    v-model="dialog"
    width="800"
  >
    <VCard>
      <VCardTitle class="text-h6 px-4 py-2">
        Search Location
      </VCardTitle>

      <VCardText
        class="pa-0"
        style="position: relative;"
      >
        <div id="map-search-overlay" />
        <div
          id="map"
          style="block-size: 500px; inline-size: 100%;"
        />
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="dialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
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
  z-index: 5;
  padding: 4px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 20%);
  inset-block-start: 12px;
  inset-inline-start: 12px;
}
</style>
