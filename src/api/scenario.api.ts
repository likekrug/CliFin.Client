import type { ScenarioType } from '@/types/scenario.types'
import type { ApiResponse } from '@/types/response.types'
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
}
