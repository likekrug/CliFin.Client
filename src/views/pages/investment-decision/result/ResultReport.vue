<script setup lang="ts">
interface MetricItem {
  label: string
  value: string
}

interface ScenarioData {
  before: MetricItem[]
  after: MetricItem[]
}

const props = defineProps<{
  scenarioData: ScenarioData
}>()

/* ------------------------------
   Section Mapping
------------------------------ */
const sectionMap: Record<string, string> = {
  // Capital Structure
  'Debt amount': 'Capital Structure',
  'Tenor / Margin': 'Capital Structure',
  'EOD threshold / DSRA': 'Capital Structure',

  // Valuation Summary
  'Equity IRR': 'Valuation Summary',
  'Equity NPV': 'Valuation Summary',
  'Payback period equity': 'Valuation Summary',

  // Investment Summary
  'Min DSCR': 'Investment Summary',
  'LLCR': 'Investment Summary',
  'Default year': 'Investment Summary',
  'DSRA trigger': 'Investment Summary',
}

const sectionOrder = [
  'Capital Structure',
  'Valuation Summary',
  'Investment Summary',
]

/* ------------------------------
   Metric grouping by Section
------------------------------ */
const grouped = sectionOrder.map(section => {
  const before = props.scenarioData.before
  const after = props.scenarioData.after

  // label 순서 기준 before 배열에서 기준
  const items = before
    .filter(item => sectionMap[item.label] === section)
    .map(item => ({
      label: item.label,
      before: item.value,
      after: after.find(m => m.label === item.label)?.value ?? '-',
    }))

  return { section, items }
})
</script>

<template>
  <VCard
    class="projection-wrapper"
    outlined
  >
    <VCardTitle class="projection-title px-6 py-4">
      Baseline Projection Report (Financial Condition Comparison)
    </VCardTitle>

    <VDivider />

    <VCardText class="px-6 py-4">
      <table class="scenario-table">
        <thead>
          <tr>
            <th class="metric-col">
              Metric
            </th>
            <th class="scenario-col">
              Project
            </th>
            <th class="scenario-col">
              Simulation
            </th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="group in grouped"
            :key="group.section"
          >
            <!-- Section Header -->
            <tr class="section-row">
              <td
                colspan="3"
                class="section-title"
              >
                {{ group.section }}
              </td>
            </tr>

            <tr
              v-for="item in group.items"
              :key="item.label"
            >
              <td class="metric-name">
                {{ item.label }}
              </td>
              <td class="metric-value">
                {{ item.before }}
              </td>
              <td class="metric-value">
                {{ item.after }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
.projection-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.2) !important;
  border-radius: 10px !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%) !important;
}

.projection-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.scenario-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.scenario-table th {
  padding: 12px;
  border-block-end: 1px solid rgba(var(--v-border-color), 0.2) !important;
  font-weight: 700;
  text-align: start;
}

.scenario-table td {
  padding-block: 10px;
  padding-inline: 14px;
}

.section-title {
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 15px;
  font-weight: 600;
  padding-block: 16px 6px !important;
}

.metric-name {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 600;
}

.metric-value {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 500;
  text-align: start;
}
</style>
