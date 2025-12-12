<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'

interface ChartDataType {
  revenue_total?: number[]
  operation_expense?: number[]
  fuel_expense?: number[]
  insurance_expense?: number[]
  property_tax_exp?: number[]
  debt_service?: number[]
  cash_flow_to_equity?: number[]
  dscr?: number[]
}

const props = defineProps<{
  scenario: string
  chartData?: ChartDataType
}>()

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const COLOR = {
  operation: '#6A5ACD',
  fuel: '#FF7F50',
  property: '#FFD86F',
  insurance: '#5AB0F8',
  debt: '#C084FC',
  cfte: '#D8D3FF',
  revenue: '#000000',
  dscr: '#FF69B4',
}

// API 데이터가 있는지 확인
const hasData = computed(() => {
  return props.chartData && Object.keys(props.chartData).length > 0
})

// API 데이터 사용 (없으면 빈 배열)
const seriesData = computed(() => {
  if (!hasData.value) {
    return {
      revenue: [],
      operation_expense: [],
      fuel_expense: [],
      insurance_expense: [],
      property_tax_exp: [],
      debt_service: [],
      cash_flow_to_equity: [],
      dscr: [],
    }
  }

  return {
    revenue: props.chartData!.revenue_total || [],
    operation_expense: props.chartData!.operation_expense || [],
    fuel_expense: props.chartData!.fuel_expense || [],
    insurance_expense: props.chartData!.insurance_expense || [],
    property_tax_exp: props.chartData!.property_tax_exp || [],
    debt_service: props.chartData!.debt_service || [],
    cash_flow_to_equity: props.chartData!.cash_flow_to_equity || [],
    dscr: props.chartData!.dscr || [],
  }
})

/* ===================================================
    Series 정의 - computed로 반응형
=================================================== */
const baseSeries = computed(() => [
  { name: 'Operation Expense', color: COLOR.operation, data: seriesData.value.operation_expense },
  { name: 'Fuel Expense', color: COLOR.fuel, data: seriesData.value.fuel_expense },
  { name: 'Property Tax', color: COLOR.property, data: seriesData.value.property_tax_exp },
  { name: 'Insurance', color: COLOR.insurance, data: seriesData.value.insurance_expense },
  { name: 'Debt Service', color: COLOR.debt, data: seriesData.value.debt_service },
  { name: 'Cash Flow to Equity', color: COLOR.cfte, data: seriesData.value.cash_flow_to_equity },
])

const revenueLine = computed(() => ({ name: 'Revenue', color: COLOR.revenue, data: seriesData.value.revenue }))
const dscrLine = computed(() => ({ name: 'DSCR', color: COLOR.dscr, data: seriesData.value.dscr }))

/* ===================================================
   📌 ECharts 옵션 (원본 그대로)
=================================================== */
const chartOptions = computed(() => ({
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
    bottom: 10,
    icon: 'circle',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 20,
    hoverLink: true,
    textStyle: { fontSize: 12, color: '#444' },
  },

  grid: { left: '5%', right: '5%', bottom: 80, containLabel: true },

  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array.from({ length: 30 }, (_, i) => `Year ${i + 1}`),
  },

  yAxis: [
    {
      type: 'value',
      name: 'Cash Flow (USD)',
      axisLabel: { formatter: (v: number) => `$${(v / 1_000_000).toFixed(1)}M` },
    },
    {
      type: 'value',
      name: 'DSCR',
      position: 'right',
      axisLabel: { color: COLOR.dscr, formatter: (v: number) => v.toFixed(1) },
    },
  ],

  series: [
    ...baseSeries.value.map(s => ({
      name: s.name,
      type: 'line',
      stack: 'total',
      smooth: true,
      symbol: 'none',

      // ⭐ 차트 색상 + 범례 색상 동일
      lineStyle: { width: 1.8, color: s.color },
      itemStyle: { color: s.color },

      areaStyle: {
        opacity: 0.85,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${s.color}AA` },
            { offset: 1, color: `${s.color}00` },
          ],
        },
      },

      // 🔥 Hover 강조
      emphasis: { focus: 'self' },
      blur: {
        itemStyle: { opacity: 0.1 },
        lineStyle: { opacity: 0.1 },
        areaStyle: { opacity: 0.05 },
      },

      data: s.data,
    })),

    // Revenue (일반선)
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      symbol: 'none',
      yAxisIndex: 0,

      lineStyle: { width: 2.5, color: COLOR.revenue },
      itemStyle: { color: COLOR.revenue }, // ⭐ 범례 색상 매칭

      emphasis: { focus: 'self' },
      blur: {
        itemStyle: { opacity: 0.1 },
        lineStyle: { opacity: 0.1 },
      },

      data: revenueLine.value.data,
    },

    // DSCR (우측)
    {
      name: 'DSCR',
      type: 'line',
      smooth: true,
      symbol: 'none',
      yAxisIndex: 1,

      lineStyle: { width: 2.5, color: COLOR.dscr },
      itemStyle: { color: COLOR.dscr }, // ⭐ 범례 색상 매칭

      emphasis: { focus: 'self' },
      blur: {
        itemStyle: { opacity: 0.1 },
        lineStyle: { opacity: 0.1 },
      },

      data: dscrLine.value.data,
    },
  ],
}))

const isReady = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true
  })
})
</script>

<template>
  <VCard
    class="chart-card"
    outlined
  >
    <!-- 📌 시나리오 제목 복귀 -->
    <VCardTitle class="chart-title">
      {{ scenario }}
    </VCardTitle>

    <VDivider />

    <VCardText>
      <VChart
        v-if="isReady && hasData"
        :option="chartOptions"
        autoresize
        style="block-size: 560px; inline-size: 100%;"
      />
      <div
        v-else-if="isReady && !hasData"
        class="no-data-message"
      >
        No chart data available
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.chart-card {
  overflow: hidden;
  border-radius: 14px;
  inline-size: 550px;
  min-block-size: 620px;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  padding-block: 14px;
  padding-inline: 18px;
}

.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 560px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 1rem;
}
</style>
