export interface RiskFactor {
  code: string
  name: string
}

export interface AssetRiskFactorMap {
  [assetType: string]: string[]
}

export interface AssetRiskFactorResponse {
  assetTypes: AssetRiskFactorMap
  riskFactors: RiskFactor[]
}
