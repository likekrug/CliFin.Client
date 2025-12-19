<script setup lang="ts">
import { computed } from 'vue'
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
import VChart from 'vue-echarts'

// --------------------------------------------------
// 🔹 Types (API figure 그대로)
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
// 🔹 색상 매핑 (id 기준)
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
// 🔹 series order 정렬
// --------------------------------------------------
const sortedSeries = computed(() =>
  [...props.figure.series].sort(
    (a, b) => Number(a.order) - Number(b.order),
  ),
)

// --------------------------------------------------
// 🔹 Chart Options
// --------------------------------------------------
const chartOptions = computed(() => {
  const xAxisLabels = props.figure.x.map(v =>
    typeof v === 'number' ? `Year ${v}` : v,
  )

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: { color: '#333' },
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#6a7985' },
      },
    },

    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      data: sortedSeries.value.map(s => s.name),
      textStyle: {
        fontSize: 12,
        color: '#444',
      },
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
    },

    yAxis: [
      {
        type: 'value',
        name: props.figure.axes.left,
        nameLocation: 'middle',
        nameGap: 75,
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 11,
          color: '#2E2E2E',
          fontWeight: 650,
        },
        axisLabel: {
          formatter: (v: number) =>
            `$${(v / 1_000_000).toFixed(1)}M`,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e0e0e0',
            type: 'dashed',
          },
        },
      },
      {
        type: 'value',
        name: props.figure.axes.right,
        position: 'right',
        nameLocation: 'middle',
        nameGap: 45,
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 10,
          color: SERIES_COLOR.DSCR,
          fontWeight: 600,
        },
        axisLabel: {
          color: SERIES_COLOR.DSCR,
          formatter: (v: number) => v.toFixed(1),
        },
        splitLine: { show: false },
      },
    ],

    series: sortedSeries.value.map(s => {
      const color = SERIES_COLOR[s.id] ?? '#999'
      const isDSCR = s.id === 'DSCR'
      const isRevenue = s.id === 'REV'

      const baseSeries: any = {
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        yAxisIndex: s.axis === 'right' ? 1 : 0,
        stack: !isDSCR && !isRevenue ? 'Total' : undefined,
        lineStyle: {
          width: isDSCR || isRevenue ? 2.5 : 1.5,
          color,
        },
        itemStyle: { color },
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem',
        },
        data: s.y,
      }

      // area series
      if (!isDSCR && !isRevenue) {
        baseSeries.areaStyle = {
          opacity: 0.8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color },
              { offset: 1, color: `${color}33` },
            ],
          },
        }
      }

      return baseSeries
    }),
  }
})
</script>

<template>
  <VCard
    outlined
    class="projection-wrapper pa-0"
  >
    <VCardTitle class="px-6 py-4">
      Cash Flow Overview
    </VCardTitle>

    <VDivider />

    <VCardText class="px-6 py-4">
      <VOverlay
        :model-value="loading"
        contained
        class="align-center justify-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </VOverlay>

      <VChart
        v-if="figure"
        :option="chartOptions"
        autoresize
        style="block-size: 520px;"
      />
    </VCardText>
  </VCard>
</template>

<style scoped>
.projection-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.2) !important;
  border-radius: 10px !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%) !important;
}
</style>
