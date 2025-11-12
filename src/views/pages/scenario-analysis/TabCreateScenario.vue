<script setup lang="ts">
import { ref } from 'vue'

// ✅ Baseline은 항상 체크됨
const baselineChecked = ref(true)

// ✅ 다른 시나리오
const otherScenarios = [
  { label: 'SSP126', value: 'SSP126' },
  { label: 'SSP370', value: 'SSP370' },
  { label: 'SSP585', value: 'SSP585' },
]

// ✅ 선택된 시나리오 상태
const selectedScenarios = ref<string[]>([])
</script>

<template>
  <div>
    <!-- 상단 제목 -->
    <!--
      <div class="text-h6 font-weight-semibold mb-2">
      Select Scenario and your project
      </div>
    -->

    <!-- ✅ Scenario Section -->
    <div class="scenario-section mb-6">
      <!-- 제목 줄 -->
      <div class="d-flex align-center text-body-1 mb-3">
        <div class="vertical-bar me-2" />
        Scenario
      </div>

      <!-- 체크박스 줄 -->
      <div class="d-flex align-center flex-wrap gap-4">
        <VCheckbox
          v-model="baselineChecked"
          label="Baseline"
          hide-details
          density="compact"
          class="baseline-checkbox"
        />

        <VCheckbox
          v-for="scenario in otherScenarios"
          :key="scenario.value"
          v-model="selectedScenarios"
          :label="scenario.label"
          :value="scenario.value"
          hide-details
          density="compact"
          class="scenario-checkbox"
        />
      </div>
    </div>

    <!-- 구분선 -->
    <VDivider
      class="my-4"
      style="border-style: dashed;"
    />

    <!-- 하단 컨텐츠 -->
    ProjectList
  </div>
</template>

<style scoped lang="scss">
/* ✅ Scenario 섹션 전체 여백 조정 (Financial Terms와 동일 spacing) */
.scenario-section {
  margin-block-end: 24px;

  .v-checkbox {
    margin-block-start: 2px;
  }
}

/* ✅ 일반 시나리오 체크박스 스타일 */
.scenario-checkbox {
  .v-label {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    font-weight: 500;
  }
}

/* ✅ Baseline 전용 (항상 체크, 클릭 불가, 파란색 강조) */
.baseline-checkbox {
  pointer-events: none; /* 클릭 막기 (disabled 대체) */

  .v-icon,
  .v-label {
    color: rgb(var(--v-theme-primary)) !important; /* 파란색 유지 */
  }

  .v-label {
    font-weight: 600;
  }
}
</style>
