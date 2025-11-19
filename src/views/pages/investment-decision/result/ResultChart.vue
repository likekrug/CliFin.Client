<script setup lang="ts">
import FinancialConditionBox from './FinancialConditionBox.vue'

interface MetricItem {
  label: string
  value: string
}

interface ScenarioData {
  Project: MetricItem[]
  Simulation: MetricItem[]
}

const props = defineProps<{
  scenarioData: ScenarioData
}>()

// -----------------------------
//   값 추출 유틸
// -----------------------------
const extractValue = (list: MetricItem[], label: string) =>
  list.find(m => m.label === label)?.value ?? '-'

// -----------------------------
//   before / after 파싱
// -----------------------------
const Project = props.scenarioData.Project
const Simulation = props.scenarioData.Simulation

const finBefore = {
  de: extractValue(Simulation, 'Debt amount'),
  tenor: extractValue(Simulation, 'Tenor / Margin'),
  dsra: extractValue(Simulation, 'EOD threshold / DSRA'),
}

const finAfter = {
  de: extractValue(Simulation, 'Debt amount'),
  tenor: extractValue(Simulation, 'Tenor / Margin'),
  dsra: extractValue(Simulation, 'EOD threshold / DSRA'),
}
</script>

<template>
  <VRow class="gy-6">
    <VCol
      cols="12"
      md="6"
    >
      <FinancialConditionBox
        title="Project"
        :data="finBefore"
        mode="Project"
      />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <FinancialConditionBox
        title="Simulation"
        :data="finAfter"
        mode="Simulation"
      />
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.main-wrapper {
  border: 1px solid rgba(var(--v-border-color), 0.15);
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}
</style>
