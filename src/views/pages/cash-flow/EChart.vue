<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { LineChart } from 'echarts/charts'

import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, SeriesOption } from 'echarts'
import VChart from 'vue-echarts'
import { useTheme } from 'vuetify'

// --------------------------------------------------
// 🔹 Types
// --------------------------------------------------
interface FigureSeries {
  order: string
  id: string
  label: string
  name: string
  type: 'line' | 'area'
  y: number[]
  axis?: 'right'
}

interface FigureData {
  x: (string | number)[]
  series: FigureSeries[]
  axes: {
    left: string
    right: string
  }
}

// --------------------------------------------------
// 🔹 Props
// --------------------------------------------------
const props = defineProps<{
  figure: FigureData
  loading?: boolean
}>()

// --------------------------------------------------
// 🔹 Vuetify theme
// --------------------------------------------------
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

// --------------------------------------------------
// 🔹 ECharts modules
// --------------------------------------------------
use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
])

// --------------------------------------------------
// 🔹 Internal state
// --------------------------------------------------
const isChartReady = ref(false)

watch(
  () => props.figure,
  async () => {
    isChartReady.value = false
    await nextTick()
    isChartReady.value = true
  },
  { immediate: true, deep: true },
)

// --------------------------------------------------
// 🔹 Color map
// --------------------------------------------------
const SERIES_COLOR: Record<string, string> = {
  REV: '#000000',
  OPEX: '#6A5ACD',
  MAINT: '#9CA3AF',
  RESERV: '#5AB0F8',
  TAX: '#FFD86F',
  DEBT: '#C084FC',
  CFE: '#D8D3FF',
  DSCR: '#FF69B4',
}

// --------------------------------------------------
// 🔹 Sorted series
// --------------------------------------------------
const sortedSeries = computed(() =>
  [...props.figure.series].sort(
    (a, b) => Number(a.order) - Number(b.order),
  ),
)

const chartSeries = computed<SeriesOption[]>(() =>
  sortedSeries.value.map(s => {
    const color = SERIES_COLOR[s.id] ?? '#999'
    const isDSCR = s.id === 'DSCR'
    const isRevenue = s.id === 'REV'

    const base: SeriesOption = {
      type: 'line',
      name: s.name,
      smooth: true,
      symbol: 'none',
      yAxisIndex: s.axis === 'right' ? 1 : 0,
      stack: !isDSCR && !isRevenue ? 'Total' : undefined,
      lineStyle: {
        width: isDSCR || isRevenue ? 2.5 : 1.5,
        color,
      },
      itemStyle: { color },
      data: s.y,
    }

    if (!isDSCR && !isRevenue) {
      ;(base as any).areaStyle = {
        opacity: 0.8,
        color: `${color}55`,
      }
    }

    return base
  }),
)

// --------------------------------------------------
// 🔹 Chart Options
// --------------------------------------------------
const chartOptions = computed(() => {
  const xAxisLabels = props.figure.x.map(v =>
    typeof v === 'number' ? `Year ${v}` : v,
  )

  const legendTextColor = isDark.value ? '#D1D5DB' : '#6B7280'
  const legendInactiveColor = isDark.value ? '#4B5563' : '#D1D5DB'

  return {
    animation: true,
    animationDuration: 300,
    animationEasing: 'cubicOut',

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: isDark.value
        ? 'rgba(30,30,30,95%)'
        : 'rgba(255,255,255,95%)',
      borderColor: isDark.value ? '#374151' : '#E5E7EB',
      textStyle: {
        color: isDark.value ? '#E5E7EB' : '#111827',
        fontFamily:
          '"Public Sans", Inter, "Helvetica Neue", Arial, sans-serif',
        fontSize: 12.5,
      },

    },

    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 22,

      data: chartSeries.value
        .map(s => s.name)
        .filter((name): name is string => Boolean(name)),

      textStyle: {
        fontFamily:
      '"Public Sans", Inter, "Helvetica Neue", Arial, sans-serif',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 28,
        color: legendTextColor,
      },

      inactiveColor: legendInactiveColor,
    },

    grid: {
      left: '5%',
      right: '5%',
      bottom: '12%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisLabels,
      axisLabel: {
        color: isDark.value ? '#9CA3AF' : '#6B7280',
      },
    },

    yAxis: [
      { /* left axis */ },
      { /* right axis */ },
    ],

    series: chartSeries.value,
  } satisfies EChartsOption
})
</script>

<template>
  <VCard class="projection-wrapper pa-0">
    <VCardTitle class="px-6 py-4">
      Cash Flow Overview
    </VCardTitle>

    <VDivider />

    <VCardText class="px-6 py-4 position-relative">
      <VOverlay
        :model-value="loading || !isChartReady"
        contained
        class="align-center justify-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
          size="42"
        />
      </VOverlay>

      <VChart
        v-if="isChartReady"
        :option="chartOptions"
        autoresize
        style="block-size: 520px;"
      />
    </VCardText>
  </VCard>
</template>

<style scoped>
.projection-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 10px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%);
}

/* Legend style */
:deep(.echarts-legend-text) {
  font-family: "Public Sans", Inter, "Helvetica Neue", Arial, sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 18px;
}

:deep(.echarts-legend-item) {
  margin-right: 18px;
}

:deep(.echarts-legend-item.inactive .echarts-legend-text) {
  fill: rgba(156, 163, 175, 60%);
}

:deep(.v-theme--dark .echarts-legend-text) {
  fill: #d1d5db;
}
</style>
