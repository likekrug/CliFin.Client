<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'

import { useScenarioStore } from '@/stores/scenario.store'
import { useRiskFactorStore } from '@/stores/riskFactor.store'
import { useProjectStore } from '@/stores/project.store'

import type { RiskFactor } from '@/types/scenarioRiskFactor.types'
import type { Project } from '@/types/project.types'

const emit = defineEmits<{
  (e: 'changeTab', tab: string): void
}>()

/* -------------------------------
 🔹 Store
-------------------------------- */
const scenarioStore = useScenarioStore()
const riskFactorStore = useRiskFactorStore()
const projectStore = useProjectStore()

const { sortedList } = storeToRefs(scenarioStore)

/* -------------------------------
 🔹 Scenario
-------------------------------- */
const baselineChecked = ref(true)
const selectedScenarios = ref<string[]>([])

const scenarios = sortedList

/* -------------------------------
 🔹 Projects
-------------------------------- */
const projects = computed<Project[]>(() => projectStore.sortedProjects)

/* -------------------------------
 🔹 Selection State (🔥 FIXED)
-------------------------------- */
const selectedProjects = ref<string[]>([])
const selectedRiskFactors = ref<Record<string, string[]>>({})
const showSummary = ref(true)

/* -------------------------------
 🔹 Lifecycle
-------------------------------- */
onMounted(async () => {
  projectStore.init()
  await scenarioStore.load()
  await riskFactorStore.load()
})

/* -------------------------------
 🔹 Computed
-------------------------------- */
const baselineScenario = computed(() =>
  scenarios.value.find(s => s.id === 'BASELINE'),
)

const otherScenarios = computed(() =>
  scenarios.value.filter(s => s.id !== 'BASELINE'),
)

const { mdAndUp } = useDisplay()

/* -------------------------------
 🔹 Methods
-------------------------------- */
const isProjectSelected = (id: string) =>
  selectedProjects.value.includes(id)

const getRiskFactors = (assetType: string): RiskFactor[] =>
  riskFactorStore.getRiskFactorsByAsset(assetType)

const toggleProjectSelection = (projectId: string) => {
  if (isProjectSelected(projectId)) {
    selectedProjects.value = selectedProjects.value.filter(id => id !== projectId)
    delete selectedRiskFactors.value[projectId]
  }
  else {
    selectedProjects.value.push(projectId)
    selectedRiskFactors.value[projectId] = []
  }
}

const toggleSelectAllProjects = () => {
  if (selectedProjects.value.length === projects.value.length) {
    selectedProjects.value = []
    selectedRiskFactors.value = {}
  }
  else {
    selectedProjects.value = projects.value.map(p => p.id)
    projects.value.forEach(p => {
      selectedRiskFactors.value[p.id] ||= []
    })
  }
}

const toggleSelectAllRiskFactors = () => {
  const allSelected = projects.value.every(
    p =>
      !isProjectSelected(p.id)
      || selectedRiskFactors.value[p.id]?.length
        === getRiskFactors(p.assetType).length,
  )

  projects.value.forEach(p => {
    if (!isProjectSelected(p.id))
      return

    selectedRiskFactors.value[p.id] = allSelected
      ? []
      : getRiskFactors(p.assetType).map(r => r.code)
  })
}

/* -------------------------------
 🔹 Summary
-------------------------------- */
const selectedSummary = computed(() =>
  projects.value
    .filter(p => selectedProjects.value.includes(p.id))
    .map(p => ({
      id: p.id,
      name: p.name,
      type: p.assetType,
      risks:
        selectedRiskFactors.value[p.id]?.map(code =>
          riskFactorStore.riskFactors.find(r => r.code === code)?.name || code,
        ) || [],
    })),
)

/* -------------------------------
 🔹 View Results
-------------------------------- */
const onViewResults = () => {
  emit('changeTab', 'Result')
}
</script>

