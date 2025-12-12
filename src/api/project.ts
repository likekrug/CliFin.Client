// /api/project.ts
import type { ProjectDefaultData } from '@/types/projectDefault.types'
import type { EvaluatePayload } from '@/types/project.types'
import type { ApiResponse } from '@/types/response.types'
import { $api } from '@/utils/api'

export const apiProject = {
  getDefaultValues() {
    return $api<ApiResponse<ProjectDefaultData>>('project/assettypes/defaults', {
      method: 'GET',
    })
  },

  evaluate(payload: EvaluatePayload) {
    return $api<ApiResponse<any>>(
      'project/evaluate',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  },
}
