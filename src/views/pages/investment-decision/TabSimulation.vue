<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import FinancialConditionsCard from './simulation/FinancialConditionsCard.vue'

const emit = defineEmits(['changeTab'])

/* --------------------------------
  Projects with ACTIVE flags added
----------------------------------- */
const projects = ref([
  {
    id: 1,
    name: 'Coal Power Plant Alpha',
    type: 'coal',
    location: '53.339688, -6.236688',
    selected: false,
    financial: {
      before: { de: 45, tenor: 10, dsra: 6 },
      modify: { de: 45, tenor: 10, dsra: 6 },
      active: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 2,
    name: 'Gas Combined Cycle',
    type: 'natural_gas',
    location: '37.7749, -122.4194',
    selected: false,
    financial: {
      before: { de: 60, tenor: 12, dsra: 3 },
      modify: { de: 60, tenor: 12, dsra: 3 },
      active: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 3,
    name: 'Solar Field Delta',
    type: 'solar',
    location: '35.6895, 139.6917',
    selected: false,
    financial: {
      before: { de: 70, tenor: 14, dsra: 2 },
      modify: { de: 70, tenor: 14, dsra: 2 },
      active: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 4,
    name: 'Wind Farm Omega',
    type: 'wind',
    location: '51.5074, -0.1278',
    selected: false,
    financial: {
      before: { de: 50, tenor: 11, dsra: 4 },
      modify: { de: 50, tenor: 11, dsra: 4 },
      active: { de: false, tenor: false, dsra: false },
    },
  },
])

/* -------------------------------
  Toggle Project Selection
-------------------------------- */
const toggleProjectSelection = project => {
  project.selected = !project.selected

  // 프로젝트 선택 해제 시 모든 financial active 리셋
  if (!project.selected) {
    project.financial.active = {
      de: false,
      tenor: false,
      dsra: false,
    }
  }
}

/* Toggle All */
const toggleSelectAllProjects = () => {
  const allSelected = projects.value.every(p => p.selected)

  projects.value.forEach(p => {
    p.selected = !allSelected

    // 선택 풀리면 active 해제
    if (!p.selected)
      p.financial.active = { de: false, tenor: false, dsra: false }
  })
}

// const selectedSummary = computed(() =>
//   projects.value.filter(p => p.selected),
// )

const { mdAndUp } = useDisplay()

const onViewResults = () => emit('changeTab', 'Result')
</script>

<template>
  <!-- HEADER -->
  <div class="mb-3">
    <div class="d-flex align-center text-body-1 mb-2">
      <div class="vertical-bar me-2" />
      Select Your Project and Set financial conditions.
    </div>

    <div
      class="d-flex flex-wrap gap-2"
      :class="mdAndUp ? 'justify-end' : 'flex-column align-center w-100'"
    >
      <VBtn
        size="small"
        variant="outlined"
        color="primary"
        class="w-100 w-md-auto"
        @click="toggleSelectAllProjects"
      >
        {{
          projects.every(p => p.selected)
            ? 'Deselect All Projects'
            : 'Select All Projects'
        }}
      </VBtn>
      <!--
        <VBtn
        size="small"
        variant="tonal"
        color="info"
        class="w-100 w-md-auto"
        @click="showSummary = !showSummary"
        >
        {{ showSummary ? 'Hide Summary' : 'Show Summary' }}
        </VBtn>
      -->
    </div>
  </div>

  <!-- SUMMARY -->
  <!--
    <div
    v-if="showSummary && selectedSummary.length"
    class="mt-4"
    >
    <div class="text-body-1 mb-2">
    <div class="vertical-bar me-2" />
    Selection Summary
    </div>

    <VCard
    elevation="0"
    class="summary-card"
    >
    <div class="d-flex flex-column gap-4">
    <div
    v-for="item in selectedSummary"
    :key="item.id"
    class="summary-item"
    >
    <div class="summary-title">
    {{ item.name }}
    <span class="asset-type">({{ item.type }})</span>
    </div>
    </div>
    </div>
    </VCard>
    </div>
  -->

  <!-- DESKTOP TABLE -->
  <div
    v-if="mdAndUp"
    class="mt-6"
  >
    <VTable
      density="comfortable"
      class="border rounded project-table"
    >
      <thead>
        <tr>
          <th style="inline-size: 50px;" />
          <th
            style="inline-size: 160px;"
            class="text-left"
          >
            Project Name
          </th>
          <th
            style="inline-size: 30px;"
            class="text-center"
          />
          <th
            style="inline-size: 50px;"
            class="text-left"
          >
            Asset Type
          </th>
          <th class="text-left">
            Financial Conditions
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
        >
          <td class="text-center">
            <VCheckbox
              :model-value="project.selected"
              hide-details
              density="compact"
              @update:model-value="toggleProjectSelection(project)"
            />
          </td>

          <td>{{ project.name }}</td>

          <td class="text-center">
            <IconBtn size="small">
              <VIcon icon="ri-edit-box-line" />
            </IconBtn>
          </td>

          <td class="text-capitalize">
            {{ project.type }}
          </td>

          <td>
            <FinancialConditionsCard
              v-model="project.financial.modify"
              v-model:active="project.financial.active"
              :before="project.financial.before"
              :selected="project.selected"
            />
          </td>
        </tr>
      </tbody>
    </VTable>
  </div>

  <!-- MOBILE -->
  <div
    v-else
    class="pb-14"
  >
    <div class="d-flex flex-column gap-4">
      <VCard
        v-for="project in projects"
        :key="project.id"
        variant="outlined"
        class="pa-3"
      >
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="text-subtitle-1 font-weight-medium">
            {{ project.name }}
          </div>

          <VCheckbox
            :model-value="project.selected"
            hide-details
            density="compact"
            @update:model-value="toggleProjectSelection(project)"
          />
        </div>

        <div class="text-body-2 text-medium-emphasis mb-2">
          {{ project.type }} — {{ project.location }}
        </div>

        <FinancialConditionsCard
          v-model="project.financial.modify"
          v-model:active="project.financial.active"
          :before="project.financial.before"
          :selected="project.selected"
        />
      </VCard>
    </div>

    <div class="mobile-fixed-btn">
      <VBtn
        block
        color="primary"
        variant="flat"
        size="large"
        @click="onViewResults"
      >
        View Results
      </VBtn>
    </div>
  </div>
</template>

<style scoped>
/* same styles you provided */
</style>
