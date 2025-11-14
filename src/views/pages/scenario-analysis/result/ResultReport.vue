<script setup lang="ts">
interface ScenarioMetric {
  label: string
  value: string
}

interface ScenarioData {
  [scenario: string]: ScenarioMetric[]
}

const props = defineProps<{
  selectedScenarios: string[]
  scenarioData: ScenarioData
}>()

/* 첫 번째 시나리오의 Metric 목록 불러오기 */
const firstScenario = props.selectedScenarios[0]
const metricList = props.scenarioData[firstScenario] || []

/* 섹션 mapping */
const sectionMap: Record<string, string> = {
  'Debt amount': 'Capital Structure',
  'Tenor / Margin': 'Capital Structure',
  'EOD threshold / DSRA': 'Capital Structure',

  'Equity IRR': 'Valuation Summary',
  'Equity NPV': 'Valuation Summary',
  'Payback period equity': 'Valuation Summary',

  'Min DSCR': 'Investment Summary',
  'LLCR': 'Investment Summary',
  'Default year': 'Investment Summary',
  'DSRA trigger': 'Investment Summary',
}

/* 섹션 순서 */
const sectionOrder = [
  'Capital Structure',
  'Valuation Summary',
  'Investment Summary',
]

/* 시나리오별 칼라 매핑 */
const scenarioColor = (sc: string) => {
  if (sc === 'Baseline')
    return 'secondary'
  if (sc === 'SSP126')
    return 'info'
  if (sc === 'SSP585')
    return 'error'
  if (sc === 'SSP170')
    return 'warning'

  return 'success'
}

/* 그룹핑 */
const groupedMetrics = sectionOrder.map(section => ({
  section,
  items: metricList.filter(m => sectionMap[m.label] === section),
}))
</script>

<template>
  <VCard
    class="projection-wrapper"
    outlined
  >
    <!-- ================================== -->
    <!-- ⭐ Baseline Projection Report 헤더 -->
    <!-- ================================== -->
    <VCardTitle class="projection-title px-6 py-4">
      {{ selectedScenarios[0] }} Projection Report

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

    <!-- 🔹 제목 아래 라인 (CashFlowReportCard와 100% 동일) -->
    <VDivider class="custom-divider" />

    <!-- ========================= -->
    <!-- ⭐ 테이블 영역 -->
    <!-- ========================= -->
    <VCardText class="px-6 py-4">
      <table class="scenario-table">
        <thead>
          <tr>
            <th class="metric-col">
              Metric
            </th>

            <th
              v-for="sc in selectedScenarios"
              :key="sc"
              class="scenario-col"
              :style="{ color: `rgb(var(--v-theme-${scenarioColor(sc)}))` }"
            >
              {{ sc }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="group in groupedMetrics"
            :key="group.section"
          >
            <!-- 섹션 타이틀 -->
            <tr class="section-row">
              <td
                :colspan="1 + selectedScenarios.length"
                class="section-title"
              >
                {{ group.section }}
              </td>
            </tr>

            <!-- Metric Rows -->
            <tr
              v-for="metric in group.items"
              :key="metric.label"
            >
              <td class="metric-name">
                {{ metric.label }}
              </td>

              <td
                v-for="sc in selectedScenarios"
                :key="sc"
                class="metric-value"
                :style="{ color: `rgb(var(--v-theme-${scenarioColor(sc)}))` }"
              >
                {{
                  scenarioData[sc]?.find(m => m.label === metric.label)?.value
                    || '-'
                }}
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

/* ======================================
   🔥 테이블 기본 row 높이 조절 (작게)
   → Projection Report info-row 와 동일
   ====================================== */
.scenario-table td,
.scenario-table th {
  border-block-end: none !important;
  line-height: 1.3;
  padding-block: 8px;          /* 기존 12px → 8px */
  padding-inline: 14px;
  white-space: nowrap;
}

/* --------------------------- */

/*  🔹 Header Row (회색 배경)  */

/* --------------------------- */
.scenario-table thead th {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
  border-block-end: 1px solid rgba(var(--v-border-color), 0.2) !important;
  font-size: 0.9rem;
  font-weight: 700;
  padding-block: 12px;        /* header는 조금 더 크게 */
  text-align: center;
}

/* Metric 첫 컬럼 */
.metric-col {
  text-align: start;
}

.metric-name {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 600;
}

/* --------------------------- */

/*   🔥 섹션 TITLE 스타일       */

/*   (섹션 위에만 굵은 라인)   */

/* --------------------------- */
.section-row td {
  border-block-end: none !important;
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
  padding-block: 16px 6px !important;  /* 기존 20px → 16px로 줄임 */
}

.section-title {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 15px;
  font-weight: 600;
}

/* --------------------------- */

/*   칼럼 값 스타일             */

/* --------------------------- */
.metric-value {
  font-weight: 500;
}
</style>
