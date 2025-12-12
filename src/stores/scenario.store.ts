import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiScenario } from '@/api/scenario'

export const useScenarioStore = defineStore('scenario', () => {
  // 프로젝트별 시나리오 데이터: { "1": { "Baseline": {...}, "SSP126": {...} }, "2": {...} }
  const scenarioDataByProject = ref<Record<string, Record<string, any>>>({})
  const isLoading = ref(false)
  const hasData = ref(false)
  const error = ref<string | null>(null)
  const lastRequestData = ref<any>(null)

  // 하위 호환성을 위한 computed (첫 번째 프로젝트 데이터)
  const scenarioData = computed(() => {
    const projectIds = Object.keys(scenarioDataByProject.value)
    if (projectIds.length > 0) {
      return scenarioDataByProject.value[projectIds[0]]
    }
    return {}
  })

  const analyzeScenarios = async (requestData: any) => {
    isLoading.value = true
    error.value = null
    lastRequestData.value = requestData

    try {
      console.log('🚀 Store에서 시나리오 분석 시작:', requestData)

      const response = await apiScenario.analyzeScenarios(requestData)

      if (response.status === 'success') {
        scenarioDataByProject.value = response.data
        hasData.value = true
        console.log('✅ Store 시나리오 분석 완료 (프로젝트별):', response.data)
        return { success: true, data: response.data }
      } else {
        error.value = response.message || '시나리오 분석 실패'
        console.error('❌ API 응답 실패:', response.message)
        return { success: false, error: error.value }
      }

    } catch (err: any) {
      error.value = err.message || '네트워크 오류'
      console.error('❌ Store API 호출 실패:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const clearData = () => {
    scenarioDataByProject.value = {}
    hasData.value = false
    error.value = null
  }

  // 특정 프로젝트의 시나리오 데이터 가져오기
  const getScenarioDataByProjectId = (projectId: string | number) => {
    return scenarioDataByProject.value[String(projectId)] || {}
  }

  const getScenarioData = () => {
    return scenarioData.value
  }

  const getLastRequestData = () => {
    return lastRequestData.value
  }

  return {
    scenarioData,
    scenarioDataByProject,
    isLoading,
    hasData,
    error,
    analyzeScenarios,
    clearData,
    getScenarioData,
    getScenarioDataByProjectId,
    getLastRequestData
  }
})