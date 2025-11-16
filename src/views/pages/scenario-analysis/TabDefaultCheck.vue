<script setup lang="ts">
import { ref } from 'vue'

import SingleChart from './default-check/SingleChart.vue'
import SingleReport from './default-check/SingleReport.vue'
import SelectedScenarioList from './result/SelectedScenarioList.vue'

/* -----------------------------------
  30-year Breakdown Data
----------------------------------- */
const scenarioBreakdonwData = [
  { year: 2025, baseline: 0.82, ssp126: 0.93, ssp370: 1.12, ssp585: 0.97 },
  { year: 2026, baseline: 1.05, ssp126: 1.12, ssp370: 0.98, ssp585: 1.14 },
  { year: 2027, baseline: 0.91, ssp126: 1.08, ssp370: 1.21, ssp585: 1.03 },
  { year: 2028, baseline: 0.78, ssp126: 1.02, ssp370: 0.95, ssp585: 1.18 },
  { year: 2029, baseline: 1.02, ssp126: 0.89, ssp370: 1.17, ssp585: 1.11 },
  { year: 2030, baseline: 0.87, ssp126: 1.09, ssp370: 0.91, ssp585: 1.07 },
  { year: 2031, baseline: 1.12, ssp126: 1.14, ssp370: 1.08, ssp585: 0.99 },
  { year: 2032, baseline: 0.94, ssp126: 0.97, ssp370: 1.23, ssp585: 1.15 },
  { year: 2033, baseline: 1.08, ssp126: 1.01, ssp370: 0.97, ssp585: 0.92 },
  { year: 2034, baseline: 0.79, ssp126: 1.16, ssp370: 1.04, ssp585: 1.21 },
  { year: 2035, baseline: 0.88, ssp126: 1.06, ssp370: 1.18, ssp585: 0.94 },
  { year: 2036, baseline: 1.03, ssp126: 1.03, ssp370: 0.93, ssp585: 1.19 },
  { year: 2037, baseline: 1.11, ssp126: 0.92, ssp370: 1.05, ssp585: 1.07 },
  { year: 2038, baseline: 0.97, ssp126: 1.13, ssp370: 1.12, ssp585: 0.88 },
  { year: 2039, baseline: 0.84, ssp126: 1.18, ssp370: 0.99, ssp585: 1.23 },
  { year: 2040, baseline: 1.06, ssp126: 0.95, ssp370: 1.14, ssp585: 1.09 },
  { year: 2041, baseline: 0.93, ssp126: 1.12, ssp370: 1.01, ssp585: 1.15 },
  { year: 2042, baseline: 1.15, ssp126: 1.07, ssp370: 1.09, ssp585: 0.91 },
  { year: 2043, baseline: 1.02, ssp126: 1.15, ssp370: 0.96, ssp585: 1.12 },
  { year: 2044, baseline: 0.89, ssp126: 0.98, ssp370: 1.13, ssp585: 0.96 },
  { year: 2045, baseline: 1.09, ssp126: 1.04, ssp370: 0.92, ssp585: 1.17 },
  { year: 2046, baseline: 0.95, ssp126: 1.09, ssp370: 1.16, ssp585: 1.02 },
  { year: 2047, baseline: 0.86, ssp126: 1.02, ssp370: 1.08, ssp585: 1.21 },
  { year: 2048, baseline: 1.04, ssp126: 0.97, ssp370: 1.19, ssp585: 0.99 },
  { year: 2049, baseline: 1.12, ssp126: 1.15, ssp370: 0.95, ssp585: 1.08 },
  { year: 2050, baseline: 1.01, ssp126: 1.08, ssp370: 1.11, ssp585: 0.94 },
  { year: 2051, baseline: 0.98, ssp126: 1.03, ssp370: 1.17, ssp585: 1.13 },
  { year: 2052, baseline: 0.83, ssp126: 1.12, ssp370: 1.05, ssp585: 1.07 },
  { year: 2053, baseline: 1.14, ssp126: 1.09, ssp370: 0.99, ssp585: 1.18 },
  { year: 2054, baseline: 0.92, ssp126: 0.96, ssp370: 1.14, ssp585: 1.02 },
]

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
  Selected Scenarios
----------------------------------- */
const selectedScenarios = ['Baseline', 'SSP126', 'SSP585', 'SSP170']

/* -----------------------------------
  ⭐ Single / Multi 선택 상태
----------------------------------- */
const activeProjectId = ref<number | null>(1)
const activeProjectIds = ref<number[]>([])

/* -----------------------------------
  Tabs
----------------------------------- */
const activeTab = ref('summary')

/* -----------------------------------
  Project List
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
  Summary Detail Data
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

/* -----------------------------------
  Tab change
----------------------------------- */
const handleTabChange = (v: unknown) => {
  const tab = v as string

  if (tab === 'summary')
    activeProjectId.value = activeProjectIds.value[0] ?? null

  if (tab === 'breakdown')
    activeProjectIds.value = selectedSummary.map(p => p.id)
}
</script>

<template>
  <VRow class="tab-result-layout">
    <!-- LEFT Project Panel -->
    <VCol
      cols="12"
      md="2"
    >
      <SelectedScenarioList
        v-if="activeTab === 'summary'"
        v-model:active-id="activeProjectId"
        mode="single"
        :items="selectedSummary"
        :scenarios="selectedScenarios"
      />

      <SelectedScenarioList
        v-else
        v-model:active-ids="activeProjectIds"
        mode="multi"
        :items="selectedSummary"
        :scenarios="selectedScenarios"
      />
    </VCol>

    <!-- RIGHT Summary / Breakdown -->
    <VCol
      cols="12"
      md="10"
    >
      <VTabs
        v-model="activeTab"
        class="mb-4"
        @update:model-value="handleTabChange"
      >
        <VTab value="summary">
          Single
        </VTab>
        <VTab value="breakdown">
          Multi
        </VTab>
      </VTabs>

      <VWindow v-model="activeTab">
        <!-- SUMMARY -->
        <VWindowItem value="summary">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <SingleChart
                :selected-scenarios="selectedScenarios"
                :scenario-data="scenarioData"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <SingleReport
                :start-year="2025"
                :selected-scenarios="selectedScenarios"
                :scenario-data="scenarioBreakdonwData"
              />
            </VCol>
          </VRow>
        </VWindowItem>

        <!-- BREAKDOWN -->
        <VWindowItem value="breakdown">
          <div class="pa-6 text-body-1">
            breakdown
          </div>
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
