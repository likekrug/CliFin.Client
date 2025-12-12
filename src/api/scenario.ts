import type { ApiResponse } from '@/types/response.types'
import { $api } from '@/utils/api'

// 시나리오 분석 요청 타입
export interface ScenarioAnalysisRequest {
  baseline: boolean
  scenarios: string[]
  selectedProjects: Array<{
    id: number
    type: string
    riskFactors: string[]
  }>
}

// 시나리오 분석 응답 타입
export interface ScenarioAnalysisResult {
  [scenario: string]: Array<{
    label: string
    value: string
  }>
}

export const apiScenario = {
  // 사용 가능한 시나리오 목록
  getAvailableScenarios() {
    return $api<ApiResponse<string[]>>('scenario/available', {
      method: 'GET',
    })
  },
  
  // 시나리오 분석 실행  
  analyzeScenarios(requestData: ScenarioAnalysisRequest) {
    return $api<ApiResponse<ScenarioAnalysisResult>>('scenario/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestData,
    })
  },
}