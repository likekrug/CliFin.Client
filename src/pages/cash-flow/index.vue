<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import CashFlowReportCard from '@/views/pages/cash-flow/CashFlowReportCard.vue'
import EChart from '@/views/pages/cash-flow/EChart.vue'
import ProjectList from '@/views/pages/cash-flow/ProjectList.vue'

import { useProjectStore } from '@/stores/project.store'
import { apiProject } from '@/api/project'
import type { Project } from '@/types/project.types'

// ----------------------
// 🔹 Store
// ----------------------
const projectStore = useProjectStore()

onMounted(() => {
  projectStore.init()
})

// ----------------------
// 🔹 프로젝트 목록 (store)
// ----------------------
const projects = computed(() => projectStore.sortedProjects)

// ----------------------
// 🔹 선택된 프로젝트
// ----------------------
const selectedProject = ref<Project | null>(null)

// 최초 자동 선택
watch(
  projects,
  list => {
    if (!selectedProject.value && list.length > 0)
      selectedProject.value = list[0]
  },
  { immediate: true },
)

// ----------------------
// 🔹 Evaluate 결과 (핵심)
// ----------------------
const evaluateResult = ref<any | null>(null)
const evaluating = ref(false)
const evaluateError = ref<string | null>(null)

// ----------------------
// 🔹 API 호출 (evaluate)
// ----------------------
const evaluateProject = async (project: Project) => {
  const payload = {
    projectId: project.id,
    projectName: project.name,
    assetType: project.assetType,
    location: {
      lat: project.location.lat,
      lng: project.location.lng,
    },
    model: project.model,
  }

  evaluating.value = true
  evaluateError.value = null

  try {
    const res = await apiProject.evaluate(payload)

    evaluateResult.value = res.data
  }
  catch (err) {
    console.error('[evaluate error]', err)
    evaluateResult.value = null
    evaluateError.value = 'Failed to evaluate project'
  }
  finally {
    evaluating.value = false
  }
}

// ----------------------
// 🔹 선택 프로젝트 변경 시 API 호출
// ----------------------
watch(
  selectedProject,
  project => {
    if (!project)
      return

    evaluateProject(project)
  },
  { immediate: true },
)
</script>

<template>
  <VRow>
    <!-- 왼쪽: 프로젝트 리스트 -->
    <VCol
      cols="12"
      md="2"
    >
      <ProjectList
        v-model:selected-project="selectedProject"
        :projects="projects"
      />
    </VCol>

    <!-- 오른쪽: 보고서 + 그래프 -->
    <VCol
      cols="12"
      md="10"
    >
      <VRow>
        <!-- 상단: 보고서 -->
        <VCol cols="12">
          <CashFlowReportCard
            v-if="selectedProject && evaluateResult"
            :project="selectedProject"
            :table="evaluateResult.table"
            :loading="evaluating"
          />
        </VCol>

        <!-- 하단: 차트 -->
        <VCol cols="12">
          <EChart
            v-if="selectedProject && evaluateResult"
            :figure="evaluateResult.figure"
            :loading="evaluating"
          />
        </VCol>

        <!-- 에러 표시 (선택) -->
        <VCol
          v-if="evaluateError"
          cols="12"
        >
          <VAlert
            type="error"
            variant="tonal"
          >
            {{ evaluateError }}
          </VAlert>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
