<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import VChart from 'vue-echarts'

// ECharts core
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

/* -------------------- Props -------------------- */
const props = defineProps<{
  selectedScenarios: string[]
}>()

// ECharts 엔진 등록
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

const scenarioList = computed(() => props.selectedScenarios)

/* ============================================================
   🔹 Risk Factor 설명 (Legend)
============================================================ */
const riskFactorLegend = [
  { key: 'EW', name: 'Extreme Weather' },
  { key: 'AT', name: 'Air Temperature' },
  { key: 'WT', name: 'Water Temperature' },
  { key: 'RD', name: 'River Discharge' },
  { key: 'DA', name: 'Dust Accumulation (Solar only)' },
]

/* ============================================================
   🔹 Raw Risk Data (Total 없이)
============================================================ */
const rawRisk = {
  Baseline: { EW: 10, AT: 25, WT: 15, RD: 30, DA: 0 },
  SSP126: { EW: 12, AT: 28, WT: 13, RD: 27, DA: 0 },
  SSP370: { EW: 25, AT: 12, WT: 18, RD: 25, DA: 0 },
  SSP585: { EW: 38, AT: 10, WT: 19, RD: 23, DA: 0 },
  SSP170: { EW: 18, AT: 26, WT: 20, RD: 26, DA: 0 },
}

const waterfallData: Record<string, { offset: number[]; bars: number[] }> = {}

/* ============================================================
   🔹 Total 자동 계산
============================================================ */
function normalizeTo100(risk) {
  const keys = ['EW', 'AT', 'WT', 'RD', 'DA']
  const sum = keys.reduce((s, k) => s + (risk[k] ?? 0), 0)

  let total = 100 - sum
  if (total < 0)
    total = 0

  return [...keys.map(k => risk[k] ?? 0), total]
}

/* ============================================================
   🔹 Waterfall 계산
============================================================ */
function makeWaterfall(values: number[]) {
  const offset = []
  let acc = 0
  for (const v of values) {
    offset.push(acc)
    acc += v
  }

  return { offset, bars: values }
}

/* ============================================================
   🔹 최종 waterfallData 생성
============================================================ */

Object.entries(rawRisk).forEach(([scenario, risk]) => {
  const values = normalizeTo100(risk)

  waterfallData[scenario] = makeWaterfall(values)
})

/* ============================================================
   🔹 Chart Option
============================================================ */
const categories = ['EW', 'AT', 'WT', 'RD', 'DA', 'Total']

function createOption(name: string, data: any) {
  return {
    grid: { left: 50, right: 20, top: 30, bottom: 40 },

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: val => `${val}`,
    },

    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 12 },
      boundaryGap: true,
    },

    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { fontSize: 12 },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#CCC',
        },
      },
    },

    series: [
      {
        type: 'bar',
        stack: 'total',
        barWidth: 10,
        roundCap: true,
        itemStyle: {
          borderRadius: 6,
          color: 'rgba(0,0,0,0)',
        },
        data: data.offset,
      },
      {
        type: 'bar',
        stack: 'total',
        barWidth: 10,
        roundCap: true,
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          formatter: p => (p.value === 0 ? '' : `${p.value}`),
        },
        itemStyle: {
          borderRadius: 6,
          color: (p: any) => (p.dataIndex === 5 ? '#4CAF50' : '#A0A0A0'),
        },
        data: data.bars,
      },
    ],
  }
}

/* -------------------- 렌더 준비 -------------------- */
const ready = ref(false)

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    ready.value = true
  }, 80)
})
</script>

<template>
  <div class="risk-breakdown-align">
    <!-- 🔹 Legend -->
    <div class="legend-container mb-4">
      <div
        v-for="item in riskFactorLegend"
        :key="item.key"
        class="legend-chip"
      >
        <strong>{{ item.key }}</strong> : {{ item.name }}
      </div>
    </div>

    <!-- 🔹 Charts -->
    <div class="waterfall-wrapper">
      <VCard
        v-for="sc in scenarioList"
        :key="sc"
        outlined
      >
        <VCardTitle class="text-h6 font-weight-semibold mb-3">
          {{ sc }}
        </VCardTitle>

        <VChart
          v-if="ready"
          :option="createOption(sc, waterfallData[sc])"
          autoresize
          style="block-size: 260px; inline-size: 100%;"
        />
      </VCard>
    </div>
  </div>
</template>

<style scoped>
/* 🔥 전체 왼쪽 여백 강제 통일 */
.risk-breakdown-align {
  margin-inline-start: 3px; /* ← 딱 맞게 조정되는 값 */
}

/* Legend 영역 */
.legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-block: 8px;
}

.legend-chip {
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f5f5f7;
  color: #555;
  font-size: 13px;
  padding-block: 4px;
  padding-inline: 10px;
}

/* Chart Grid */
.waterfall-wrapper {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding-block: 8px;
  padding-inline: 0;
}
</style>
