<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

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
}

// -------------------------------
// ✅ 시리즈 정의
// -------------------------------
const series = ref([
  { name: 'Operation Expense', data: allSeriesData.operation_expense },
  { name: 'Fuel Expense', data: allSeriesData.fuel_expense },
  { name: 'Property Tax', data: allSeriesData.property_tax_exp },
  { name: 'Insurance', data: allSeriesData.insurance_expense },
  { name: 'Debt Service', data: allSeriesData.debt_service },
  { name: 'Cash Flow to Equity', data: allSeriesData.cash_flow_to_equity },
])

const colors = ['#6A5ACD', '#FF7F50', '#FFD86F', '#5AB0F8', '#C084FC', '#D8D3FF']

// -------------------------------
// ✅ Checkbox 상태
// -------------------------------
const visibleStates = ref<Record<string, boolean>>(
  Object.fromEntries(series.value.map(s => [s.name, true])),
)

const chartRef = ref()

// -------------------------------
// ✅ 반응형 감지 (모바일 / PC)
// -------------------------------
const isMobile = ref(window.innerWidth < 960)

function handleResize() {
  isMobile.value = window.innerWidth < 960
}

window.addEventListener('resize', handleResize)
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

// -------------------------------
// ✅ Apex 옵션
// -------------------------------
const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    stacked: true,
    toolbar: { show: false },
  },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 0.5, opacityFrom: 0.8, opacityTo: 0.25, stops: [0, 100] },
  },
  stroke: { width: 2, curve: 'smooth' },
  colors,
  dataLabels: { enabled: false },
  grid: { borderColor: '#e0e0e0', strokeDashArray: 4 },
  xaxis: {
    categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    tickPlacement: 'on',
    labels: {
      formatter: val => {
        const num = Number(val)

        return num % 5 === 0 ? `${num}` : ''
      },
    },
  },
  yaxis: {
    title: { text: 'Cash Flow (USD)' },
    labels: { formatter: val => `$${(val / 1_000_000).toFixed(1)}M` },
  },
  legend: {
    show: isMobile.value, //  모바일에서만 legend 보이기
    position: 'top',
    horizontalAlign: 'left',
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: val => `$${val.toLocaleString()}` },
  },
}))

// -------------------------------
// ✅ Checkbox 클릭 시 Apex 반영
// -------------------------------
function toggleSeries(name: string) {
  const chart = chartRef.value?.chart
  if (!chart)
    return

  chart.toggleSeries(name)

  // ✅ 내부 상태 반영 후 checkbox 갱신
  setTimeout(() => {
    const hiddenIndexes = chart.w.globals.collapsedSeriesIndices

    chart.w.config.series.forEach((s: any, i: number) => {
      visibleStates.value[s.name] = !hiddenIndexes.includes(i)
    })
  }, 0)
}

// -------------------------------
// ✅ 초기화 (모두 표시)
onMounted(() => {
  const chart = chartRef.value?.chart
  if (!chart)
    return
  nextTick(() => {
    series.value.forEach(s => chart.showSeries(s.name))
  })
})
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <VCardTitle class="d-flex align-center justify-space-between px-6 py-4">
      Cash Flow Overview
    </VCardTitle>

    <VCardSubtitle class="px-6 text-body-2 text-medium-emphasis">
      Mobile: Legend only | Desktop: Checkbox only
    </VCardSubtitle>

    <VCardText class="px-6 py-4">
      <VRow>
        <!-- ✅ PC 전용 Checkbox -->
        <VCol
          v-if="!isMobile"
          cols="12"
          md="3"
          class="d-flex flex-column gap-y-2"
        >
          <VCheckbox
            v-for="(s, idx) in series"
            :key="s.name"
            :label="s.name"
            :color="colors[idx]"
            hide-details
            density="comfortable"
            :model-value="visibleStates[s.name]"
            @change="toggleSeries(s.name)"
          />
        </VCol>

        <!-- ✅ 차트 영역 -->
        <VCol
          :cols="isMobile ? 12 : 9"
          class="pt-2"
        >
          <VueApexCharts
            ref="chartRef"
            type="area"
            height="500"
            :series="series"
            :options="chartOptions"
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
