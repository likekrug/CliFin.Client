<script setup lang="ts">
import ResultReportColor2 from './result/ResultReportColor2.vue'
import ResultScenarioCharts from './result/ResultScenarioCharts.vue'
import Riskbreakdown from './result/Riskbreakdown.vue'
import SelectedScenarioList from './result/SelectedScenarioList.vue'

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

/* -----------------------------------
  ⭐ Test Data: Selected Scenarios
----------------------------------- */
const selectedScenarios = ['Baseline', 'SSP126', 'SSP585', 'SSP170']

const activeProjectId = ref(1)

/* -----------------------------------
  ⭐ Tabs (Summary / Breakdown)
----------------------------------- */
const activeTab = ref('summary')

/* -----------------------------------
  ⭐ Test Data: Selected Projects Summary
----------------------------------- */
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
const scenarioData = {
  Baseline: [
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
  SSP126: [
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
  SSP585: [
    { label: 'Debt amount', value: '$11,200,000' },
    { label: 'Tenor / Margin', value: '10 Yr / 4.0%' },
    { label: 'EOD threshold / DSRA', value: '1.15x / 6 months (N)' },
    { label: 'Equity IRR', value: '11.5%' },
    { label: 'Equity NPV', value: '$4,200,000' },
    { label: 'Payback period equity', value: '10.2 Yr' },
    { label: 'Min DSCR', value: '1.20' },
    { label: 'LLCR', value: '1.43' },
    { label: 'Default year', value: '2029' },
    { label: 'DSRA trigger', value: 'N' },
  ],
  SSP170: [
    { label: 'Debt amount', value: '$10,900,000' },
    { label: 'Tenor / Margin', value: '10 Yr / 4.3%' },
    { label: 'EOD threshold / DSRA', value: '1.12x / 6 months (N)' },
    { label: 'Equity IRR', value: '10.7%' },
    { label: 'Equity NPV', value: '$3,880,000' },
    { label: 'Payback period equity', value: '10.8 Yr' },
    { label: 'Min DSCR', value: '1.15' },
    { label: 'LLCR', value: '1.38' },
    { label: 'Default year', value: '2028' },
    { label: 'DSRA trigger', value: 'N' },
  ],
}
</script>

<template>
  <VRow class="tab-result-layout">
    <!-- LEFT: Scenario Summary -->
    <VCol
      cols="12"
      md="2"
    >
      <SelectedScenarioList
        v-model:active-id="activeProjectId"
        mode="single"
        :items="selectedSummary"
        :scenarios="selectedScenarios"
      />
    </VCol>

    <!-- RIGHT: Result Panel -->
    <VCol
      cols="12"
      md="10"
    >
      <!-- Tabs -->
      <VTabs
        v-model="activeTab"
        class="mb-4"
      >
        <VTab value="summary">
          Summary
        </VTab>
        <VTab value="breakdown">
          Risk Breakdown
        </VTab>
      </VTabs>

      <VWindow v-model="activeTab">
        <!-- ======================= -->
        <!-- ⭐ SUMMARY TAB 화면      -->
        <!-- ======================= -->
        <VWindowItem value="summary">
          <VRow>
            <VCol cols="12">
              <ResultReportColor2
                v-if="activeTab === 'summary'"
                :selected-scenarios="selectedScenarios"
                :scenario-data="scenarioData"
              />
            </VCol>

            <!-- ⭐ 그래프도 Summary에 포함 -->
            <VCol cols="12">
              <ResultScenarioCharts
                v-if="activeTab === 'summary'"
                :selected-scenarios="selectedScenarios"
              />
            </VCol>
          </VRow>
        </VWindowItem>

        <!-- ======================= -->
        <!-- ⭐ BREAKDOWN TAB 화면 -->
        <!-- ======================= -->
        <VWindowItem value="breakdown">
          <Riskbreakdown :selected-scenarios="selectedScenarios" />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.tab-result-layout {
  align-items: flex-start;
}
</style>
