<script setup lang="ts">
import TabCreateScenario from '@/views/pages/scenario-analysis/TabCreateScenario.vue'
import TabDefaultCheck from '@/views/pages/scenario-analysis/TabDefaultCheck.vue'
import TabResult from '@/views/pages/scenario-analysis/TabResult.vue'

const currentTab = ref('Create Scenario')
const tabsData = ['Create Scenario', 'Result', 'Default Check']
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
        class="custom-tab"
      >
        {{ tab }}
      </VTab>
    </VTabs>

    <!-- 🔹 Divider (보라색 언더라인과 정렬되도록 위로 이동) -->
    <VDivider class="tab-divider" />

    <!-- 🔹 콘텐츠 영역 -->
    <VCardText class="pt-0">
      <VWindow v-model="currentTab">
        <VWindowItem value="Create Scenario">
          <TabCreateScenario />
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
/* ✅ 탭 바 스타일 */
.custom-tab-bar {
  align-items: center !important;
  justify-content: center !important;
  background-color: transparent;
  border-block-end: none !important;
  min-block-size: 68px;
  padding-inline: 10px !important; /* 🔹 좌우 여백 줄여서 앞으로 당김 */
}

/* ✅ 탭 텍스트 정렬 */
.custom-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 68px;
  color: rgba(var(--v-theme-on-surface), 0.87) !important;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  text-transform: none;
  transition: color 0.25s ease;
}

/* ✅ 탭 내부 중앙 정렬 */
.v-tab .v-btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ 활성 탭 강조 */
.v-tab.v-tab--selected {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

/* ✅ Divider — 언더라인과 높이 일치 */
.tab-divider {
  border-color: rgba(var(--v-border-color), 0.12);
  margin-block-start: -2px !important;
}

/* ✅ Slide 그룹 간격 줄이기 */
.v-slide-group__content {
  padding-inline: 10px !important; /* 🔹 좌우 간격 축소 */
  transition: all 0.25s ease-in-out;
}
</style>
