// /src/stores/riskFactor.store.ts
import { defineStore } from 'pinia'
import { apiScenario } from '@/api/scenario.api'
import type {
  AssetRiskFactorMap,
  RiskFactor,
} from '@/types/scenarioRiskFactor.types'

export const useRiskFactorStore = defineStore('riskFactor', {
  state: () => ({
    assetTypes: {} as AssetRiskFactorMap,
    riskFactors: [] as RiskFactor[],
    loaded: false,
    loading: false,
  }),

  actions: {
    async load() {
      if (this.loaded)
        return

      this.loading = true
      try {
        const res = await apiScenario.getRiskFactors()
        const data = res.data

        this.assetTypes = data.assetTypes
        this.riskFactors = data.riskFactors
        this.loaded = true
      }
      finally {
        this.loading = false
      }
    },

    getRiskFactorsByAsset(assetType: string): RiskFactor[] {
      const codes = this.assetTypes[assetType] || []

      return this.riskFactors.filter(r => codes.includes(r.code))
    },
  },
})
