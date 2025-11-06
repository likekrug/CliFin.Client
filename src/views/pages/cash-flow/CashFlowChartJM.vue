<script setup lang="ts">
import { type Ref, computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

// --- 1. 데이터 및 인터페이스 정의 ---
interface SeriesItem {
  key: string
  name: string
  color: string
  visible: boolean
}

// 💡 Z-index 문제 해결을 위해 가장 큰 값인 Revenue를 배열의 가장 마지막에 배치합니다.
const seriesList: Ref<SeriesItem[]> = ref([
  { key: 'operation', name: 'Operation expense', color: '#5DBE88', visible: true },
  { key: 'fuel', name: 'Fuel expense', color: '#FF7F50', visible: true },
  { key: 'tax', name: 'Tax', color: '#FFDA9D', visible: true },
  { key: 'insurance', name: 'Insurance', color: '#90EE90', visible: true },
  { key: 'debt', name: 'Debt service', color: '#3CB371', visible: true },
  { key: 'equity', name: 'Cash flow to equity', color: '#8A2BE2', visible: true },
  { key: 'revenue', name: 'Revenue', color: '#FFB84C', visible: true }, // Z-index 높음
])

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

// --- 2. Computed Series (Area Chart 타입 유지) ---
const series = computed(() => {
  const cashflowSeries = seriesList.value
    .filter(s => s.visible)
    .map(s => ({
      name: s.name,
      data: allSeriesData[s.key],
      type: 'area' as const,
      yAxisIndex: 0,
    }))

  return [
    ...cashflowSeries,
    { name: 'DSCR', data: dscrData, type: 'line' as const, yAxisIndex: 1 },
  ]
})

// --- 3. Computed Chart Options ---
const chartOptions = computed<ApexOptions>(() => {
  const cashflowSeriesCount = series.value.length - 1

  return {
    chart: {
      type: 'area',
      stacked: false, // 누적되지 않도록 명확히 설정
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    // 💡 dataLabels 비활성화
    dataLabels: {
      enabled: false,
      enabledOnSeries: [0, 1, 2, 3, 4, 5, 6], // 모든 현금 흐름 시리즈에 대해 비활성화. DSCR(last series)에는 적용 안됨.
    },
    colors: [...seriesList.value.filter(s => s.visible).map(s => s.color), '#FF00FF'],
    stroke: { curve: 'smooth', width: [...Array(cashflowSeriesCount).fill(2), 3] },
    fill: {
      type: 'solid',
      opacity: [...Array(cashflowSeriesCount).fill(0.4), 1],
    },
    markers: { size: 0 },
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
        title: { text: 'Cash Flow (USD)', style: { fontSize: '13px', fontWeight: 600 } },
        min: 0,

        // 💡 Y축 max 값을 늘려 넘침 현상 해결 (최대 Revenue 2900이므로 3000 이상으로 설정)
        max: 3000,
        tickAmount: 6,
        labels: { formatter: (val: number) => `$${(val / 1000).toFixed(0)}K` },
      },
      {
        opposite: true,
        title: { text: 'DSCR', style: { color: '#FF00FF', fontSize: '13px', fontWeight: 600 } },
        labels: { style: { colors: '#FF00FF' }, formatter: (val: number) => val.toFixed(1) },
        min: 0,
        max: 3.5,
        tickAmount: 6,
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
      y: {
        formatter: (val: number) =>
          val <= 3.5 ? val.toFixed(2) : `$${val.toLocaleString()}`,
      },
    },
  }
})
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="d-flex align-center justify-space-between px-6 py-4 text-subtitle-1 font-weight-semibold">
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
          />
        </VCol>

        <VCol
          cols="12"
          md="9"
          class="pt-2"
        >
          <VueApexCharts
            type="area"
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

.gap-y-2 > * + * {
  margin-block-start: 6px;
}
</style>
