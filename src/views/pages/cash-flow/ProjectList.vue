<script setup lang="ts">
import type { Project } from '@/types/project.types'

// ----------------------
// Props
// ----------------------
interface Props {
  projects: Project[]
  selectedProject: Project | null
}

const props = defineProps<Props>()

// ----------------------
// Emits
// ----------------------
const emit = defineEmits<{
  (e: 'update:selectedProject', value: Project): void
}>()

// ----------------------
// Methods
// ----------------------
const selectProject = (project: Project) => {
  emit('update:selectedProject', project)
}

const boardActions = [
  {
    title: 'Modify Project',
    prependIcon: 'ri-pencil-line',
  },
  {
    title: 'Delete',
    prependIcon: 'ri-delete-bin-line',
  },
]
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <div
      v-for="project in props.projects"
      :key="project.id"
      class="project-card pa-3"
      :class="{ active: props.selectedProject?.id === project.id }"
      @click="selectProject(project)"
    >
      <!-- Project Name -->
      <div
        class="text-h6 font-weight-semibold text-truncate"
        style="max-inline-size: 180px;"
        :title="project.name"
      >
        {{ project.name }}
      </div>

      <!-- Asset Type + Menu -->
      <div class="d-flex align-center justify-space-between text-body-2 text-medium-emphasis">
        <span>{{ project.assetType }}</span>

        <MoreBtn
          size="x-small"
          icon-size="20"
          :menu-list="boardActions"
          item-props
        />
      </div>

      <VDivider class="my-2" />

      <!-- Location -->
      <div class="text-body-2">
        <strong>Location</strong><br>
        {{ project.address }}<br>
        <span class="text-disabled">
          {{ project.location.lat.toFixed(4) }},
          {{ project.location.lng.toFixed(4) }}
        </span>
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
  outline: 1px solid rgba(var(--v-border-color), 0.2);
  outline-offset: 0;
}

.project-card.active {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}
</style>
