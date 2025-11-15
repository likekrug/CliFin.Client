<script setup lang="ts">
interface SummaryItem {
  id: number
  name: string
  type: string
  location: string
  risks: string[]
}

const props = defineProps<{
  items: SummaryItem[]
  scenarios: string[]
  activeId?: number | null
}>()

const emit = defineEmits(['update:activeId'])

const selectItem = (item: SummaryItem) => {
  emit('update:activeId', item.id)
}
</script>

<template>
  <div class="left-panel-wrapper">
    <!-- 제목 -->
    <div class="text-body-1 mb-3 d-flex align-center">
      <div class="vertical-bar me-2" />
      Your Scenario
    </div>

    <!-- Scenario Chips -->
    <div class="d-flex flex-wrap gap-2 mb-4">
      <VChip
        v-for="sc in scenarios"
        :key="sc"
        size="small"
        :color="sc === 'Baseline'
          ? 'secondary'
          : sc === 'SSP126'
            ? 'info'
            : sc === 'SSP585'
              ? 'error'
              : sc === 'SSP170'
                ? 'warning'
                : 'success'"
        variant="tonal"
      >
        {{ sc }}
      </VChip>
    </div>

    <!-- Summary Cards -->
    <VCard
      v-for="item in items"
      :key="item.id"
      class="project-card pa-3 mb-4"
      :class="{ active: props.activeId === item.id }"
      @click="selectItem(item)"
    >
      <div
        class="summary-title text-truncate"
        style="max-inline-size: 180px;"
        :title="item.name"
      >
        {{ item.name }}
      </div>

      <div class="text-caption text-medium-emphasis mb-2">
        {{ item.type }}
      </div>

      <VDivider class="my-2" />

      <div class="text-body-2 mb-2">
        <strong>Risk Factor</strong><br>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <VChip
          v-for="risk in item.risks"
          :key="risk"
          size="small"
          variant="tonal"
          color="primary"
        >
          {{ risk }}
        </VChip>
      </div>
    </VCard>
  </div>
</template>

<style scoped lang="scss">
.left-panel-wrapper {
  position: sticky;
  inline-size: 100%;
}

/* 기본 카드 */
.project-card {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 10px;
  background-color: rgb(var(--v-theme-surface));
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.project-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 8%);
  transform: translateY(-2px);
}

/* ✔ 선택된 스타일 (ProjectList와 동일) */
.project-card.active {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.summary-title {
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
