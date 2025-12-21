// /src/stores/scenario.store.ts
import { defineStore } from 'pinia'
import { apiScenario } from '@/api/scenario.api'
import type { ScenarioType } from '@/types/scenario.types'

export const useScenarioStore = defineStore('scenario', {
  state: () => ({
    list: [] as ScenarioType[],
    loading: false,
    loaded: false,
  }),

  getters: {
    sortedList: state =>
      [...state.list].sort((a, b) => a.order - b.order),
  },

  actions: {
    async load() {
      if (this.loaded)
        return

      this.loading = true
      try {
        const res = await apiScenario.getTypes()

        this.list = res.data

        this.loaded = true
      }
      finally {
        this.loading = false
      }
    },
  },
})
