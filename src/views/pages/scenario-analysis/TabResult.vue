<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ResultReportColor2 from './result/ResultReportColor2.vue'
import ResultScenarioCharts from './result/ResultScenarioCharts.vue'
import Riskbreakdown from './result/Riskbreakdown.vue'
import SelectedScenarioList from './result/SelectedScenarioList.vue'
import { useScenarioStore } from '@/stores/scenario.store'

/* -----------------------------------
  Types
----------------------------------- */
interface SummaryItem {
  id: number
  name: string
  type: string
  location: string
  risks: string[]
}

/* -----------------------------------
  ⭐ Store 연결
----------------------------------- */
const scenarioStore = useScenarioStore()

/* -----------------------------------
  ⭐ Active Project ID
----------------------------------- */
const activeProjectId = ref(1)

/* -----------------------------------
  ⭐ 현재 선택된 프로젝트의 시나리오 데이터
----------------------------------- */
const currentProjectData = computed(() => {
  const projectId = String(activeProjectId.value)
  const data = scenarioStore.getScenarioDataByProjectId(projectId)
  console.log(`📊 프로젝트 ${projectId} 데이터:`, data)
  return data
})

/* -----------------------------------
  ⭐ Dynamic Data: Selected Scenarios from API Only
----------------------------------- */
const selectedScenarios = computed(() => {
  if (scenarioStore.hasData && Object.keys(currentProjectData.value).length > 0) {
    const scenarios = Object.keys(currentProjectData.value)
    console.log('🎯 Dynamic scenarios from API:', scenarios)
    return scenarios
  }

  console.log('⚠️  API 시나리오 없음 - 빈 배열 반환')
  return []
})

// 프로젝트 변경 시 로그
watch(activeProjectId, (newId) => {
  console.log(`🔄 프로젝트 변경: ${newId}`)
  console.log(`📦 Store 전체 데이터 키:`, Object.keys(scenarioStore.scenarioDataByProject))
})

/* -----------------------------------
  ⭐ Tabs (Summary / Breakdown)
----------------------------------- */
const activeTab = ref('summary')

/* -----------------------------------
  ⭐ Dynamic Data: Selected Projects Summary (API에서 가져오기)
----------------------------------- */
const selectedSummary = computed(() => {
  const lastRequestData = scenarioStore.getLastRequestData?.()
  if (lastRequestData?.selectedProjects) {
    console.log('🎯 Store에서 실제 선택된 프로젝트 사용:', lastRequestData.selectedProjects)
    return lastRequestData.selectedProjects.map((project: any) => ({
      id: project.id,
      name: `${project.type.charAt(0).toUpperCase() + project.type.slice(1)} Power Plant`,
      type: project.type,
      location: "Korea",
      risks: project.riskFactors || []
    }))
  }

  console.log('⚠️  Store에 프로젝트 정보 없음 - 임시 프로젝트 사용')
  return [{
    id: 1,
    name: "Coal Power Plant",
    type: "Coal",
    location: "Korea",
    risks: ["EW", "AT"]
  }]
})

/* -----------------------------------
  ⭐ Scenario Data - 현재 선택된 프로젝트의 데이터 사용
----------------------------------- */
const scenarioData = computed(() => currentProjectData.value)
</script>

<template>
  <!-- 기존 템플릿 코드는 그대로 유지 -->
  <VRow class="tab-result-layout">
    <!-- LEFT: Scenario Summary -->
    <VCol
      cols="12"
      md="2"
    >
      <SelectedScenarioList
        v-model:active-id="activeProjectId"
        mode="single"
        :items="selectedSummary"
        :scenarios="selectedScenarios"
      />
    </VCol>

    <!-- RIGHT: Result Panel -->
    <VCol
      cols="12"
      md="10"
    >
      <!-- Tabs -->
      <VTabs
        v-model="activeTab"
        class="mb-4"
      >
        <VTab value="summary">
          Summary
        </VTab>
        <VTab value="breakdown">
          Risk Breakdown
        </VTab>
      </VTabs>

      <VWindow v-model="activeTab">
        <!-- ======================= -->
        <!-- ⭐ SUMMARY TAB 화면      -->
        <!-- ======================= -->
        <VWindowItem value="summary">
          <VRow>
            <VCol cols="12">
              <ResultReportColor2
                v-if="activeTab === 'summary'"
                :selected-scenarios="selectedScenarios"
                :scenario-data="scenarioData"
              />
            </VCol>

            <!-- ⭐ 그래프도 Summary에 포함 -->
            <VCol cols="12">
              <ResultScenarioCharts
                v-if="activeTab === 'summary'"
                :selected-scenarios="selectedScenarios"
                :scenario-data="scenarioData"
              />
            </VCol>
          </VRow>
        </VWindowItem>

        <!-- ======================= -->
        <!-- ⭐ BREAKDOWN TAB 화면 -->
        <!-- ======================= -->
        <VWindowItem value="breakdown">
          <Riskbreakdown
            :selected-scenarios="selectedScenarios"
            :scenario-data="scenarioData"
          />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.tab-result-layout {
  align-items: flex-start;
}
</style>