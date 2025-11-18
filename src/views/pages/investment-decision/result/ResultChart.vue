<script setup lang="ts">
import FinancialConditionBox from './FinancialConditionBox.vue'

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

// financial 항목 추출 함수
const extractValue = (list: MetricItem[], label: string) =>
  list.find(m => m.label === label)?.value ?? '-'

// before/after 파싱
const before = props.scenarioData.before
const after = props.scenarioData.after

// financial only
const finBefore = {
  de: extractValue(before, 'Debt amount'),
  tenor: extractValue(before, 'Tenor / Margin'),
  dsra: extractValue(before, 'EOD threshold / DSRA'),
}

const finAfter = {
  de: extractValue(after, 'Debt amount'),
  tenor: extractValue(after, 'Tenor / Margin'),
  dsra: extractValue(after, 'EOD threshold / DSRA'),
}
</script>

<template>
  <VCard
    flat
    class="pa-0"
  >
    <VRow class="gy-6">
      <VCol
        cols="12"
        md="6"
      >
        <FinancialConditionBox
          title="Before"
          :data="finBefore"
          mode="before"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <FinancialConditionBox
          title="After"
          :data="finAfter"
          mode="after"
        />
      </VCol>
    </VRow>
  </VCard>
</template>

<style scoped lang="scss">
.finance-box {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 12px;
  background: rgba(var(--v-theme-secondary), 0.08);
}

.fin-list {
  padding: 0;
  list-style: none;
  margin-block: 0 16px;
  margin-inline: 0;

  li {
    color: rgba(var(--v-theme-on-surface), 0.9);
    font-size: 0.92rem;
    margin-block-end: 6px;
  }
}
</style>
