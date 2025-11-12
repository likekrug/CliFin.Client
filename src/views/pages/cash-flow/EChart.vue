<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, ToolboxComponent])

// ✅ 데이터 원본 (변경 금지)
const allSeriesData = {
  revenue: [454950600, 464049612, 473330604.24, 482797216.32, 492453160.65, 502302223.86, 512348268.34, 522595233.71, 533047138.38, 543708081.15, 554582242.77, 565673887.63, 576987365.38, 588527112.69, 600297654.94, 612303608.04, 624549680.2, 637040673.81, 649781487.28, 662777117.03, 676032659.37, 689553312.56, 703344378.81, 717411266.38, 731759491.71, 746394681.55, 761322575.18, 776549026.68, 792080007.21, 807921607.36],
  operation_expense: [14041000, 14321820, 14608256.4, 14900421.53, 15198429.96, 15502398.56, 15812446.53, 16128695.46, 16451269.37, 16780294.76, 17115900.65, 17458218.66, 17807383.04, 18163530.7, 18526801.31, 18897337.34, 19275284.09, 19660789.77, 20054005.56, 20455085.67, 20864187.39, 21281471.13, 21707100.56, 22141242.57, 22584067.42, 23035748.77, 23496463.74, 23966393.02, 24445720.88, 24934635.3],
  fuel_expense: [59787000, 60982740, 62202394.8, 63446442.7, 64715371.55, 66009678.98, 67329872.56, 68676470.01, 70049999.41, 71450999.4, 72880019.39, 74337619.78, 75824372.17, 77340859.61, 78887676.81, 80465430.34, 82074738.95, 83716233.73, 85390558.4, 87098369.57, 88840336.96, 90617143.7, 92429486.58, 94278076.31, 96163637.83, 98086910.59, 100048648.8, 102049621.78, 104090614.21, 106172426.5],
  insurance_expense: [2560582.35, 2611794, 2664029.88, 2717310.48, 2771656.69, 2827089.82, 2883631.62, 2941304.25, 3000130.33, 3060132.94, 3121335.6, 3183762.31, 3247437.56, 3312386.31, 3378634.04, 3446206.72, 3515130.85, 3585433.47, 3657142.14, 3730284.98, 3804890.68, 3880988.49, 3958608.26, 4037780.43, 4118536.04, 4200906.76, 4284924.89, 4370623.39, 4458035.86, 4547196.58],
  property_tax_exp: [7681747.06, 7835382, 7992089.64, 8151931.43, 8314970.06, 8481269.46, 8650894.85, 8823912.75, 9000391, 9180398.82, 9364006.8, 9551286.94, 9742312.68, 9937158.93, 10135902.11, 10338620.15, 10545392.55, 10756300.4, 10971426.41, 11190854.94, 11414672.04, 11642965.48, 11875824.79, 12113341.28, 12355608.11, 12602720.27, 12854774.68, 13111870.17, 13374107.58, 13641589.73],
  debt_service: Array.from({ length: 30 }, () => 56227635.69),
  cash_flow_to_equity: [314652634.9, 322070240.31, 329636197.83, 337353474.5, 345225096.7, 353254151.35, 361443787.09, 369797215.55, 378317712.57, 387008619.54, 395873344.64, 404915364.25, 414138224.25, 423545541.45, 433141004.99, 442928377.8, 452911498.07, 463094280.75, 473480719.08, 484074886.17, 494880936.61, 505903108.05, 517145722.93, 528613190.1, 540310006.62, 552240759.46, 564410127.37, 576822882.63, 589483893, 602398123.57],
  dscr: [6.58, 6.58, 6.65, 6.65, 6.86, 6.86, 6.98, 6.98, 7.13, 7.13, 7.28, 7.28, 7.42, 7.42, 7.57, 7.57, 7.71, 7.71, 7.86, 7.86, 8.02, 8.02, 8.19, 8.19, 8.36, 8.36, 8.52, 8.52, 8.68, 8.68],
}

// ✅ Stack Area + Cash Flow 포함
const baseSeries = [
  { name: 'Operation Expense', color: ['#80FFA5', '#00DDFF'], data: allSeriesData.operation_expense },
  { name: 'Fuel Expense', color: ['#00DDFF', '#37A2FF'], data: allSeriesData.fuel_expense },
  { name: 'Property Tax', color: ['#37A2FF', '#FF0087'], data: allSeriesData.property_tax_exp },
  { name: 'Insurance', color: ['#FF0087', '#FFBF00'], data: allSeriesData.insurance_expense },
  { name: 'Debt Service', color: ['#FFBF00', '#FF8C00'], data: allSeriesData.debt_service },
  { name: 'Cash Flow to Equity', color: ['#00FF80', '#009944'], data: allSeriesData.cash_flow_to_equity },
]

const revenueLine = { name: 'Revenue', color: '#111', data: allSeriesData.revenue }
const dscrLine = { name: 'DSCR', color: '#FF69B4', data: allSeriesData.dscr }

const chartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#ddd',
    borderWidth: 1,
    textStyle: { color: '#333' },
    axisPointer: {
      type: 'cross', // ✅ 세로선 + Y축 가이드라인
      label: { backgroundColor: '#6a7985' },
    },
  },
  legend: {
    bottom: 0,
    icon: 'circle', // ✅ 이 한 줄이 핵심!
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 20,
    textStyle: {
      fontSize: 12,
      color: '#444',
    },
    data: [...baseSeries.map(s => s.name), 'Revenue', 'DSCR'],
  },
  grid: { left: '5%', right: '5%', bottom: '12%', containLabel: true },
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
      splitLine: { show: true, lineStyle: { color: '#e0e0e0', type: 'dashed' } },
    },
    {
      type: 'value',
      name: 'DSCR',
      position: 'right',
      axisLabel: { color: '#FF69B4', formatter: (v: number) => v.toFixed(1) },
      splitLine: { show: false },
    },
  ],
  series: [
    ...baseSeries.map(s => ({
      name: s.name,
      type: 'line',
      stack: 'Total',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5 },
      itemStyle: { color: s.color[0] },
      areaStyle: {
        opacity: 0.8,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: s.color[0] },
            { offset: 1, color: s.color[1] },
          ],
        },
      },
      emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
      data: s.data,
    })),
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      yAxisIndex: 0,
      symbol: 'none',
      lineStyle: { width: 2.5, color: revenueLine.color },
      itemStyle: { color: revenueLine.color },
      emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
      data: revenueLine.data,
    },
    {
      name: 'DSCR',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      symbol: 'none',
      lineStyle: { width: 2.5, color: dscrLine.color },
      itemStyle: { color: dscrLine.color },
      emphasis: { focus: 'series', blurScope: 'coordinateSystem' },
      data: dscrLine.data,
    },
  ],
}))
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="px-6 py-4">
      Gradient Stacked Area (with Crosshair & Tooltip Sync)
    </VCardTitle>
    <VCardText class="px-6 py-4">
      <VChart
        :option="chartOptions"
        autoresize
        style="block-size: 520px;"
      />
    </VCardText>
  </VCard>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 8%);
}
</style>
