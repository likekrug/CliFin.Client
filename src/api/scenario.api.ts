import type { ScenarioType } from '@/types/scenario.types'
import type { ApiResponse } from '@/types/response.types'
import type { AssetRiskFactorResponse } from '@/types/scenarioRiskFactor.types'
import { $api } from '@/utils/api'

export const apiScenario = {
  /**
   * 시나리오 타입 목록 조회
   * GET /scenario/types
   */
  getTypes() {
    return $api<ApiResponse<ScenarioType[]>>(
      'scenario/types',
      {
        method: 'GET',
      },
    )
  },

  /**
   * 자산 타입별 Risk Factor 기준 조회
   * GET /scenario/risk-factors
   */
  getRiskFactors() {
    return $api<ApiResponse<AssetRiskFactorResponse>>(
      'scenario/risk-factors',
      {
        method: 'GET',
      },
    )
  },
}
