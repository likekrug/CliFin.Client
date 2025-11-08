<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

// -------------------------------
// ✅ 데이터 정의
// -------------------------------
const allSeriesData = {
  revenue: [454950600.0, 464049612.0, 473330604.24, 482797216.32, 492453160.65, 502302223.86, 512348268.34, 522595233.71, 533047138.38, 543708081.15, 554582242.77, 565673887.63, 576987365.38, 588527112.69, 600297654.94, 612303608.04, 624549680.2, 637040673.81, 649781487.28, 662777117.03, 676032659.37, 689553312.56, 703344378.81, 717411266.38, 731759491.71, 746394681.55, 761322575.18, 776549026.68, 792080007.21, 807921607.36],
  operation_expense: [14041000.0, 14321820.0, 14608256.4, 14900421.53, 15198429.96, 15502398.56, 15812446.53, 16128695.46, 16451269.37, 16780294.76, 17115900.65, 17458218.66, 17807383.04, 18163530.7, 18526801.31, 18897337.34, 19275284.09, 19660789.77, 20054005.56, 20455085.67, 20864187.39, 21281471.13, 21707100.56, 22141242.57, 22584067.42, 23035748.77, 23496463.74, 23966393.02, 24445720.88, 24934635.3],
  fuel_expense: [59787000.0, 60982740.0, 62202394.8, 63446442.7, 64715371.55, 66009678.98, 67329872.56, 68676470.01, 70049999.41, 71450999.4, 72880019.39, 74337619.78, 75824372.17, 77340859.61, 78887676.81, 80465430.34, 82074738.95, 83716233.73, 85390558.4, 87098369.57, 88840336.96, 90617143.7, 92429486.58, 94278076.31, 96163637.83, 98086910.59, 100048648.8, 102049621.78, 104090614.21, 106172426.5],
  insurance_expense: [2560582.35, 2611794.0, 2664029.88, 2717310.48, 2771656.69, 2827089.82, 2883631.62, 2941304.25, 3000130.33, 3060132.94, 3121335.6, 3183762.31, 3247437.56, 3312386.31, 3378634.04, 3446206.72, 3515130.85, 3585433.47, 3657142.14, 3730284.98, 3804890.68, 3880988.49, 3958608.26, 4037780.43, 4118536.04, 4200906.76, 4284924.89, 4370623.39, 4458035.86, 4547196.58],
  property_tax_exp: [7681747.06, 7835382.0, 7992089.64, 8151931.43, 8314970.06, 8481269.46, 8650894.85, 8823912.75, 9000391.0, 9180398.82, 9364006.8, 9551286.94, 9742312.68, 9937158.93, 10135902.11, 10338620.15, 10545392.55, 10756300.4, 10971426.41, 11190854.94, 11414672.04, 11642965.48, 11875824.79, 12113341.28, 12355608.11, 12602720.27, 12854774.68, 13111870.17, 13374107.58, 13641589.73],
  debt_service: Array.from({ length: 30 }, () => 56227635.69),
  cash_flow_to_equity: [314652634.9, 322070240.31, 329636197.83, 337353474.5, 345225096.7, 353254151.35, 361443787.09, 369797215.55, 378317712.57, 387008619.54, 395873344.64, 404915364.25, 414138224.25, 423545541.45, 433141004.99, 442928377.8, 452911498.07, 463094280.75, 473480719.08, 484074886.17, 494880936.61, 505903108.05, 517145722.93, 528613190.1, 540310006.62, 552240759.46, 564410127.37, 576822882.63, 589483893.0, 602398123.57],
  dscr: [6.5840170396229425, 6.5840170396229425, 6.65524129113968, 6.65524129113968, 6.867070245170949, 6.867070245170949, 6.985724779039596, 6.985724779039596, 7.1325515537463655, 7.1325515537463655, 7.281440475783246, 7.281440475783246, 7.427340485486117, 7.427340485486117, 7.573502412281349, 7.573502412281349, 7.716287972603977, 7.716287972603977, 7.869260515785469, 7.869260515785469, 8.025256510936973, 8.025256510936973, 8.199780463508956, 8.199780463508956, 8.362151992857411, 8.362151992857411, 8.526237645773737, 8.526237645773737, 8.68131091045798, 8.68131091045798, 8.871112871790777, 8.871112871790777, 9.03690933023777, 9.03690933023777, 9.204647114688575, 9.204647114688575, 9.41786723739082, 9.41786723739082, 9.607802435684228, 9.607802435684228, 9.68114662147608, 9.68114662147608, 9.98758934531343, 9.98758934531343, 10.193773999390409, 10.193773999390409, 10.388553271511645, 10.388553271511645, 10.574849272120993, 10.574849272120993, 10.777059319564538, 10.777059319564538, 10.989530248627561, 10.989530248627561, 11.24079699587733, 11.24079699587733, 11.461400960816825, 11.461400960816825, 11.555218531833004, 11.555218531833004],
}

