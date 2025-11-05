<script setup lang="ts">
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

// -------------------------------
// 🔹 데이터 타입 정의
// -------------------------------
interface SeriesItem {
  key: string
  name: string
  color: string
  visible: boolean
}

// -------------------------------
// 🔹 체크박스 상태 관리 (노란/연두 계열)
// -------------------------------
const seriesList = ref<SeriesItem[]>([
  { key: 'revenue', name: 'Revenue', color: '#FFB84C', visible: true },
  { key: 'operation', name: 'Operation expense', color: '#5DBE88', visible: true },
  { key: 'fuel', name: 'Fuel expense', color: '#FF7F50', visible: true },
  { key: 'tax', name: 'Tax', color: '#FFDA9D', visible: true },
  { key: 'insurance', name: 'Insurance', color: '#90EE90', visible: true },
  { key: 'debt', name: 'Debt service', color: '#3CB371', visible: true },
  { key: 'equity', name: 'Cash flow to equity', color: '#8A2BE2', visible: true },
])

// -------------------------------
// 🔹 Cash Flow 및 DSCR 데이터
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

// -------------------------------
// 🔹 좌측 Y축 자동 계산
// -------------------------------
const yAxisRange = computed(() => {
  const FIXED_MAX = 3500
  const activeKeys = seriesList.value.filter(s => s.visible).map(s => s.key)
  const allValues = activeKeys.flatMap(k => allSeriesData[k] ?? [])
  if (!allValues.length)
    return { min: 0, max: FIXED_MAX }

  const dataMax = Math.max(...allValues)
  const max = dataMax > FIXED_MAX ? dataMax * 1.1 : FIXED_MAX

  return { min: 0, max }
})

// -------------------------------
// 🔹 시리즈 구성
// -------------------------------
const series = computed(() => {
  const lineSeries = seriesList.value
    .filter(s => s.visible)
    .map(s => ({
      name: s.name,
      data: allSeriesData[s.key],
      type: 'line' as const,
      yAxisIndex: 0,
    }))

  const dscrSeries = {
    name: 'DSCR',
    data: dscrData,
    type: 'line' as const,
    yAxisIndex: 1,
  }

  return [...lineSeries, dscrSeries]
})

// -------------------------------
// 🔹 색상 설정
// -------------------------------
const chartColors = computed<string[]>(() => [
  ...seriesList.value.filter(s => s.visible).map(s => s.color),
  '#FF00FF', // DSCR 색상
])

// -------------------------------
// 🔹 ApexCharts 옵션
// -------------------------------
const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'line',
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: chartColors.value,
  fill: { type: 'solid', opacity: 0.9 },
  stroke: { curve: 'smooth', width: [...Array(series.value.length - 1).fill(2), 3] },
  dataLabels: { enabled: false },
  grid: { borderColor: '#e0e0e0', strokeDashArray: 4 },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
    fontWeight: 500,
    markers: { width: 10, height: 10, radius: 12 },
  },
  xaxis: {
    categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    title: { text: 'Period', style: { fontSize: '13px', fontWeight: 600 } },
  },
  yaxis: [
    {
      title: { text: 'USD', style: { fontSize: '13px', fontWeight: 600 } },
      min: yAxisRange.value.min,
      max: yAxisRange.value.max,
      tickAmount: 6,
      labels: {
        formatter: (val: number) => {
          if (Math.abs(val) < 1000)
            return `$${val.toFixed(0)}`
          if (Math.abs(val) < 1_000_000)
            return `$${(val / 1000).toFixed(1)}K`

          return `$${(val / 1_000_000).toFixed(1)}M`
        },
      },
    },
    {
      opposite: true,
      title: { text: 'DSCR', style: { color: '#FF00FF', fontSize: '13px', fontWeight: 600 } },
      labels: { style: { colors: '#FF00FF' }, formatter: (val: number) => val.toFixed(1) },
      min: 0,
      max: 3,
      tickAmount: 6,
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    y: { formatter: (val: number) => (val <= 3 ? val.toFixed(2) : `$${val.toLocaleString()}`) },
  },
}))
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="d-flex align-center justify-space-between px-6 py-4">
      Cash Flow & DSCR Overview
    </VCardTitle>

    <VCardSubtitle class="px-6 text-body-2 text-medium-emphasis">
      Individual performance by category
    </VCardSubtitle>

    <VCardText class="px-6 py-4">
      <VRow>
        <!-- 🔹 체크박스 영역 -->
        <VCol
          cols="12"
          md="3"
          class="d-flex flex-column gap-y-2"
        >
          <VCheckbox
            v-for="item in seriesList"
            :key="item.key"
            v-model="item.visible"
            :label="item.name"
            :color="item.color"
            density="comfortable"
            hide-details
            class="text-high-emphasis"
          />
        </VCol>

        <!-- 🔹 차트 영역 -->
        <VCol
          cols="12"
          md="9"
          class="pt-2"
        >
          <VueApexCharts
            v-if="series.length > 0"
            type="line"
            height="450"
            :series="series"
            :options="chartOptions"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 5%);
}

/* 🔹 체크박스 간격 조정 */
.gap-y-2 > * + * {
  margin-block-start: 6px;
}
</style>
