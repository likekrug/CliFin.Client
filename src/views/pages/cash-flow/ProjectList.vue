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
      <div class="text-h6 font-weight-semibold">
        {{ project.name }}
      </div>
      <div class="text-body-2 text-medium-emphasis">
        {{ project.type }}
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 8%);
  transform: translateY(-2px);
}

.project-card.active {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}
</style>
