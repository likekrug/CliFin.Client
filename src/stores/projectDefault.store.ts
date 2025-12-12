// =============================================
// /src/stores/projectDefault.store.ts
// =============================================
import { defineStore } from 'pinia'

import { apiProject } from '@/api/project'
import type { ProjectDefaultData } from '@/types/projectDefault.types'

const SESSION_KEY = 'clinweb-project-default'

export const useProjectDefaultStore = defineStore('projectDefault', {
  // ------------------------
  // STATE
  // ------------------------
  state: () => ({
    data: {} as ProjectDefaultData,

    // 캐시/로드 여부 (API 재호출 방지용)
    loaded: false,

    // UI 상태
    loading: false,
  }),

  // ------------------------
  // GETTERS
  // ------------------------
  getters: {
    /** 특정 assetType 전체(default) 구조 반환 */
    getDefaultsByType: state => {
      return (assetType: keyof ProjectDefaultData) => {
        return state.data[assetType] ?? null
      }
    },

    /** categoryCode + groupCode → group 반환 */
    findGroup: state => {
      return (
        assetType: keyof ProjectDefaultData,
        categoryCode: string,
        groupCode: string,
      ) => {
        const asset = state.data[assetType]
        if (!asset)
          return null

        const category = asset.categories.find(
          c => c.categoryCode === categoryCode,
        )

        return category?.groups.find(
          g => g.groupCode === groupCode,
        ) ?? null
      }
    },

    /** category + group + itemCode → item 반환 */
    findItem: state => {
      return (
        assetType: keyof ProjectDefaultData,
        categoryCode: string,
        groupCode: string,
        itemCode: string,
      ) => {
        const asset = state.data[assetType]
        if (!asset)
          return null

        for (const cat of asset.categories) {
          if (cat.categoryCode !== categoryCode)
            continue

          for (const grp of cat.groups) {
            if (grp.groupCode !== groupCode)
              continue

            return grp.items.find(i => i.itemCode === itemCode) ?? null
          }
        }

        return null
      }
    },

    /** itemCode 하나만으로 meta 자동 탐색 */
    getItemMeta: state => {
      return (
        assetType: keyof ProjectDefaultData,
        itemCode: string,
      ) => {
        const asset = state.data[assetType]
        if (!asset)
          return null

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
                    ? `${item.min} ~ ${item.max} ${
                      item.unit !== 'NaN' ? item.unit : ''
                    }`.trim()
                    : '',
              }
            }
          }
        }

        return null
      }
    },
  },

  // ------------------------
  // ACTIONS
  // ------------------------
  actions: {
    /**
     * 1️⃣ App 로드시 호출
     * - sessionStorage 캐시가 있으면 먼저 사용
     * - 이후 API로 최신 데이터 갱신
     */
    async initOnAppLoad() {
      if (this.loaded)
        return

      // 1) sessionStorage 캐시 복원 (선택)
      if (typeof window !== 'undefined') {
        try {
          const cached = sessionStorage.getItem(SESSION_KEY)
          if (cached) {
            const parsed = JSON.parse(cached)

            this.data = parsed.data ?? {}
            this.loaded = true

            // return 하지 않음 → API로 최신값 덮어씀
          }
        }
        catch {
          // 캐시 오류 무시
        }
      }

      // 2) API 호출
      this.loading = true
      try {
        const res = await apiProject.getDefaultValues()

        this.data = res.data
        this.loaded = true

        // 3) API 성공 이후 sessionStorage 단발 저장
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(
              SESSION_KEY,
              JSON.stringify({
                data: this.data,
                loaded: true,
              }),
            )
          }
          catch {
            // storage 불가 환경 무시
          }
        }
      }
      finally {
        this.loading = false
      }
    },

    /**
     *  Store 사용 시 보장 로딩
     * - loaded=false일 때만 API 호출
     */
    async ensureDefaultData() {
      if (this.loaded)
        return

      await this.initOnAppLoad()
    },

    /** 선택된 assetType의 default 값만 flat model로 구성 */
    buildModel(assetType: keyof ProjectDefaultData) {
      const asset = this.data[assetType]
      if (!asset)
        return {}

      const model: Record<string, number | boolean | null> = {}

      asset.categories.forEach(cat => {
        cat.groups.forEach(grp => {
          grp.items.forEach(item => {
            const raw = item.default
            const type = item.dataType

            // ------------------------
            //  boolean
            // ------------------------
            if (type === 'boolean') {
              model[item.itemCode]
            = typeof raw === 'boolean'
                  ? raw
                  : raw === 'true'
                    ? true
                    : raw === 'false'
                      ? false
                      : null

              return
            }

            // ------------------------
            //  number (int / float)
            // ------------------------
            if (type === 'int' || type === 'float') {
              if (
                raw === null
            || raw === undefined
            || raw === ''
            || raw === '-'
            || raw === 'NaN'
              ) {
                model[item.itemCode] = null

                return
              }

              const num = Number(raw)

              model[item.itemCode] = Number.isFinite(num) ? num : null

              return
            }

            // ------------------------
            //  그 외 (미정의 타입)
            // ------------------------
            model[item.itemCode] = null
          })
        })
      })

      return model
    },

    /** 강제 초기화 (로그아웃 / 캐시 리셋용) */
    reset() {
      this.data = {} as ProjectDefaultData
      this.loaded = false

      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem(SESSION_KEY)
        }
        catch {
          // 무시
        }
      }
    },
  },
})
