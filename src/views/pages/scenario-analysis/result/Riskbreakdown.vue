<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import VChart from 'vue-echarts'

// ECharts core
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

/* -------------------- Types -------------------- */
interface RiskBreakdownData {
  total: number
  factors: Record<string, number>
}

interface ScenarioDataItem {
  report?: any[]
  chartData?: any
  riskBreakdown?: RiskBreakdownData
}

interface ScenarioDataType {
  [key: string]: ScenarioDataItem
}

/* -------------------- Props -------------------- */
const props = defineProps<{
  selectedScenarios: string[]
  scenarioData?: ScenarioDataType
}>()

// ECharts 엔진 등록
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

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
   🔹 Baseline 제외한 시나리오 목록 (Risk Breakdown은 SSP 시나리오만 표시)
============================================================ */
const scenariosWithoutBaseline = computed(() => {
  return props.selectedScenarios.filter(sc => sc !== 'Baseline')
})

/* ============================================================
   🔹 API 데이터 사용 여부 확인
============================================================ */
const hasApiData = computed(() => {
  if (!props.scenarioData) return false

  // 최소 하나의 시나리오에 riskBreakdown 데이터가 있는지 확인
  return Object.values(props.scenarioData).some(
    data => data?.riskBreakdown && Object.keys(data.riskBreakdown.factors || {}).length > 0
  )
})

/* ============================================================
   🔹 사용된 Risk Factor 목록 (API 데이터에서 추출)
============================================================ */
const usedRiskFactors = computed(() => {
  if (!props.scenarioData) return ['EW', 'AT', 'WT', 'RD', 'DA']

  const factors = new Set<string>()
  Object.values(props.scenarioData).forEach(data => {
    if (data?.riskBreakdown?.factors) {
      Object.keys(data.riskBreakdown.factors).forEach(f => factors.add(f))
    }
  })

  // API 데이터가 없으면 기본 5개 반환
  if (factors.size === 0) return ['EW', 'AT', 'WT', 'RD', 'DA']

  return Array.from(factors)
})

/* ============================================================
   🔹 필터링된 Legend (사용된 factor만 표시)
============================================================ */
const filteredRiskFactorLegend = computed(() => {
  return riskFactorLegend.filter(item => usedRiskFactors.value.includes(item.key))
})

/* ============================================================
   🔹 Waterfall 데이터 계산 (API 또는 fallback)
   - Total이 가장 큰 막대 (전체 DSCR 변화율)
   - 각 Factor는 Total 중 차지하는 실제 값 (기여도% * Total)
============================================================ */
const waterfallData = computed(() => {
  const result: Record<string, { offset: number[]; bars: number[]; categories: string[] }> = {}

  scenariosWithoutBaseline.value.forEach(scenario => {
    const scenarioInfo = props.scenarioData?.[scenario]
    const breakdown = scenarioInfo?.riskBreakdown

    if (breakdown && Object.keys(breakdown.factors || {}).length > 0) {
      // Total (DSCR 변화율의 절대값)
      const total = Math.abs(breakdown.total)

      // 각 factor의 실제 값 = Total * (기여도% / 100)
      const factors = usedRiskFactors.value
      const factorValues: number[] = []

      factors.forEach(factor => {
        const contribution = breakdown.factors[factor] ?? 0
        const actualValue = total * (contribution / 100)
        factorValues.push(actualValue)
      })

      // Waterfall: [EW값, AT값, ..., Total]
      // Total은 factor들의 합이므로 마지막에 추가
      result[scenario] = makeWaterfall(factorValues, [...factors, 'Total'], total)
    } else {
      // Baseline이거나 데이터 없음 - 빈 차트
      const factors = usedRiskFactors.value
      const emptyValues = factors.map(() => 0)
      result[scenario] = makeWaterfall(emptyValues, [...factors, 'Total'], 0)
    }
  })

  return result
})

/* ============================================================
   🔹 Waterfall 계산
   - Factor들이 쌓여서 Total이 되는 형태
   - offset: 각 막대의 시작점
   - bars: 각 막대의 높이
============================================================ */
function makeWaterfall(factorValues: number[], categories: string[], total: number) {
  const offset: number[] = []
  const bars: number[] = []
  let acc = 0

  // Factor들은 쌓이는 형태
  for (const v of factorValues) {
    offset.push(acc)
    bars.push(v)
    acc += v
  }

  // Total은 0부터 시작하는 전체 막대
  offset.push(0)
  bars.push(total)

  return { offset, bars, categories }
}

