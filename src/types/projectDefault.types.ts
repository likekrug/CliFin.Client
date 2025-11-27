// =============================================
// /src/types/projectDefault.types.ts
// =============================================

// 개별 아이템
export interface AssetItem {
  itemCode: string
  itemName: string
  dataType: 'int' | 'float' | 'boolean'
  default: number | string
  min: number | string
  max: number | string
  unit: string
}

// 그룹
export interface AssetGroup {
  groupCode: string
  groupName: string
  items: AssetItem[]
}

// 카테고리
export interface AssetCategory {
  categoryCode: string
  categoryName: string
  groups: AssetGroup[]
}

// Asset Default 구조 (coal / solar 등 한 개)
export interface AssetDefault {
  assetType: string
  categories: AssetCategory[]
}

// 전체 default 데이터 구조
export interface ProjectDefaultData {
  coal: AssetDefault
  natural_gas: AssetDefault
  solar: AssetDefault
  wind: AssetDefault
}
