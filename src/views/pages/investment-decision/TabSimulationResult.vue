<script setup lang="ts">
import ResultChart from './result/ResultChart.vue'
import ResultReport from './result/ResultReport.vue'

// import ResultScenarioCharts from './result/ResultScenarioCharts.vue'

/* -----------------------------------
  Types
----------------------------------- */
interface SummaryItem {
  id: number
  name: string
  type: string
  location: string
  risks: string[]
}
const activeProjectId = ref(1)

const selectedSummary: SummaryItem[] = [
  {
    id: 1,
    name: 'Coal Power Plant Alpha',
    type: 'Coal',
    location: '53.339688, -6.236688',
    risks: ['Extreme Weather', 'Air Temperature'],
  },
  {
    id: 2,
    name: 'Gas Combined Cycle',
    type: 'Natural Gas',
    location: '37.7749, -122.4194',
    risks: ['Extreme Weather'],
  },
]

/* -----------------------------------
  ⭐ Scenario Data
----------------------------------- */
const selectedProjetData = {
  before: [
    { label: 'Debt amount', value: '$12,000,000' },
    { label: 'Tenor / Margin', value: '10 Yr / 3.5%' },
    { label: 'EOD threshold / DSRA', value: '1.20x / 6 months (Y)' },
    { label: 'Equity IRR', value: '14.2%' },
    { label: 'Equity NPV', value: '$5,430,000' },
    { label: 'Payback period equity', value: '8.5 Yr' },
    { label: 'Min DSCR', value: '1.35' },
    { label: 'LLCR', value: '1.65' },
    { label: 'Default year', value: '2031' },
    { label: 'DSRA trigger', value: 'Y' },
  ],
  after: [
    { label: 'Debt amount', value: '$11,800,000' },
    { label: 'Tenor / Margin', value: '10 Yr / 3.6%' },
    { label: 'EOD threshold / DSRA', value: '1.18x / 6 months (Y)' },
    { label: 'Equity IRR', value: '13.1%' },
    { label: 'Equity NPV', value: '$4,920,000' },
    { label: 'Payback period equity', value: '9.1 Yr' },
    { label: 'Min DSCR', value: '1.28' },
    { label: 'LLCR', value: '1.55' },
    { label: 'Default year', value: '2030' },
    { label: 'DSRA trigger', value: 'Y' },
  ],

}

const scenarioData = {
  before: [
    { label: 'Debt amount', value: '$12,000,000' },
    { label: 'Tenor / Margin', value: '10 Yr / 3.5%' },
    { label: 'EOD threshold / DSRA', value: '1.20x / 6 months (Y)' },

    // ---- Optional: 아래 값들은 Financial 박스에서는 사용하지 않지만 보고서에 필요하면 유지 ----
    { label: 'Equity IRR', value: '14.2%' },
    { label: 'Equity NPV', value: '$5,430,000' },
    { label: 'Payback period equity', value: '8.5 Yr' },
    { label: 'Min DSCR', value: '1.35' },
    { label: 'LLCR', value: '1.65' },
    { label: 'Default year', value: '2031' },
    { label: 'DSRA trigger', value: 'Y' },
  ],

  after: [
    { label: 'Debt amount', value: '$11,800,000' },
    { label: 'Tenor / Margin', value: '10 Yr / 3.6%' },
    { label: 'EOD threshold / DSRA', value: '1.18x / 6 months (Y)' },

    // ---- Optional: 동일하게 after 값들 ----
    { label: 'Equity IRR', value: '13.1%' },
    { label: 'Equity NPV', value: '$4,920,000' },
    { label: 'Payback period equity', value: '9.1 Yr' },
    { label: 'Min DSCR', value: '1.28' },
    { label: 'LLCR', value: '1.55' },
    { label: 'Default year', value: '2030' },
    { label: 'DSRA trigger', value: 'Y' },
  ],
}
</script>

<template>
  <VRow class="tab-result-layout">
    <VCol
      cols="12"
      md="2"
    >
      Project List
    </VCol>
    <!-- RIGHT: Result Panel -->
    <VCol
      cols="12"
      md="10"
    >
      <ResultReport :scenario-data="selectedProjetData" />
      <ResultChart :scenario-data="scenarioData" />
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.tab-result-layout {
  align-items: flex-start;
}
</style>
