// /api/project.ts
import type { ProjectDefaultData } from '@/types/projectDefault.types'
import type { ApiResponse } from '@/types/response.types'
import { $api } from '@/utils/api'

export const apiProject = {
  getDefaultValues() {
    return $api<ApiResponse<ProjectDefaultData>>('project/assettypes/defaults', {
      method: 'GET',
    })
  },
}
