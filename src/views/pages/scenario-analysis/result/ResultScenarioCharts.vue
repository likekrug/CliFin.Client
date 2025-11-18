<!-- ResultScenarioCharts.vue -->
<script setup lang="ts">
import ChartCard from './ChartCard.vue'

const props = defineProps<{
  selectedScenarios: string[]
}>()
</script>

<template>
  <div class="charts-wrapper">
    <div class="charts-row">
      <ChartCard
        v-for="sc in selectedScenarios"
        :key="sc"
        :scenario="sc"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 전체 wrapper — 스크롤바 */
.charts-wrapper {
  overflow: auto hidden;          /*  가로 스크롤 활성 */
  -webkit-overflow-scrolling: touch;
  padding-block: 8px;
  padding-inline: 4px;
  scroll-behavior: smooth;
  white-space: nowrap;       /* iOS 스크롤 끊김 방지 */
}

/* 카드들을 가로로 자연스럽게 나열 */
.charts-row {
  display: flex;
  flex-direction: row;
  padding: 8px;
  gap: 24px;
  inline-size: max-content;  /*  내용 크기만큼 row width 생성 → 스크롤 OK */
}

@media (min-width: 1400px) {
  .charts-wrapper {
    overflow-x: auto;
  }
}
</style>
