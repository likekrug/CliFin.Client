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
    elevation="0"
    class="projection-wrapper mt-4"
    outline
  >
    <VCardTitle class="projection-title px-6 py-4">
      {{ title }}
    </VCardTitle>

    <VDivider class="mb-3" />

    <!-- 카드 내부 여백 시작 -->
    <VCardText class="px-6 pt-2 pb-0">
      <div class="finance-bg pa-4 mb-4">
        <div class="text-h6 font-weight-semibold mb-3">
          Financial Conditions
        </div>

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
      </div>
    </VCardText>
    <!-- 카드 내부 여백 끝 -->

    <!-- Chart -->
    <VCardText class="d-flex justify-center">
      <ChartCard :scenario="props.mode" />
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

.finance-box {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 12px;
  background: rgba(var(--v-theme-secondary), 0.08);
}

.finance-bg {
  border-radius: 12px;
  background: rgba(var(--v-theme-secondary), 0.08);
}

.projection-title {
  display: flex;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 600;
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
