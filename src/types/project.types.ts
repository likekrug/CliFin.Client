// src/types/project.types.ts
export type AssetType = 'coal' | 'natural_gas' | 'wind' | 'solar'

export interface Project {
  id: string
  name: string
  assetType: AssetType

  /** default + user override 결과 (flat) */
  model: Record<string, number | boolean | null>

  location: {
    lat: number
    lng: number
  }
  address: string

  createdAt: string
}
