<script setup lang="ts">
interface Project {
  id: number
  name: string
  type: string
  location: string
}

interface Props {
  projects: Project[]
  selectedProject: Project
}

const { projects, selectedProject } = defineProps<Props>()
const emit = defineEmits(['update:selectedProject'])

const selectProject = (project: Project) => emit('update:selectedProject', project)

const boardActions = [
  {
    title: 'Modify Project',
    prependIcon: 'ri-pencil-line',

    // onClick: () => { isBoardNameEditing.value = true },
  },
  {
    title: 'Delete',
    prependIcon: 'ri-delete-bin-line',

    // onClick: () => (emit('deleteBoard', props.boardId)),
  },
]
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <div
      v-for="project in projects"
      :key="project.id"
      class="project-card pa-3"
      :class="{ active: selectedProject.id === project.id }"
      @click="selectProject(project)"
    >
      <div
        class="text-h6 font-weight-semibold text-truncate"
        style="max-inline-size: 180px;"
        :title="project.name"
      >
        {{ project.name }}
      </div>
      <div class="d-flex align-center justify-space-between text-body-2 text-medium-emphasis">
        <span>{{ project.type }}</span>

        <MoreBtn
          size="x-small"
          icon-size="20"
          :menu-list="boardActions"
          item-props
        />
      </div>
      <VDivider class="my-2" />
      <div class="text-body-2">
        <strong>Location</strong><br>
        {{ project.location }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 10px;
  background-color: rgb(var(--v-theme-surface));
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.project-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 10%);
  outline: 1px solid rgba(var(--v-border-color), 0.2); /* ⭐ 추가 */
  outline-offset: 0;
}

.project-card.active {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}
</style>