<template>
  <!-- Scenario -->
  <div class="scenario-section mb-6">
    <div class="d-flex align-center text-body-1 mb-3">
      <div class="vertical-bar me-2" />
      Scenario
    </div>

    <div class="d-flex align-center flex-wrap gap-3 scenario-checkboxes">
      <VCheckbox
        v-if="baselineScenario"
        v-model="baselineChecked"
        :label="baselineScenario.name"
        density="compact"
      />

      <VCheckbox
        v-for="scenario in otherScenarios"
        :key="scenario.id"
        v-model="selectedScenarios"
        :label="scenario.name"
        :value="scenario.id"
        hide-details
        density="compact"
      />
    </div>
  </div>

  <VDivider
    class="my-4"
    style="border-style: dashed;"
  />

  <!-- Project List -->
  <div class="mb-3">
    <div class="d-flex align-center text-body-1 mb-2">
      <div class="vertical-bar me-2" />
      Project List
    </div>

    <div
      class="d-flex flex-wrap gap-2"
      :class="mdAndUp ? 'justify-end' : 'flex-column w-100'"
    >
      <VBtn
        size="small"
        variant="outlined"
        color="primary"
        @click="toggleSelectAllProjects"
      >
        {{ selectedProjects.length === projects.length ? 'Deselect All Projects' : 'Select All Projects' }}
      </VBtn>

      <VBtn
        size="small"
        variant="outlined"
        color="secondary"
        @click="toggleSelectAllRiskFactors"
      >
        Toggle All Risk Factors
      </VBtn>

      <VBtn
        size="small"
        variant="tonal"
        color="info"
        @click="showSummary = !showSummary"
      >
        {{ showSummary ? 'Hide Summary' : 'Show Summary' }}
      </VBtn>
    </div>
  </div>

  <!-- Summary -->
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

          <div class="summary-risks">
            <span class="label">Risk Factor</span>

            <template v-if="item.risks.length">
              <VChip
                v-for="r in item.risks"
                :key="r"
                size="small"
                variant="tonal"
                color="primary"
                class="me-2 mb-1"
              >
                {{ r }}
              </VChip>
            </template>

            <span
              v-else
              class="text-disabled"
            >(None)</span>
          </div>
        </div>
      </div>
    </VCard>
  </div>

  <!-- Desktop -->
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
          <th />
          <th>Project Name</th>
          <th />
          <th>Asset Type</th>
          <th>Risk Factors</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
        >
          <td>
            <VCheckbox
              :model-value="isProjectSelected(project.id)"
              hide-details
              density="compact"
              @update:model-value="toggleProjectSelection(project.id)"
            />
          </td>

          <td>{{ project.name }}</td>

          <td>
            <IconBtn size="small">
              <VIcon icon="ri-edit-box-line" />
            </IconBtn>
          </td>

          <td class="text-capitalize">
            {{ project.assetType }}
          </td>

          <td>
            <div class="d-flex flex-wrap gap-4">
              <div
                v-for="risk in getRiskFactors(project.assetType)"
                :key="risk.code"
                class="d-flex align-center"
              >
                <VCheckbox
                  v-model="selectedRiskFactors[project.id]"
                  :value="risk.code"
                  :disabled="!isProjectSelected(project.id)"
                  hide-details
                  density="compact"
                />
                <span :class="{ 'text-disabled': !isProjectSelected(project.id) }">
                  {{ risk.name }}
                </span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
    <div class="d-flex justify-end mt-4">
      <VBtn
        color="primary"
        class="text-end py-0"
        @click="onViewResults"
      >
        View Results
      </VBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Summary */
.summary-card {
  padding: 20px;
  border: 1px solid rgba(var(--v-border-color), 0.15);
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.summary-item {
  border-block-end: 1px dashed rgba(var(--v-border-color), 0.2);
  padding-block-end: 12px;

  &:last-child {
    border-block-end: none;
  }
}

.summary-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-block-end: 4px;
}

.asset-type {
  color: rgb(var(--v-theme-secondary));
}

.summary-risks .label {
  font-weight: 500;
  margin-inline-end: 6px;
}

/* Mobile fixed */
.mobile-fixed-btn {
  position: fixed;
  z-index: 999;
  display: flex;
  justify-content: center;
  background: white;
  border-start-end-radius: 16px;
  border-start-start-radius: 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 8%);
  inset-block-end: 0;
  inset-inline: 0;
  padding-block: 10px;
  padding-inline: 16px;
}

.mobile-fixed-btn .v-btn {
  inline-size: 100%;
  max-inline-size: 420px;
}

@media (max-width: 600px) {
  .pb-14 {
    padding-block-end: 100px;
  }
}

/* Table */
.project-table th,
.project-table td {
  block-size: 50px !important;
  vertical-align: middle;
}

.project-table th {
  text-align: center !important;
}
</style>
