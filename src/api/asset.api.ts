import type { AssetTypeList } from '@/types/asset.types'
import type { ApiResponse } from '@/types/response.types'
import { $api } from '@/utils/api'

/**
 * 에너지 자산 유형 목록 조회
 * GET /project/assettypes
 */
export const fetchAssetTypes = () => {
  return $api<ApiResponse<AssetTypeList>>('/project/assettypes')
}
