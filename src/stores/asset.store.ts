import { defineStore } from 'pinia'
import { fetchAssetTypes } from '@/api/asset.api'
import type { AssetType } from '@/types/asset.types'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    list: [] as AssetType[],
    loading: false,
    loaded: false, // 이미 조회한 적 있는지 여부
  }),

  actions: {
    async load() {
      if (this.loaded)
        return

      this.loading = true
      try {
        const res = await fetchAssetTypes()

        this.list = res.data
        this.loaded = true // 조회 완료 상태 체크
      }
      finally {
        this.loading = false
      }
    },
  },
})
