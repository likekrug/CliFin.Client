<script setup lang="ts">
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { nextTick, onMounted, ref } from 'vue'

const mapRef = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)

/* ------------------------------
 🔹 에너지 타입별 색상
------------------------------ */
const colors: Record<string, string> = {
  'Solar': '#8BC34A',
  'Natural Gas': '#D4A017',
  'Coal': '#333333',
}

/* ------------------------------
 🔹 프로젝트 데이터
------------------------------ */
const projects = [
  { name: 'Seoul Solar Plant', type: 'Solar', result: 'DEFAULT', lat: 37.5665, lon: 126.978 },
  { name: 'Tokyo Gas Facility', type: 'Natural Gas', result: 'EOD', lat: 35.6895, lon: 139.6917 },
  { name: 'Los Angeles Coal Plant', type: 'Coal', result: 'PASS', lat: 34.0522, lon: -118.2437 },
]

const resultColors: Record<string, string> = {
  DEFAULT: '#FF4D4D', // 빨강
  EOD: '#FFB400', // 노랑
  PASS: '#4CAF50', // 초록
}

onMounted(async () => {
  await nextTick()
  if (!mapRef.value)
    return

  map.value = L.map(mapRef.value, {
    zoomControl: true,
    preferCanvas: true,
  }).setView([20, 0], 2)

  // OpenStreetMap 타일
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  // 마커 표시
  projects.forEach(p => {
    const color = resultColors[p.result]

    const marker = L.circleMarker([p.lat, p.lon], {
      radius: 6,
      color,
      fillColor: color,
      fillOpacity: 1,
      weight: 2,
    }).addTo(map.value!)

    marker.bindPopup(`
    <b>${p.name}</b><br>
    Type: ${p.type}<br>
    Result: ${p.result}
  `)
  })

  // 범례 추가
  const legend = L.control({ position: 'bottomright' })

  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'legend-container')

    div.innerHTML = `
      <div class="legend-title">Result Status</div>
      ${Object.entries(resultColors)
    .map(([key, val]) => `<div class="legend-item"><span class="legend-color" style="background:${val}"></span>${key}</div>`)
    .join('')}
    `

    return div
  }
  legend.addTo(map.value)
})

// 보기 전환
const setWorldView = () => map.value?.setView([20, 0], 2)
const setKoreaView = () => map.value?.setView([36.5, 127.8], 7)
const setTokyoView = () => map.value?.setView([35.6895, 139.6917], 10)
const setLAView = () => map.value?.setView([34.0522, -118.2437], 10)

const scenarioColors: Record<string, string> = {
  Baseline: '#6C757D', // gray
  SSP126: '#2196F3', // blue
  SSP585: '#F44336', // red
  SSP170: '#FFB400', // yellow
}

const selectedScenario = ref<'Baseline' | 'SSP126' | 'SSP585' | 'SSP170'>('Baseline')

watch(selectedScenario, sc => {
  console.log('선택된 시나리오:', sc)

  // 여기서 지도 업데이트 로직 넣으면 됨
})
</script>

<template>
  <VCard
    elevation="0"
    class="projection-wrapper ma-0 pa-5"
    outline
  >
    <VCardTitle>
      Map
    </VCardTitle>

    <VDivider class="custom-divider" />
    <!-- 헤더 -->
    <div class="d-flex align-center gap-2 mb-4 ma-4">
      <div class="vertical-bar me-2" />
      <span class="scenario-label"> Scenario :</span>

      <VBtn
        v-for="sc in Object.keys(scenarioColors)"
        :key="sc"
        size="small"
        :color="selectedScenario === sc ? scenarioColors[sc] : undefined"
        :variant="selectedScenario === sc ? 'flat' : 'outlined'"
        :class="{ 'scenario-unselected': selectedScenario !== sc }"
        @click="selectedScenario = sc"
      >
        {{ sc }}
      </VBtn>
    </div>

    <!-- 지도 영역 -->
    <div
      ref="mapRef"
      class="map-area"
    />
  </VCard>
</template>

<style scoped lang="scss">
// .energy-map-card {
//   border-radius: 14px;
//   background-color: rgb(var(--v-theme-surface));
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 8%);
// }

.projection-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.2) !important;
  border-radius: 10px !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%) !important;
}

.custom-divider {
  border: none !important;
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
  opacity: 1 !important;
}

.v-btn.flat {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 15%);
}

.scenario-unselected {
  opacity: 0.5;
}

.scenario-label {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}

/* 지도 영역 */
.map-area {
  z-index: 1;
  overflow: hidden;
  border-radius: 12px;
  block-size: 520px;
  inline-size: 100%;
}

/* Vuetify 영향 차단 */
::v-deep(.leaflet-container path) {
  fill: inherit !important;
  stroke: inherit !important;
  vector-effect: non-scaling-stroke !important;
}

::v-deep(.leaflet-interactive) {
  fill-opacity: 1 !important;
  stroke-opacity: 1 !important;
}

/* 범례 스타일 */
::v-deep(.legend-container) {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 10px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 8%);
  color: rgba(var(--v-theme-on-surface), 0.87);
  font-size: 0.85rem;
  padding-block: 10px;
  padding-inline: 14px;
}

::v-deep(.legend-title) {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  margin-block-end: 6px;
}

::v-deep(.legend-item) {
  display: flex;
  align-items: center;
  margin-block-start: 4px;
}

::v-deep(.legend-color) {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 30%);
  border-radius: 3px;
  block-size: 14px;
  inline-size: 14px;
  margin-inline-end: 8px;
}
</style>
