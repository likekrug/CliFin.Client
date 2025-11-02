<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'selectLocation', payload: { lat: number; lng: number; address: string }): void
}>()

const dialog = defineModel<boolean>({ required: true })

// 기본 중심 좌표 (서울)
const defaultCenter = { lat: 37.5665, lng: 126.978 }
const center = ref(defaultCenter)

let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement
let infoWindow: google.maps.InfoWindow

const currentLat = ref<number | null>(null)
const currentLng = ref<number | null>(null)
const currentAddress = ref('')

const isConfirmDisabled = computed(() => !currentLat.value || !currentLng.value)

// 다이얼로그 열릴 때 지도 초기화
watch(dialog, async val => {
  if (!val)
    return
  await nextTick()

  // ✅ 사용자 위치 가져오기 (권한 허용 시)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        center.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        initMap()
      },
      () => {
        center.value = defaultCenter
        initMap()
      },
    )
  }
  else {
    center.value = defaultCenter
    initMap()
  }
})

// 지도 초기화
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
    center: center.value,
    zoom: 13,
    mapTypeControl: false,
    mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
  })

  marker = new AdvancedMarkerElement({ map })
  infoWindow = new google.maps.InfoWindow({})

  // ✅ 검색 오버레이 설정
  const overlayEl = document.getElementById('map-search-overlay') as HTMLElement

  overlayEl.innerHTML = ''

  const placeAutocomplete = new PlaceAutocompleteElement()

  placeAutocomplete.id = 'place-autocomplete-input'
  placeAutocomplete.locationBias = center.value
  overlayEl.appendChild(placeAutocomplete)

  // 자동완성 선택 시 이동
  placeAutocomplete.addEventListener('gmp-select', async (event: any) => {
    const placePrediction = event.placePrediction
    const place = placePrediction.toPlace()

    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'viewport'] })

    const loc = place.location
    if (!loc)
      return

    if (place.viewport) {
      map.fitBounds(place.viewport)
    }
    else {
      map.setCenter(loc)
      map.setZoom(17)
    }

    marker.position = loc
    infoWindow.setContent(`
      <div style="font-weight:600">${place.displayName}</div>
      <div style="font-size:13px">${place.formattedAddress}</div>
    `)
    infoWindow.open({ map, anchor: marker, shouldFocus: false })

    currentLat.value = loc.lat()
    currentLng.value = loc.lng()
    currentAddress.value = place.formattedAddress || ''
  })

  // 지도 클릭 시 마커 이동
  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    if (!e.latLng)
      return
    const loc = e.latLng

    map.setCenter(loc)
    marker.position = loc
    infoWindow.setContent('Selected location')
    infoWindow.setPosition(loc)
    infoWindow.open({ map, anchor: marker, shouldFocus: false })
    currentLat.value = loc.lat()
    currentLng.value = loc.lng()
    currentAddress.value = ''
  })
}

// Confirm 클릭 시 부모로 전달
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

        <!-- Close Button -->
        <VBtn
          icon="ri-close-line"
          size="small"
          variant="text"
          color="secondary"
          @click="dialog = false"
        />
      </VCardTitle>

      <!-- Map -->
      <VCardText
        class="pa-4"
        style="position: relative;"
      >
        <div id="map-search-overlay" />
        <div
          id="map"
          class="rounded-lg"
          style="border: 1px solid rgba(0, 0, 0, 10%); block-size: 480px; inline-size: calc(100% - 16px); margin-inline: auto;"
        />
      </VCardText>

      <!-- Actions -->
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
          :disabled="isConfirmDisabled"
          @click="handleConfirm"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style>
/* ✅ 구글 자동완성 입력창 테두리/포커스 완전 커스텀 */
gmpx-place-autocomplete::part(input) {
  border: 1px solid rgba(0, 0, 0, 10%);
  border-radius: 8px;
  color: rgb(var(--v-theme-on-surface));
  font-size: 14px;
  padding-block: 8px;
  padding-inline: 10px;
  transition: border 0.2s, box-shadow 0.2s;
}

gmpx-place-autocomplete::part(input):focus {
  border: 2px solid rgb(var(--v-theme-primary));
  box-shadow: 0 0 6px rgba(var(--v-theme-primary), 0.5);
  outline: none;
}
</style>

<style scoped>
#map-search-overlay {
  position: absolute;
  z-index: 5;
  padding: 4px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 15%);
  inset-block-start: 16px;
  inset-inline-start: 16px; /* ✅ 왼쪽 정렬 */
}
</style>
