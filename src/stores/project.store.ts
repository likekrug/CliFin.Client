// =============================================
// /src/stores/project.store.ts
// =============================================
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Project } from '@/types/project.types'

const STORAGE_KEY = 'cliFinProjects'

export const useProjectStore = defineStore('project', () => {
  // ------------------------
  // STATE
  // ------------------------
  const projects = ref<Project[]>([])
  const loaded = ref(false)

  // ------------------------
  // INTERNAL HELPERS
  // ------------------------

  /** LocalStorage → Store (항상 localStorage 우선) */
  const loadProjects = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored)
        projects.value = JSON.parse(stored)

      else
        projects.value = []
    }
    catch (err) {
      console.error('[projectStore] Failed to load projects', err)
      projects.value = []
    }
    finally {
      loaded.value = true
    }
  }

  /** Store → LocalStorage */
  const saveProjects = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.value))
    }
    catch (err) {
      console.error('[projectStore] Failed to save projects', err)
    }
  }

  /** 모든 mutation 전에 load 보장 */
  const ensureLoaded = (): void => {
    if (!loaded.value)
      loadProjects()
  }

  // ------------------------
  // ACTIONS
  // ------------------------

  /** 외부에서 명시적으로 초기 로드하고 싶을 때 */
  const init = (): void => {
    ensureLoaded()
  }

  /** 프로젝트 추가 */
  const addProject = (project: Project): void => {
    ensureLoaded()

    if (projects.value.some(p => p.id === project.id)) {
      console.warn('[projectStore] Duplicate project id:', project.id)

      return
    }

    projects.value.unshift({
      ...project,
      createdAt: project.createdAt ?? new Date().toISOString(),
    })

    saveProjects()
  }

  /** 프로젝트 수정 */
  const updateProject = (updated: Project): void => {
    ensureLoaded()

    const index = projects.value.findIndex(p => p.id === updated.id)
    if (index === -1)
      return

    projects.value[index] = {
      ...projects.value[index],
      ...updated,
      model: { ...updated.model },
    }

    saveProjects()
  }

  /** 프로젝트 삭제 */
  const removeProject = (id: string): void => {
    ensureLoaded()

    projects.value = projects.value.filter(p => p.id !== id)
    saveProjects()
  }

  /** 단건 조회 (편집 / 상세) */
  const getProjectById = (id: string): Project | null => {
    ensureLoaded()

    return projects.value.find(p => p.id === id) ?? null
  }

  /** 전체 초기화 (로그아웃 등에서만 호출) */
  const reset = (): void => {
    projects.value = []
    loaded.value = false

    try {
      localStorage.removeItem(STORAGE_KEY)
    }
    catch {
      /* noop */
    }
  }

  // ------------------------
  // GETTERS
  // ------------------------

  /** 최신 생성 순 정렬 */
  const sortedProjects = computed(() => {
    return [...projects.value].sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0

      return bTime - aTime
    })
  })

  return {
    // state
    projects,
    sortedProjects,

    // actions
    init,
    addProject,
    updateProject,
    removeProject,
    getProjectById,
    reset,
  }
})
