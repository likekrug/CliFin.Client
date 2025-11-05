<script setup lang="ts">
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// -------------------------------
// 🔹 체크박스 상태 관리 (색상 변경됨)
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
// 🔹 전체 데이터
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

// -------------------------------
// 🔹 체크박스 반영된 시리즈 (차트 데이터)
// -------------------------------
const series = computed(() =>
  seriesList.value
    .filter(s => s.visible)
    .map(s => ({
      name: s.name,
      data: allSeriesData[s.key] ?? [0, 0, 0, 0, 0, 0, 0],
      type: 'area',
    })),
)

// -------------------------------
// 🔹 ApexCharts 옵션
// -------------------------------
const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: series.value.map(
    s => seriesList.value.find(item => item.name === s.name)?.color ?? '#999',
  ),
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.3,
      opacityFrom: 0.8,
      opacityTo: 0.4,
      stops: [0, 100],
    },
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#e0e0e0', strokeDashArray: 4 },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    markers: { width: 10, height: 10, radius: 12 },
    fontSize: '13px',
    fontWeight: 500,
  },
  xaxis: {
    categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
  },
  yaxis: {
    title: { text: 'USD', style: { fontSize: '13px', fontWeight: 600 } },
    labels: {
      formatter: (val: number) =>
        val !== undefined ? `${(val / 1000).toFixed(0)}K` : '',
    },
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) =>
        val !== undefined ? `$${val.toLocaleString()}` : '',
    },
  },
}))
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="d-flex align-center justify-space-between px-6 py-4">
      Cash Flow Overview (Non-stacked)
    </VCardTitle>

    <VCardSubtitle class="px-6 text-body-2 text-medium-emphasis">
      Individual performance by category
    </VCardSubtitle>

    <VCardText class="px-6 py-4">
      <VRow>
        <!-- 🔹 체크박스 구역 -->
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

/* 🔹 체크박스 간격 조정 */
.gap-y-2 > * + * {
  margin-block-start: 6px;
}
</style>
