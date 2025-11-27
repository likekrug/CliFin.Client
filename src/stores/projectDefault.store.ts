// =============================================
// /src/stores/projectDefault.store.ts
// =============================================
import { defineStore } from 'pinia'
import { apiProject } from '@/api/project'
import type { ProjectDefaultData } from '@/types/projectDefault.types'

export const useProjectDefaultStore = defineStore('projectDefault', {
  state: () => ({
    data: {} as ProjectDefaultData,
    loaded: false,
    loading: false,
  }),

  actions: {
    /** Backend에서 기본값 전체 로드 */
    async loadDefaultData() {
      if (this.loaded)
        return

      this.loading = true
      try {
        const res = await apiProject.getDefaultValues()

        this.data = res.data
        this.loaded = true
      }
      finally {
        this.loading = false
      }
    },

    /** 특정 assetType 전체(default) 구조 반환 */
    getDefaultsByType(assetType: keyof ProjectDefaultData) {
      return this.data[assetType] ?? null
    },

    /** categoryCode + groupCode → group 반환 */
    findGroup(
      assetType: keyof ProjectDefaultData,
      category: string,
      group: string,
    ) {
      const asset = this.data[assetType]
      if (!asset)
        return null

      const cat = asset.categories.find(c => c.categoryCode === category)

      return cat?.groups.find(g => g.groupCode === group) ?? null
    },

    /** category + group + itemCode → item 반환 */
    findItem(
      assetType: keyof ProjectDefaultData,
      category: string,
      group: string,
      itemCode: string,
    ) {
      const grp = this.findGroup(assetType, category, group)

      return grp?.items.find(i => i.itemCode === itemCode) ?? null
    },

    /** itemCode 하나만 넣으면 meta 자동 반환 (min / max / unit / hint) */
    getItemMeta(assetType: keyof ProjectDefaultData, itemCode: string) {
      const asset = this.data[assetType]
      if (!asset)
        return null

      // 전체 탐색
      for (const cat of asset.categories) {
        for (const grp of cat.groups) {
          const item = grp.items.find(i => i.itemCode === itemCode)
          if (item) {
            return {
              ...item,
              categoryCode: cat.categoryCode,
              groupCode: grp.groupCode,
              hint:
                item.min !== '-' && item.max !== '-'
                  ? `${item.min} ~ ${item.max} ${item.unit !== 'NaN' ? item.unit : ''}`.trim()
                  : '',
            }
          }
        }
      }

      return null
    },

    /** 선택된 assetType의 default 값만 flat object로 구성 */
    buildModel(assetType: keyof ProjectDefaultData) {
      const asset = this.data[assetType]
      if (!asset)
        return {}

      const result: Record<string, any> = {}

      asset.categories.forEach(cat => {
        cat.groups.forEach(grp => {
          grp.items.forEach(item => {
            result[item.itemCode] = item.default ?? null
          })
        })
      })

      return result
    },
  },
})
