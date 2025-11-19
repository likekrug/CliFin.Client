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

/* ===============================
   Section Mapping
================================ */
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

/* ===============================
   Grouped rows (before/after 비교)
================================ */
const grouped = sectionOrder.map(section => {
  const before = props.scenarioData.before
  const after = props.scenarioData.after

  const items = before
    .filter(item => sectionMap[item.label] === section)
    .map(item => ({
      label: item.label,
      before: item.value,
      after: after.find(m => m.label === item.label)?.value ?? '-',
    }))

  return { section, items }
})

/* ===============================
   컬럼 색상
================================ */
const colColorBefore = 'rgba(var(--v-theme-secondary), 0.06)' // Baseline
const colColorAfter = 'rgba(var(--v-theme-info), 0.06)' // Simulation
</script>

<template>
  <VCard
    class="projection-wrapper"
    outlined
  >
    <VCardTitle class="projection-title px-6 py-4">
      Financial Condition Comparison
    </VCardTitle>

    <VDivider class="header-divider" />

    <VCardText class="px-6 py-4">
      <table class="scenario-table">
        <thead>
          <tr>
            <th class="metric-col">
              Metric
            </th>

            <th
              class="scenario-col"
              :style="{ backgroundColor: colColorBefore }"
            >
              Project
            </th>

            <th
              class="scenario-col"
              :style="{ backgroundColor: colColorAfter }"
            >
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

            <!-- Rows -->
            <tr
              v-for="item in group.items"
              :key="item.label"
            >
              <td class="metric-name">
                {{ item.label }}
              </td>

              <td
                class="metric-value"
                :style="{ backgroundColor: colColorBefore }"
              >
                {{ item.before }}
              </td>

              <td
                class="metric-value"
                :style="{ backgroundColor: colColorAfter }"
              >
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
/* ============================
   카드 스타일
============================ */
.projection-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.2) !important;
  border-radius: 12px !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%) !important;
}

.projection-title {
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 600;
}

.header-divider {
  border-block-start: 1px solid rgba(var(--v-border-color), 0.2) !important;
}

/* ============================
   테이블
============================ */
.scenario-table {
  border-collapse: collapse;
  font-size: 0.95rem;
  inline-size: 100%;
}

.scenario-table th {
  padding: 14px;
  border-block-end: 1px solid rgba(var(--v-border-color), 0.2);
  font-weight: 700;
  text-align: start;
}

.scenario-table td,
/* Metric column */
.metric-col {
  inline-size: 180px;
}

/* metric label */
.metric-name {
  color: rgba(var(--v-theme-on-surface), 0.85);
  font-weight: 600;
}

/* value */
.metric-value {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 500;
  text-align: start;
}

/* ============================
   Section Header
============================ */
.section-row td {
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15);
  padding-block: 20px 6px !important;
}

.section-title {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 15px;
  font-weight: 600;
}
</style>
