<script setup lang="ts">
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

/* ------------------------------
 🔹 Props
------------------------------ */
const props = defineProps<{
  projects: Array<{
    id: number
    name: string
    type: string
    location: string
  }>
  scenarioData: Record<string, Record<string, any>> // projectId -> scenario -> data
  selectedScenarios: string[]
}>()

const mapRef = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const markers = ref<L.CircleMarker[]>([])

/* ------------------------------
 🔹 DSCR 기준 색상
------------------------------ */
const resultColors: Record<string, string> = {
  DEFAULT: '#FF4D4D', // 빨강 - DSCR <= 1.0
  EOD: '#FFB400',     // 노랑 - 1.0 < DSCR <= 1.5
  PASS: '#4CAF50',    // 초록 - DSCR > 1.5
}

/* ------------------------------
 🔹 시나리오 색상
------------------------------ */
const scenarioColors: Record<string, string> = {
  Baseline: '#6C757D',
  SSP126: '#2196F3',
  SSP370: '#FFB400',
  SSP585: '#F44336',
}

const selectedScenario = ref<string>('Baseline')

/* ------------------------------
 🔹 DSCR 상태 판정
------------------------------ */
const getDscrStatus = (dscr: number | undefined): string => {
  if (dscr === undefined || dscr === null) return 'DEFAULT'
  if (dscr <= 1.0) return 'DEFAULT'
  if (dscr <= 1.5) return 'EOD'
  return 'PASS'
}

/* ------------------------------
 🔹 프로젝트별 Min DSCR 가져오기
------------------------------ */
const getProjectMinDscr = (projectId: number, scenario: string): number | undefined => {
  console.log(`🔍 [MultiMap] getProjectMinDscr - projectId: ${projectId}, scenario: ${scenario}`)
  console.log(`📦 [MultiMap] scenarioData:`, props.scenarioData)

  const projectData = props.scenarioData[String(projectId)]
  console.log(`📦 [MultiMap] projectData for ${projectId}:`, projectData)

  if (!projectData || !projectData[scenario]) {
    console.log(`⚠️ [MultiMap] No data for project ${projectId}, scenario ${scenario}`)
    return undefined
  }

  const scenarioResult = projectData[scenario]
  console.log(`📊 [MultiMap] scenarioResult:`, scenarioResult)

  // reportData에서 Min DSCR 찾기
  if (scenarioResult.reportData) {
    const minDscrItem = scenarioResult.reportData.find((item: any) => item.label === 'Min DSCR')
    if (minDscrItem) {
      console.log(`✅ [MultiMap] Found Min DSCR from reportData: ${minDscrItem.value}`)
      return parseFloat(minDscrItem.value)
    }
  }

  // chartData에서 dscr 배열의 최소값 사용 (0 제외 - Year 0은 의미없는 값)
  if (scenarioResult.chartData?.dscr?.length > 0) {
    const validDscr = scenarioResult.chartData.dscr.filter((v: number) => v > 0)
    if (validDscr.length > 0) {
      const minDscr = Math.min(...validDscr)
      console.log(`✅ [MultiMap] Calculated Min DSCR from chartData (excluding 0): ${minDscr}`)
      return minDscr
    }
  }

  console.log(`⚠️ [MultiMap] No DSCR data found`)
  return undefined
}

/* ------------------------------
 🔹 위치 파싱 (lat, lon)
------------------------------ */
const parseLocation = (location: string): [number, number] | null => {
  if (!location) return null
  const parts = location.split(',').map(s => parseFloat(s.trim()))
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]]
  }
  return null
}

/* ------------------------------
 🔹 마커 업데이트
------------------------------ */
const updateMarkers = () => {
  if (!map.value) return

  // 기존 마커 제거
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // 새 마커 추가
  props.projects.forEach(project => {
    const coords = parseLocation(project.location)
    if (!coords) return

    const minDscr = getProjectMinDscr(project.id, selectedScenario.value)
    const status = getDscrStatus(minDscr)
    const color = resultColors[status]

    const marker = L.circleMarker(coords, {
      radius: 8,
      color,
      fillColor: color,
      fillOpacity: 1,
      weight: 2,
    }).addTo(map.value!)

    marker.bindPopup(`
      <b>${project.name}</b><br>
      Type: ${project.type}<br>
      Scenario: ${selectedScenario.value}<br>
      Min DSCR: ${minDscr?.toFixed(2) ?? 'N/A'}<br>
      Status: <span style="color:${color};font-weight:bold">${status}</span>
    `)

    markers.value.push(marker)
  })
}

/* ------------------------------
 🔹 지도 초기화
------------------------------ */
onMounted(async () => {
  await nextTick()
  if (!mapRef.value) return

  map.value = L.map(mapRef.value, {
    zoomControl: true,
    preferCanvas: true,
  }).setView([20, 0], 2)

  // OpenStreetMap 타일
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  // 범례 추가
  const legend = L.control({ position: 'bottomright' })
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'legend-container')
    div.innerHTML = `
      <div class="legend-title">DSCR Status</div>
      <div class="legend-item"><span class="legend-color" style="background:${resultColors.DEFAULT}"></span>Default (≤1.0)</div>
      <div class="legend-item"><span class="legend-color" style="background:${resultColors.EOD}"></span>EOD (≤1.5)</div>
      <div class="legend-item"><span class="legend-color" style="background:${resultColors.PASS}"></span>Pass (>1.5)</div>
    `
    return div
  }
  legend.addTo(map.value)

  // 초기 마커 표시
  updateMarkers()
})

// 시나리오 변경 시 마커 업데이트
watch(selectedScenario, () => {
  updateMarkers()
})

// props 변경 시 마커 업데이트
watch(() => [props.projects, props.scenarioData], () => {
  updateMarkers()
}, { deep: true })

// 사용 가능한 시나리오 목록
const availableScenarios = computed(() => {
  if (props.selectedScenarios.length > 0) {
    return props.selectedScenarios
  }
  return ['Baseline', 'SSP126', 'SSP370', 'SSP585']
})

// 첫 시나리오로 자동 선택
watch(availableScenarios, (scenarios) => {
  if (scenarios.length > 0 && !scenarios.includes(selectedScenario.value)) {
    selectedScenario.value = scenarios[0]
  }
}, { immediate: true })
</script>

<template>
  <VCard
    elevation="0"
    class="projection-wrapper ma-0 pa-5"
    outline
  >
    <VCardTitle>
      Multi Project Map
    </VCardTitle>

    <VDivider class="custom-divider" />

    <!-- 데이터 없을 때 안내 -->
    <VAlert
      v-if="!projects.length"
      type="info"
      variant="tonal"
      class="ma-4"
    >
      시나리오 분석을 먼저 실행해주세요.
    </VAlert>

    <template v-else>
      <!-- 시나리오 선택 버튼 -->
      <div class="d-flex align-center gap-2 mb-4 ma-4">
        <div class="vertical-bar me-2" />
        <span class="scenario-label">Scenario :</span>

        <VBtn
          v-for="sc in availableScenarios"
          :key="sc"
          size="small"
          :color="selectedScenario === sc ? scenarioColors[sc] || '#888' : undefined"
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
    </template>
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
