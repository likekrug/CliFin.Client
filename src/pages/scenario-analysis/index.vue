<script setup lang="ts">
import { ref } from 'vue'
import TabCreateScenario from '@/views/pages/scenario-analysis/TabCreateScenario.vue'
import TabDefaultCheck from '@/views/pages/scenario-analysis/TabDefaultCheck.vue'
import TabResult from '@/views/pages/scenario-analysis/TabResult.vue'

const currentTab = ref('Create Scenario')
const tabsData = ['Create Scenario', 'Result', 'Default Check']

//  탭 변경 함수
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

    <!-- 🔹 Divider -->
    <VDivider class="tab-divider" />

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
.custom-tab-bar {
  align-items: center !important;
  justify-content: center !important;
  background-color: transparent;
  border-block-end: none !important;
  min-block-size: 68px;
  padding-inline: 10px !important;
}

/*  활성 탭 강조 색상 */
.v-tab.v-tab--selected {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

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

.tab-divider {
  border-color: rgba(var(--v-border-color), 0.12);
  margin-block-start: -2px !important;
}
</style>
