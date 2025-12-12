// import { defineStore } from 'pinia'
// import { fetchAssetTypes } from '@/api/asset.api'
// import type { AssetType } from '@/types/asset.types'

// const SESSION_KEY = 'clinweb-asset'

// export const useAssetStore = defineStore('asset', {
//   state: () => ({
//     list: [] as AssetType[],
//     loading: false, // UI 상태 (캐시 X)
//     loaded: false, // 재호출 방지용
//   }),

//   actions: {
//     /**
//      * App 진입 시 1회 로드
//      * - sessionStorage 캐시 있으면 우선 사용
//      * - 이후 API로 최신 데이터 갱신
//      */
//     async load() {
//       if (this.loaded)
//         return

//       //  sessionStorage 캐시 복원 (선택)
//       if (typeof window !== 'undefined') {
//         try {
//           const cached = sessionStorage.getItem(SESSION_KEY)
//           if (cached) {
//             const parsed = JSON.parse(cached)

//             this.list = parsed.list ?? []
//             this.loaded = true
//           }
//         }
//         catch {
//           // 캐시 깨졌으면 무시
//         }
//       }

//       //  API 호출 (source of truth)
//       this.loading = true
//       try {
//         const res = await fetchAssetTypes()

//         this.list = res.data
//         this.loaded = true

//         //  API 성공 이후 sessionStorage에 단발 저장
//         if (typeof window !== 'undefined') {
//           try {
//             sessionStorage.setItem(
//               SESSION_KEY,
//               JSON.stringify({
//                 list: this.list,
//                 loaded: true,
//               }),
//             )
//           }
//           catch {
//             // storage 불가 환경 무시
//           }
//         }
//       }
//       finally {
//         this.loading = false
//       }
//     },

//     /**
//      * 강제 초기화 (로그아웃 등)
//      */
//     reset() {
//       this.list = []
//       this.loaded = false

//       if (typeof window !== 'undefined') {
//         try {
//           sessionStorage.removeItem(SESSION_KEY)
//         }
//         catch {
//           // 무시
//         }
//       }
//     },
//   },
// })
import { defineStore } from 'pinia'
import { fetchAssetTypes } from '@/api/asset.api'
import type { AssetType } from '@/types/asset.types'

export const useAssetStore = defineStore('asset', {
  // ------------------------
  // STATE
  // ------------------------
  state: () => ({
    list: [] as AssetType[],
    loading: false,
    loaded: false, // store 기준 로딩 완료 여부
  }),

  // ------------------------
  // ACTIONS
  // ------------------------
  actions: {
    /**
     * Asset Type 로드
     * - store에 값이 있으면 그대로 사용
     * - 없을 때만 API 호출
     */
    async load() {
      // ✅ 1) 이미 로드 + 데이터 있으면 API 호출 안 함
      if (this.loaded && this.list.length > 0)
        return

      this.loading = true
      try {
        const res = await fetchAssetTypes()

        this.list = res.data ?? []
        this.loaded = true
      }
      finally {
        this.loading = false
      }
    },

    /**
     * 강제 초기화 (로그아웃 등)
     */
    reset() {
      this.list = []
      this.loaded = false
    },
  },
})
