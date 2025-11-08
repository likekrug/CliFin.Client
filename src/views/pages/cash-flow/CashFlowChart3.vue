<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ApexOptions } from 'apexcharts'

// -------------------------------
// 🔹 체크박스 상태 관리
// -------------------------------
const seriesList = ref([
  { key: 'revenue', name: 'Revenue', color: '#FFB84C', visible: true },
  { key: 'operation', name: 'Operation expense', color: '#5DBE88', visible: true },
  { key: 'fuel', name: 'Fuel expense', color: '#FF7F50', visible: true },
  { key: 'tax', name: 'Tax', color: '#FFDA9D', visible: true },
  { key: 'insurance', name: 'Insurance', color: '#90EE90', visible: true },
  { key: 'debt', name: 'Debt service', color: '#3CB371', visible: true },
  { key: 'equity', name: 'Cash flow to equity', color: '#8A2BE2', visible: true },
])

// -------------------------------
// 🔹 데이터 정의
// -------------------------------
const allSeriesData: Record<string, number[]> = {
  revenue: [1200, 1500, 1700, 2000, 2300, 2600, 2900],
  operation: [800, 900, 1100, 1300, 1500, 1700, 1900],
  fuel: [400, 500, 700, 800, 900, 1000, 1200],
  tax: [200, 250, 270, 290, 310, 330, 350],
  insurance: [150, 180, 190, 210, 230, 250, 270],
  debt: [600, 650, 700, 750, 800, 850, 900],
  equity: [300, 350, 400, 450, 500, 550, 600],
}

const dscrData = [2.9, 2.7, 2.5, 2.3, 2.1, 1.9, 1.7]
const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']

// -------------------------------
// 🔹 DSCR 정규화 (Cash Flow 축 비례)
// -------------------------------
const dscrMax = 3.5
const cashFlowMax = 3500
const scaledDscrData = dscrData.map(v => (v / dscrMax) * cashFlowMax)

// -------------------------------
// 🔹 Cash Flow (Area Chart)
// -------------------------------
const areaSeries = computed(() =>
  seriesList.value
    .filter(s => s.visible)
    .map(s => ({
      name: s.name,
      data: allSeriesData[s.key],
    })),
)

const areaOptions = computed<ApexOptions>(() => ({
  chart: { type: 'area', stacked: false, toolbar: { show: false } },
  fill: { type: 'solid', opacity: 0.45 },
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  colors: seriesList.value.filter(s => s.visible).map(s => s.color),
  grid: { borderColor: '#e0e0e0', strokeDashArray: 4 },
  xaxis: {
    categories: years,
    title: { text: 'Period', style: { fontSize: '13px', fontWeight: 600 } },
  },
  yaxis: {
    min: 0,
    max: cashFlowMax,
    tickAmount: 6,
    title: { text: 'Cash Flow (USD)', style: { fontSize: '13px', fontWeight: 600 } },
    labels: { formatter: (v: number) => `$${(v / 1000).toFixed(0)}K` },
  },
  tooltip: {
    shared: true,
    theme: 'light',
    y: { formatter: (v: number) => `$${v.toLocaleString()}` },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
    markers: { width: 10, height: 10, radius: 12 },
  },
}))

// -------------------------------
// 🔹 DSCR (Line Chart Overlay)
// -------------------------------
const dscrSeries = [{ name: 'DSCR', data: scaledDscrData }]

const lineOptions = computed<ApexOptions>(() => ({
  chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#FF00FF'],
  dataLabels: { enabled: false },
  xaxis: {
    categories: years,
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: {
    opposite: true,
    min: 0,
    max: cashFlowMax,
    tickAmount: 6,
    title: { text: 'DSCR', style: { color: '#FF00FF', fontSize: '13px', fontWeight: 600 } },
    labels: {
      style: { colors: '#FF00FF' },
      formatter: (v: number) => ((v / cashFlowMax) * dscrMax).toFixed(1),
    },
  },
  grid: { show: false },
  tooltip: { enabled: false },
}))
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="px-6 py-4 text-subtitle-1 font-weight-semibold">
      Cash Flow & DSCR Overview
    </VCardTitle>

    <VCardSubtitle class="px-6 text-body-2 text-medium-emphasis">
      Individual performance by category
    </VCardSubtitle>

    <VCardText class="px-6 py-4">
      <VRow>
        <VCol
          cols="12"
          md="3"
          class="d-flex flex-column gap-2"
        >
          <VCheckbox
            v-for="item in seriesList"
            :key="item.key"
            v-model="item.visible"
            :label="item.name"
            :color="item.color"
            density="comfortable"
            hide-details
          />
        </VCol>

        <VCol
          cols="12"
          md="9"
          class="pt-2"
        >
          <div class="chart-wrapper">
            <VueApexCharts
              height="450"
              type="area"
              :options="areaOptions"
              :series="areaSeries"
              class="base-chart"
            />
            <VueApexCharts
              height="450"
              type="line"
              :options="lineOptions"
              :series="dscrSeries"
              class="overlay-line"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
}

.base-chart {
  position: relative;
  z-index: 1;
}

.overlay-line {
  position: absolute;
  z-index: 2;
  inset: 0;
  pointer-events: none;
}
</style>
