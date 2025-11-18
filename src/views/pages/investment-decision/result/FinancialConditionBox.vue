<script setup lang="ts">
import ChartCard from '../../scenario-analysis/result/ChartCard.vue'

interface FinanceData {
  de: string
  tenor: string
  dsra: string
}

const props = defineProps<{
  title: string
  data: FinanceData
  mode: string
}>()
</script>

<template>
  <VCard
    class="finance-box pa-4"
    elevation="0"
  >
    <!-- Title -->
    <div class="text-h6 font-weight-semibold mb-3">
      Financial Conditions ({{ title }})
    </div>

    <!-- List -->
    <ul class="fin-list">
      <li>
        <strong>Debt to Equity Ratio :</strong>
        {{ props.data.de }}
      </li>

      <li>
        <strong>Tenor :</strong>
        {{ props.data.tenor }}
      </li>

      <li>
        <strong>DSRA :</strong>
        {{ props.data.dsra }}
      </li>
    </ul>

    <!-- Chart -->
    <ChartCard :scenario="props.mode" />
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
