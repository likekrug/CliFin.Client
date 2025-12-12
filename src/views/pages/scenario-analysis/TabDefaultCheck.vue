<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import MultiMap from './default-check/MultiMap.vue'
import SingleChart from './default-check/SingleChart.vue'
import SingleReport from './default-check/SingleReport.vue'
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
  ⭐ Single / Multi 선택 상태
----------------------------------- */
const activeProjectId = ref<number | null>(null)
const activeProjectIds = ref<number[]>([])

/* -----------------------------------
  Tabs
----------------------------------- */
const activeTab = ref('single')

/* -----------------------------------
  ⭐ Dynamic Data: Project List from Store
----------------------------------- */
const selectedSummary = computed<SummaryItem[]>(() => {
  const lastRequestData = scenarioStore.getLastRequestData?.()
  if (lastRequestData?.selectedProjects) {
    return lastRequestData.selectedProjects.map((project: any) => ({
      id: project.id,
      name: project.name || `${project.type.charAt(0).toUpperCase() + project.type.slice(1)} Power Plant`,
      type: project.type,
      location: project.location || 'Korea',
      risks: project.riskFactors || []
    }))
  }
  return []
})

// 프로젝트 목록이 로드되면 첫 번째 프로젝트 자동 선택
watch(selectedSummary, (projects) => {
  console.log('📋 [DefaultCheck] selectedSummary 변경:', projects)
  if (projects.length > 0 && activeProjectId.value === null) {
    activeProjectId.value = projects[0].id
    console.log('✅ [DefaultCheck] 첫 프로젝트 자동 선택:', projects[0].id)
  }
}, { immediate: true })

// activeProjectId 변경 추적
watch(activeProjectId, (newId) => {
  console.log('🔄 [DefaultCheck] activeProjectId 변경:', newId)
  console.log('📦 [DefaultCheck] currentProjectData:', currentProjectData.value)
  console.log('📊 [DefaultCheck] dscrChartData:', dscrChartData.value)
})

/* -----------------------------------
  ⭐ 현재 선택된 프로젝트의 시나리오 데이터
----------------------------------- */
const currentProjectData = computed(() => {
  if (activeProjectId.value === null) return {}
  const projectId = String(activeProjectId.value)
  return scenarioStore.getScenarioDataByProjectId(projectId)
})

/* -----------------------------------
  ⭐ Dynamic Data: Selected Scenarios from API
----------------------------------- */
const selectedScenarios = computed(() => {
  if (scenarioStore.hasData && Object.keys(currentProjectData.value).length > 0) {
    return Object.keys(currentProjectData.value)
  }
  return []
})

/* -----------------------------------
  ⭐ DSCR Data for Chart (30년)
----------------------------------- */
const dscrChartData = computed(() => {
  const result: Record<string, number[]> = {}

  for (const scenario of selectedScenarios.value) {
    const scenarioData = currentProjectData.value[scenario]
    if (scenarioData?.chartData?.dscr) {
      result[scenario] = scenarioData.chartData.dscr
    }
  }

  return result
})

/* -----------------------------------
  ⭐ DSCR Data for Table (30년 by Year)
----------------------------------- */
const dscrTableData = computed(() => {
  const startYear = 2025
  const rows: Record<string, number>[] = []

  for (let i = 0; i < 30; i++) {
    const row: Record<string, number> = { year: startYear + i }

    for (const scenario of selectedScenarios.value) {
      const scenarioData = currentProjectData.value[scenario]
      if (scenarioData?.chartData?.dscr?.[i] !== undefined) {
        // scenario key를 소문자로 변환 (Baseline -> baseline, SSP126 -> ssp126)
        const key = scenario.toLowerCase()
        row[key] = Math.round(scenarioData.chartData.dscr[i] * 100) / 100
      }
    }

    rows.push(row)
  }

  return rows
})

/* -----------------------------------
  ⭐ Multi Project용 프로젝트 목록 (위치 정보 포함)
----------------------------------- */
const multiProjectList = computed(() => {
  return selectedSummary.value.map(project => ({
    id: project.id,
    name: project.name,
    type: project.type,
    location: project.location
  }))
})

/* -----------------------------------
  Tab change
----------------------------------- */
const handleTabChange = (v: unknown) => {
  const tab = v as string

  if (tab === 'single')
    activeProjectId.value = activeProjectIds.value[0] ?? selectedSummary.value[0]?.id ?? null

  if (tab === 'multi')
    activeProjectIds.value = selectedSummary.value.map(p => p.id)
}
</script>

<template>
  <VRow class="tab-result-layout">
    <!-- LEFT Project Panel -->
    <VCol
      cols="12"
      md="2"
    >
      <SelectedScenarioList
        v-if="activeTab === 'single'"
        v-model:active-id="activeProjectId"
        mode="single"
        :items="selectedSummary"
        :scenarios="selectedScenarios"
      />

      <SelectedScenarioList
        v-else
        v-model:active-ids="activeProjectIds"
        mode="multi"
        :items="selectedSummary"
        :scenarios="selectedScenarios"
      />
    </VCol>

    <!-- RIGHT Summary / Breakdown -->
    <VCol
      cols="12"
      md="10"
    >
      <VTabs
        v-model="activeTab"
        class="mb-4"
        @update:model-value="handleTabChange"
      >
        <VTab value="single">
          Single Project
        </VTab>
        <VTab value="multi">
          Multi Project
        </VTab>
      </VTabs>

      <VWindow v-model="activeTab">
        <!-- SUMMARY -->
        <VWindowItem value="single">
          <!-- 데이터가 없을 때 안내 메시지 -->
          <VAlert
            v-if="!scenarioStore.hasData || selectedScenarios.length === 0"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            시나리오 분석을 먼저 실행해주세요. Create Scenario 탭에서 프로젝트를 선택하고 분석을 실행하면 결과가 표시됩니다.
          </VAlert>

          <VRow v-else>
            <VCol
              cols="12"
              md="6"
            >
              <SingleChart
                :selected-scenarios="selectedScenarios"
                :dscr-data="dscrChartData"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <SingleReport
                :start-year="2025"
                :selected-scenarios="selectedScenarios"
                :scenario-data="dscrTableData"
              />
            </VCol>
          </VRow>
        </VWindowItem>

        <!-- MULTI PROJECT -->
        <VWindowItem value="multi">
          <VRow>
            <VCol cols="12">
              <MultiMap
                :projects="multiProjectList"
                :scenario-data="scenarioStore.scenarioDataByProject"
                :selected-scenarios="selectedScenarios"
              />
            </VCol>
          </VRow>
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