// -------------------------------
// ✅ 시리즈 정의
// -------------------------------
const baseSeries = [
  { name: 'Operation Expense', color: '#6A5ACD', data: allSeriesData.operation_expense },
  { name: 'Fuel Expense', color: '#FF7F50', data: allSeriesData.fuel_expense },
  { name: 'Property Tax', color: '#FFD86F', data: allSeriesData.property_tax_exp },
  { name: 'Insurance', color: '#5AB0F8', data: allSeriesData.insurance_expense },
  { name: 'Debt Service', color: '#C084FC', data: allSeriesData.debt_service },
  { name: 'Cash Flow to Equity', color: '#D8D3FF', data: allSeriesData.cash_flow_to_equity },
]

const revenueLine = { name: 'Revenue', color: '#000000', data: allSeriesData.revenue }
const dscrLine = { name: 'DSCR', color: '#FF69B4', data: allSeriesData.dscr }

// -------------------------------
// ✅ Checkbox 상태
// -------------------------------
const visibleStates = ref<Record<string, boolean>>(
  Object.fromEntries([...baseSeries, revenueLine, dscrLine].map(s => [s.name, true])),
)

const isMobile = ref(window.innerWidth < 960)
function handleResize() {
  isMobile.value = window.innerWidth < 960
}
window.addEventListener('resize', handleResize)
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

// -------------------------------
// ✅ ECharts 옵션
// -------------------------------
const chartOptions = computed(() => {
  const activeSeries = [
    ...baseSeries
      .filter(s => visibleStates.value[s.name])
      .map(s => ({
        name: s.name,
        type: 'line',
        stack: 'total',
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${s.color}99` },
              { offset: 1, color: `${s.color}00` },
            ],
          },
        },
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1.8, color: s.color },
        itemStyle: { color: s.color },
        data: s.data,
      })),
    visibleStates.value.Revenue
      ? {
          name: 'Revenue',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2.5, color: revenueLine.color },
          itemStyle: { color: revenueLine.color },
          data: revenueLine.data,
        }
      : null,
    visibleStates.value.DSCR
      ? {
          name: 'DSCR',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2.5, color: dscrLine.color },
          itemStyle: { color: dscrLine.color },
          data: dscrLine.data,
        }
      : null,
  ].filter(Boolean)

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ddd',
      textStyle: { color: '#333' },
      formatter: (params: any) => {
        let html = `<b>Year ${params[0].axisValue}</b><br/>`
        params.forEach((p: any) => {
          html += `<span style="display:inline-block;margin-right:6px;border-radius:50%;width:8px;height:8px;background:${p.color}"></span> ${p.seriesName}: ${p.seriesName === 'DSCR' ? p.value.toFixed(2) : `$${p.value.toLocaleString()}`}<br/>`
        })

        return html
      },
    },
    legend: { show: isMobile.value },
    grid: { left: '6%', right: '6%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: 'Year',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { fontSize: 13, color: '#666' },
      data: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      axisLabel: { formatter: (val: string) => (Number(val) % 5 === 0 ? val : '') },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Cash Flow (USD)',
        nameTextStyle: { fontSize: 13, color: '#666' },
        axisLabel: { formatter: (val: number) => `$${(val / 1_000_000).toFixed(1)}M` },
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e0e0e0' } },
      },
      {
        type: 'value',
        name: 'DSCR',
        nameTextStyle: { fontSize: 13, color: '#FF69B4' },
        position: 'right',
        axisLabel: {
          formatter: (val: number) => val.toFixed(1),
          color: '#FF69B4', // 💖 DSCR 숫자 라벨 색상
        },
        splitLine: { show: false },
      },
    ],
    series: activeSeries,
  }
})
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="d-flex align-center justify-space-between px-6 py-4">
      Cash Flow Overview (Stacked + Revenue + DSCR)
    </VCardTitle>

    <VCardSubtitle class="px-6 text-body-2 text-medium-emphasis">
      Revenue (black, left) / DSCR (pink, right) — dots removed
    </VCardSubtitle>

    <VCardText class="px-6 py-4">
      <VRow>
        <VCol
          v-if="!isMobile"
          cols="12"
          md="3"
          class="d-flex flex-column gap-y-2"
        >
          <VCheckbox
            v-for="s in [...baseSeries, revenueLine, dscrLine]"
            :key="s.name"
            v-model="visibleStates[s.name]"
            :label="s.name"
            :color="s.color"
            hide-details
            density="comfortable"
          />
        </VCol>

        <VCol
          :cols="isMobile ? 12 : 9"
          class="pt-2"
        >
          <VChart
            autoresize
            :option="chartOptions"
            style="block-size: 500px;"
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

.gap-y-2 > * + * {
  margin-block-start: 6px;
}
</style>
