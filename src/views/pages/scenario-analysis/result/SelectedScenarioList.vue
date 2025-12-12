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
  mode: 'single' | 'multi'
  activeId?: number | null
  activeIds?: number[]
}>()

const emit = defineEmits([
  'update:activeId',
  'update:activeIds',
])

/* ===================================================
  🔹 Single 선택
=================================================== */
const selectSingle = (item: SummaryItem) => {
  console.log('🖱️ 클릭된 프로젝트:', item.id, item.name)
  console.log('🔍 현재 activeId:', props.activeId)
  if (props.activeId !== item.id) {
    console.log('✅ emit update:activeId', item.id)
    emit('update:activeId', item.id)
  }
}

/* ===================================================
  🔹 Multi 선택 (toggle)
=================================================== */
const toggleMulti = (item: SummaryItem) => {
  const list = props.activeIds ? [...props.activeIds] : []

  const exists = list.includes(item.id)

  emit(
    'update:activeIds',
    exists ? list.filter(x => x !== item.id) : [...list, item.id],
  )
}
</script>

<template>
  <div class="left-panel-wrapper">
    <!-- 제목 -->
    <div class="text-body-1 mb-3 d-flex align-center">
      <div class="vertical-bar me-2" />
      Selected Scenarios
    </div>

    <!-- Scenario Chips -->
    <div class="d-flex flex-wrap gap-2 mb-4">
      <VChip
        v-for="sc in scenarios"
        :key="sc"
        size="small"
        :color="
          sc === 'Baseline'
            ? 'secondary'
            : sc === 'SSP126'
              ? 'info'
              : sc === 'SSP585'
                ? 'error'
                : sc === 'SSP170'
                  ? 'warning'
                  : 'primary'
        "
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
      :class="{
        active:
          (props.mode === 'single' && props.activeId === item.id)
          || (props.mode === 'multi' && props.activeIds?.includes(item.id)),
      }"
      @click="
        props.mode === 'single'
          ? selectSingle(item)
          : toggleMulti(item)
      "
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

/* 선택된 상태 */
.project-card.active {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.summary-title {
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
