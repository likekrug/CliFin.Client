// =============================================
// /src/utils/projectDefault.helper.ts
// =============================================
import type { AssetCategory, AssetDefault, AssetGroup } from '@/types/projectDefault.types'

/** asset 전체 category 리스트 */
export const getCategories = (asset: AssetDefault | null): AssetCategory[] => {
  return asset?.categories ?? []
}

/** category -> group 리스트 */
export const getGroups = (category: AssetCategory | null): AssetGroup[] => {
  return category?.groups ?? []
}

/** snake_case → Label용 title case */
export const toLabel = (key: string): string => {
  return key
    .replaceAll('_', ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