/* ============================================================
   🔹 Chart Option
============================================================ */
function createOption(name: string, data: { offset: number[]; bars: number[]; categories: string[] }) {
  // Total 값 (마지막 bar)을 기준으로 Y축 max 설정
  const totalValue = data.bars[data.bars.length - 1] || 0
  const maxValue = Math.max(totalValue * 1.2, 10) // 최소 10%, Total의 120%

  return {
    grid: { left: 50, right: 20, top: 30, bottom: 40 },

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const idx = params[0]?.dataIndex
        const category = data.categories[idx]
        const value = data.bars[idx]
        const scenarioInfo = props.scenarioData?.[name]
        const breakdown = scenarioInfo?.riskBreakdown

        if (category === 'Total') {
          const total = breakdown?.total ?? 0
          const sign = total >= 0 ? '+' : ''
          return `<strong>Total DSCR Change</strong><br/>${sign}${total.toFixed(2)}%`
        }

        // Factor: 실제 값과 기여도% 모두 표시
        const contribution = breakdown?.factors?.[category] ?? 0
        return `<strong>${category}</strong><br/>Impact: ${value.toFixed(2)}%<br/>Contribution: ${contribution.toFixed(1)}%`
      },
    },

    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: { fontSize: 12 },
      boundaryGap: true,
    },

    yAxis: {
      type: 'value',
      max: Math.ceil(maxValue),
      axisLabel: {
        fontSize: 12,
        formatter: (v: number) => `${v.toFixed(1)}%`
      },
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
          formatter: (p: any) => {
            const val = p.value
            if (val === 0) return ''
            // Total인 경우 실제 변화율 표시
            if (p.dataIndex === data.categories.length - 1) {
              const scenarioInfo = props.scenarioData?.[name]
              const total = scenarioInfo?.riskBreakdown?.total ?? 0
              const sign = total >= 0 ? '+' : ''
              return `${sign}${total.toFixed(1)}%`
            }
            return `${val.toFixed(1)}%`
          },
        },
        itemStyle: {
          borderRadius: 6,
          color: (p: any) => {
            // Total 바의 색상은 DSCR 변화 방향에 따라 결정
            if (p.dataIndex === data.categories.length - 1) {
              const scenarioInfo = props.scenarioData?.[name]
              const total = scenarioInfo?.riskBreakdown?.total ?? 0
              return total >= 0 ? '#4CAF50' : '#EF5350' // 양수: 초록, 음수: 빨강
            }
            return '#A0A0A0'
          },
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

// scenarioData가 변경되면 차트 리렌더링
watch(() => props.scenarioData, () => {
  console.log('📊 Riskbreakdown: scenarioData 변경됨', props.scenarioData)
}, { deep: true })
</script>

<template>
  <div class="risk-breakdown-align">
    <!-- 🔹 Legend -->
    <div class="legend-container mb-4">
      <div
        v-for="item in filteredRiskFactorLegend"
        :key="item.key"
        class="legend-chip"
      >
        <strong>{{ item.key }}</strong> : {{ item.name }}
      </div>
    </div>

    <!-- 🔹 No Data Message -->
    <div
      v-if="!hasApiData && scenariosWithoutBaseline.length > 0"
      class="no-data-message mb-4"
    >
      <VIcon
        icon="mdi-information-outline"
        size="20"
        class="mr-2"
      />
      Risk breakdown data will be available after running scenario analysis.
    </div>

    <!-- 🔹 Charts (Baseline 제외) -->
    <div class="waterfall-wrapper">
      <VCard
        v-for="sc in scenariosWithoutBaseline"
        :key="sc"
        outlined
      >
        <VCardTitle class="text-h6 font-weight-semibold mb-3">
          {{ sc }}
          <span
            v-if="scenarioData?.[sc]?.riskBreakdown?.total !== undefined"
            class="total-badge"
            :class="{ negative: (scenarioData?.[sc]?.riskBreakdown?.total ?? 0) < 0 }"
          >
            {{ (scenarioData?.[sc]?.riskBreakdown?.total ?? 0) >= 0 ? '+' : '' }}{{ (scenarioData?.[sc]?.riskBreakdown?.total ?? 0).toFixed(2) }}% DSCR
          </span>
        </VCardTitle>

        <VChart
          v-if="ready && waterfallData[sc]"
          :option="createOption(sc, waterfallData[sc])"
          autoresize
          style="block-size: 260px; inline-size: 100%;"
        />
        <div
          v-else-if="ready"
          class="no-chart-data"
        >
          No breakdown data
        </div>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
/* 🔥 전체 왼쪽 여백 강제 통일 */
.risk-breakdown-align {
  margin-inline-start: 3px;
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

/* No Data Message */
.no-data-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #FFF3E0;
  border-radius: 8px;
  color: #E65100;
  font-size: 14px;
}

/* Total Badge */
.total-badge {
  margin-left: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #E8F5E9;
  color: #2E7D32;
}

.total-badge.negative {
  background: #FFEBEE;
  color: #C62828;
}

/* Chart Grid */
.waterfall-wrapper {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding-block: 8px;
  padding-inline: 0;
}

.no-chart-data {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 260px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
}
</style>
