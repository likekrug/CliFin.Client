<script setup lang="ts">
import { computed } from 'vue'

interface MetricItem {
  label: string
  value: string
}

interface ScenarioMap {
  [key: string]: MetricItem[]
}

const props = defineProps({
  mode: {
    type: String,
    default: 'scenario', // ⭐ 기본값 지정
  },
  selectedScenarios: {
    type: Array as () => string[],
    required: true,
  },
  scenarioData: {
    type: Object as () => ScenarioMap,
    required: true,
  },
})

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
   Background Color Logic
================================ */
const getColumnColor = (col: string) => {
  // ⭐ Compare Mode
  if (props.mode === 'compare') {
    if (col.toLowerCase().includes('before') || col.toLowerCase().includes('project'))
      return 'rgba(var(--v-theme-secondary), 0.06)'

    return 'rgba(var(--v-theme-success), 0.06)'
  }

  // ⭐ Scenario Mode (기존)
  if (col === 'Baseline')
    return 'rgba(var(--v-theme-secondary), 0.06)'
  if (col === 'SSP126')
    return 'rgba(var(--v-theme-info), 0.06)'
  if (col === 'SSP585')
    return 'rgba(var(--v-theme-error), 0.06)'
  if (col === 'SSP170')
    return 'rgba(var(--v-theme-warning), 0.06)'

  return 'rgba(var(--v-theme-success), 0.06)'
}

/* ===============================
   Helper: scenarioData에서 report 배열 가져오기
================================ */
const getReportData = (scenarioName: string): MetricItem[] => {
  const data = props.scenarioData[scenarioName]
  // 새 구조: { report: [...], chartData: {...} }
  if (data?.report) {
    return data.report
  }
  // 기존 구조: [...] (배열 직접)
  if (Array.isArray(data)) {
    return data
  }
  return []
}

/* ===============================
   Group Rows (반응형 computed로 변경)
================================ */
const grouped = computed(() => {
  return sectionOrder.map(section => {
    const first = getReportData(props.selectedScenarios[0])

    const items = first
      .filter(item => sectionMap[item.label] === section)
      .map(item => ({
        label: item.label,
        values: props.selectedScenarios.map(sc => {
          return getReportData(sc)?.find(m => m.label === item.label)?.value ?? '-'
        }),
      }))

    return { section, items }
  })
})
</script>

<template>
  <VCard
    class="projection-wrapper"
    outlined
  >
    <!-- ⭐ Title -->
    <VCardTitle class="projection-title px-6 py-4">
      <span v-if="props.mode === 'compare'">Financial Condition Comparison</span>
      <span v-else>{{ props.selectedScenarios[0] }} Projection Report</span>
      <VBtn
        icon
        variant="tonal"
        size="32"
        color="warning"
        class="rounded ms-2"
      >
        <VIcon
          icon="ri-question-line"
          size="20"
        />
      </VBtn>
    </VCardTitle>

    <VDivider class="custom-divider" />

    <!-- ⭐ Table -->
    <VCardText class="px-6 py-4">
      <table class="scenario-table">
        <thead>
          <tr>
            <th
              class="metric-col"
              :style="{
                backgroundColor: `rgba(var(--v-theme-secondary), 0.06)`,

              }"
            >
              Metric
            </th>

            <th
              v-for="sc in props.selectedScenarios"
              :key="sc"
              class="scenario-col"
              :style="{ backgroundColor: getColumnColor(sc) }"
            >
              {{ sc }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="group in grouped"
            :key="group.section"
          >
            <tr class="section-row">
              <td
                class="section-title"
                :colspan="1 + props.selectedScenarios.length"
              >
                {{ group.section }}
              </td>
            </tr>

            <tr
              v-for="row in group.items"
              :key="row.label"
            >
              <td class="metric-name">
                {{ row.label }}
              </td>

              <td
                v-for="(val, idx) in row.values"
                :key="idx"
                class="metric-value"
                :style="{ backgroundColor: getColumnColor(props.selectedScenarios[idx]) }"
              >
                {{ val }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
/* --------------------------- */

/*   카드 전체 wrapper        */

/* --------------------------- */
.projection-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.2) !important;
  border-radius: 10px !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%) !important;
}

/* --------------------------- */

/*   제목 스타일               */

/* --------------------------- */
.projection-title {
  display: flex;
  align-items: center;
  color: rgb(var(--v-theme-on-surface));
  font-size: 1.1rem;
  font-weight: 600;
}

/* --------------------------- */

/*   제목 아래 Divider         */

/* --------------------------- */
.custom-divider {
  border: none !important;
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
  opacity: 1 !important;
}

/* --------------------------- */

/*   테이블 스타일             */

/* --------------------------- */
.scenario-table {
  border-collapse: collapse;
  inline-size: 100%;
  min-inline-size: 750px;
}

/* 🔥 기본 row height 줄임 */
.scenario-table td,
.scenario-table th {
  border-block-end: none !important;
  line-height: 1.3;
  padding-block: 8px;
  padding-inline: 14px;
  white-space: nowrap;
}

/* --------------------------- */

/*   Header Row               */

/* --------------------------- */
.scenario-table thead th {
  border-block-end: 1px solid rgba(var(--v-border-color), 0.2) !important;
  font-size: 0.9rem;
  font-weight: 700;
  padding-block: 12px;
  text-align: center;
}

.metric-col {
  text-align: end;
}

.metric-name {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 600;
}

/* --------------------------- */

/*   Section Title            */

/* --------------------------- */
.section-row td {
  border-block-end: none !important;
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
  padding-block: 16px 6px !important;
}

.section-title {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 15px;
  font-weight: 600;
}

/* --------------------------- */

/*   Metric Value             */

/* --------------------------- */
.metric-value {
  font-weight: 500;
  text-align: end;
}
</style>
