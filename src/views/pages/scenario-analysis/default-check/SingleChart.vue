<script setup lang="ts">
import * as echarts from 'echarts'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  selectedScenarios: string[]
  dscrData?: Record<string, number[]>
}>()

/* -----------------------------------
 🔹 시나리오 컬러 (Materio 계열 반영)
----------------------------------- */
const scenarioColor = (sc: string) => {
  if (sc === 'Baseline')
    return '#6C757D' // secondary
  if (sc === 'SSP126')
    return '#2196F3' // info
  if (sc === 'SSP370')
    return '#FFB400' // warning (SSP370)
  if (sc === 'SSP585')
    return '#F44336' // error

  return '#888'
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

  // props.dscrData가 있으면 사용, 없으면 빈 배열
  const dataSource = props.dscrData || {}

  /* 🔥 series 컬러 + 범례 컬러 동기화 */
  const series = props.selectedScenarios
    .filter(sc => dataSource[sc]?.length > 0) // 데이터가 있는 시나리오만
    .map(sc => ({
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
      data: dataSource[sc],
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
      nameGap: 35, // Y축과 이름 간격
      nameRotate: 90, // 이름을 세로로 세움
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

// 데이터 변경 시 차트 다시 그리기
watch(() => [props.dscrData, props.selectedScenarios], () => {
  nextTick(() => {
    setTimeout(() => initChart(), 80)
  })
}, { deep: true })
</script>

<template>
  <div
    ref="chartRef"
    style=" block-size: 420px;inline-size: 100%;"
  />
</template>
