<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'

import LineChart from '@core/libs/chartjs/components/LineChart'
import { getLineAreaChartConfig } from '@core/libs/chartjs/chartjsConfig'

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend)

// -------------------------------
// 🔹 시리즈 정의 (Z-index를 위해 Revenue를 Order 1로 설정)
// -------------------------------
const seriesList = ref([
  { key: 'revenue', name: 'Revenue', color: '#FFB84C', visible: true },
  { key: 'operation', name: 'Operation expense', color: '#5DBE88', visible: true },
  { key: 'fuel', name: 'Fuel expense', color: '#FF7F50', visible: true },
  { key: 'tax', name: 'Tax', color: '#FFDA9D', visible: true },
  { key: 'insurance', name: 'Insurance', color: '#90EE90', visible: true },
  { key: 'debt', name: 'Debt service', color: '#3CB371', visible: true },
  { key: 'equity', name: 'Cash flow to equity', color: '#8A2BE2', visible: true },
  { key: 'dscr', name: 'DSCR', color: '#FF00FF', visible: true },
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
  dscr: [3.0, 2.8, 2.6, 2.3, 2.0, 1.8, 1.6],
}

// -------------------------------
// 🔹 체크박스 반영된 Dataset (투명도 CC로 변경)
// -------------------------------
const datasets = computed(() =>
  seriesList.value
    .filter(s => s.visible)
    .map(s => {
      if (s.key === 'dscr') {
        return {
          label: s.name,
          data: allSeriesData[s.key],
          borderColor: s.color,
          borderWidth: 2,
          backgroundColor: 'transparent',
          yAxisID: 'y1',
          tension: 0.55,
          cubicInterpolationMode: 'monotone',
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
          order: 99, // 가장 위 (선)
        }
      }
      else {
        // Revenue는 가장 아래 Z-index (Order 1), 나머지는 Order 2
        const datasetOrder = s.key === 'revenue' ? 1 : 2

        return {
          label: s.name,
          data: allSeriesData[s.key],
          borderColor: s.color,

          // 💡 투명도 CC (80%) 적용: 면적 구분이 명확해지도록 설정
          backgroundColor: (ctx: any) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300) // 캔버스 높이에 맞춰 그라데이션 정의

            // 시작점 (상단): 80% 불투명도 ('CC')
            gradient.addColorStop(0, `${s.color}CC`)

            // 끝점 (하단): 완전 투명 ('00')
            gradient.addColorStop(1, `${s.color}10`)

            return gradient
          },
          yAxisID: 'y',
          tension: 0.55,
          cubicInterpolationMode: 'monotone',
          borderWidth: 2,
          fill: 'origin',
          pointRadius: 0,
          pointHoverRadius: 0,
          order: datasetOrder,
        }
      }
    }),
)

// -------------------------------
// 🔹 Chart.js 옵션
// -------------------------------
const vuetifyTheme = useTheme()

const chartConfig = computed(() => {
  const base = getLineAreaChartConfig(vuetifyTheme.current.value)

  return {
    ...base,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 0, bottom: 5, left: 5, right: 15 },
    },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 16,
          font: {
            size: 13,
            family: 'Public Sans, sans-serif',
          },
        },
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y

            return context.dataset.yAxisID === 'y1'
              ? `DSCR: ${value.toFixed(2)}`
              : `$${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Cash Flow (USD)' },
        max: 3500,
        min: 0,
        ticks: {
          callback: (val: number | string) => `$${(Number(val) / 1000).toFixed(0)}K`,
        },
        grid: { drawOnChartArea: true },
        stacked: false,
        afterFit: scale => {
          scale.top += 40
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'DSCR' },
        min: 0,
        max: 3.5,
        grid: { drawOnChartArea: false },
        ticks: { color: '#FF00FF' },
        afterFit: scale => {
          scale.top += 40
        },
      },
      x: {
        title: { display: true, text: 'Period' },
      },
    },
  }
})

// -------------------------------
// 🔹 차트 데이터
// -------------------------------
const chartData = computed(() => ({
  labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
  datasets: datasets.value,
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

    <VCardText class="px-6 pt-2 pb-4">
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
            class="text-high-emphasis"
          />
        </VCol>

        <VCol
          cols="12"
          md="9"
        >
          <div style="block-size: 480px;">
            <LineChart
              :chart-data="chartData"
              :chart-options="chartConfig"
            />
          </div>
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
