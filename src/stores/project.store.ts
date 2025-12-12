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
  // ACTIONS
  // ------------------------

  /** LocalStorage → Store  */
  const loadProjects = (): void => {
    if (loaded.value)
      return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      projects.value = stored ? JSON.parse(stored) : []
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

  /** 초기 진입 시 보장 로딩 */
  const init = (): void => {
    loadProjects()
  }

  /** 프로젝트 추가 */
  const addProject = (project: Project): void => {
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
    projects.value = projects.value.filter(p => p.id !== id)
    saveProjects()
  }

  /** 단건 조회 (편집 / 상세 화면) */
  const getProjectById = (id: string): Project | null => {
    return projects.value.find(p => p.id === id) ?? null
  }

  /** 전체 초기화 (로그아웃 등) */
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
    loadProjects,
    addProject,
    updateProject,
    removeProject,
    getProjectById,
    reset,
  }
})
