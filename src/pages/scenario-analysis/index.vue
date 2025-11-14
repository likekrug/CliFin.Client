<script setup lang="ts">
import { ref } from 'vue'
import TabCreateScenario from '@/views/pages/scenario-analysis/TabCreateScenario.vue'
import TabDefaultCheck from '@/views/pages/scenario-analysis/TabDefaultCheck.vue'
import TabResult from '@/views/pages/scenario-analysis/TabResult.vue'

const currentTab = ref('Create Scenario')
const tabsData = ['Create Scenario', 'Result', 'Default Check']

// 탭 변경 함수
const handleChangeTab = (target: string) => {
  currentTab.value = target
}
</script>

<template>
  <VCard>
    <!-- 🔹 탭 영역 -->
    <VTabs
      v-model="currentTab"
      justify="center"
      grow
      class="disable-tab-transition custom-tab-bar"
    >
      <VTab
        v-for="(tab, index) in tabsData"
        :key="index"
        :value="tab"
        class="custom-tab"
      >
        {{ tab }}
      </VTab>
    </VTabs>

    <!-- 🔹 콘텐츠 영역 -->
    <VCardText class="pt-0">
      <VWindow v-model="currentTab">
        <VWindowItem value="Create Scenario">
          <TabCreateScenario @change-tab="handleChangeTab" />
        </VWindowItem>

        <VWindowItem value="Result">
          <TabResult />
        </VWindowItem>

        <VWindowItem value="Default Check">
          <TabDefaultCheck />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>

<style scoped>
/* ------------------------------
 🔹 탭 바 전체 스타일
------------------------------ */
.custom-tab-bar {
  align-items: center !important;
  justify-content: center !important;
  background-color: transparent;
  border-block-end: none !important;
  min-block-size: 68px;
  padding-inline: 10px !important;
}

/* 🔹 활성 탭 강조 */
.v-tab.v-tab--selected {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

/* 🔹 탭 텍스트 */
.custom-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 68px;
  color: rgba(var(--v-theme-on-surface), 0.87) !important;
  font-size: 1rem;
  font-weight: 500;
  text-transform: none;
  transition: color 0.25s ease;
}

/* ---------------------------------------------------------
   ⭐ Vuetify 내부 구조 기반으로 "항상 보이는 라인" 추가
   (Materio + Vuetify3 일 때 확실하게 보이도록)
------------------------------------------------------------ */

/* v-slide-group → v-slide-group__container 가 underline 기준 */
.custom-tab-bar :deep(.v-slide-group__container) {
  position: relative; /* 기준점 */
}

/* ⭐ 항상 보이는 고정 라인 */
.custom-tab-bar :deep(.v-slide-group__container)::after {
  position: absolute;
  z-index: 1;
  background-color: rgba(var(--v-border-color), 0.16);
  block-size: 1px;
  content: "";
  inset-block-end: 0;      /* 활성 underline 과 정확히 맞춤 */
  inset-inline: 0;
  pointer-events: none;
}

/* 활성 underline (보라색)이 위로 오도록 */
.custom-tab-bar :deep(.v-tabs-bar__slider) {
  z-index: 2 !important;
  block-size: 2px !important;
}

/* (옵션) 필요 없어서 제거함 - 충돌 요소 */
.tab-divider {
  display: none;
}
</style>
