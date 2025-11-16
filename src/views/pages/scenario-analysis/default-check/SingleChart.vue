<script setup lang="ts">
import * as echarts from 'echarts'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps<{
  selectedScenarios: string[]
}>()

/* -----------------------------------
 🔹 시나리오 컬러 (Materio 계열 반영)
----------------------------------- */
const scenarioColor = (sc: string) => {
  if (sc === 'Baseline')
    return '#6C757D' // secondary
  if (sc === 'SSP126')
    return '#2196F3' // info
  if (sc === 'SSP585')
    return '#F44336' // error
  if (sc === 'SSP170')
    return '#FFB400' // warning

  return '#888'
}

/* -----------------------------------
 🔹 DSCR 데이터 (30년)
----------------------------------- */
const dscrData = {
  Baseline: [6.5, 6.4, 6.3, 6.2, 6.1, 6.0, 5.9, 5.8, 5.7, 5.7, 5.6, 5.6, 5.5, 5.5, 5.4, 5.4, 5.3, 5.3, 5.3, 5.2, 5.2, 5.1, 5.1, 5.0, 5.0, 4.9, 4.9, 4.8, 4.8, 4.7],
  SSP126: [6.3, 6.2, 6.1, 6.0, 5.9, 5.8, 5.7, 5.6, 5.6, 5.5, 5.4, 5.3, 5.3, 5.2, 5.1, 5.1, 5.0, 4.9, 4.9, 4.8, 4.7, 4.7, 4.6, 4.5, 4.5, 4.4, 4.3, 4.3, 4.2, 4.1],
  SSP585: [5.8, 5.7, 5.6, 5.5, 5.3, 5.2, 5.1, 5.0, 4.9, 4.8, 4.7, 4.7, 4.6, 4.5, 4.4, 4.4, 4.3, 4.2, 4.2, 4.1, 4.0, 4.0, 3.9, 3.9, 3.8, 3.7, 3.7, 3.6, 3.6, 3.5],
  SSP170: [5.0, 4.9, 4.8, 4.8, 4.7, 4.6, 4.5, 4.5, 4.4, 4.3, 4.3, 4.2, 4.2, 4.1, 4.0, 4.0, 3.9, 3.9, 3.8, 3.8, 3.7, 3.7, 3.6, 3.6, 3.5, 3.5, 3.4, 3.3, 3.3, 3.2],
}

const years = Array.from({ length: 30 }, (_, i) => `Year ${i + 1}`)

/* -----------------------------------
 🔹 Chart
----------------------------------- */
const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value)
    return

  if (chart)
    chart.dispose()
  chart = echarts.init(chartRef.value)

  /* 🔥 series 컬러 + 범례 컬러 동기화 */
  const series = props.selectedScenarios.map(sc => ({
    name: sc,
    type: 'line',
    smooth: true,
    showSymbol: false,
    itemStyle: {
      color: scenarioColor(sc), // ⭐ 범례 색상 일치
    },
    lineStyle: {
      width: 3,
      color: scenarioColor(sc), // ⭐ 라인 색상 일치
    },
    emphasis: {
      focus: 'series',
      lineStyle: { width: 4 }, // 강조 시 더 두껍게
    },
    blur: {
      lineStyle: { opacity: 0.2 }, // 비활성 흐림 효과
    },
    data: dscrData[sc],
  }))

  /* 🔥 전체 옵션 */
  const option = {
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
      top: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      hoverLink: true,
      textStyle: { fontSize: 12, color: '#444' },
    },

    legendHoverLink: true,

    xAxis: {
      type: 'category',
      data: years,

      axisLabel: { color: '#666', fontSize: 12 },
      axisPointer: {
        label: {
          show: true,
          backgroundColor: '#333',
          color: '#fff',
          padding: [4, 8],
          fontWeight: '700',
        },
      },
    },

    yAxis: [{
      type: 'value',
      min: 0,
      max: 7,
      axisLabel: { color: '#666', fontSize: 12 },
      axisPointer: {
        label: {
          show: true,
          backgroundColor: '#333',
          color: '#fff',
          padding: [4, 8],
          fontWeight: '700',
        },
      },
      name: 'DSCR',
      nameLocation: 'middle',
      nameGap: 35, // Y축과 이름 간3격
      nameRotate: 90, //  이름을 세로로 세움
      nameTextStyle: { fontSize: 10, color: '#666', fontWeight: 600 },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e0e0e0' } },
    }],

    grid: { left: 45, right: 20, top: 50, bottom: 40 },

    series,
  }

  chart.setOption(option)
  chart.resize()
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => initChart(), 80)
  })
})
</script>

<template>
  <div
    ref="chartRef"
    style=" block-size: 420px;inline-size: 100%;"
  />
</template>
