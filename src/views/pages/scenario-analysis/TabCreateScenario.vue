<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'

const emit = defineEmits(['changeTab'])

/* -------------------------------
 🔹 Scenario Section
-------------------------------- */
const baselineChecked = ref(true)

const otherScenarios = [
  { label: 'SSP126', value: 'SSP126' },
  { label: 'SSP370', value: 'SSP370' },
  { label: 'SSP585', value: 'SSP585' },
]

const selectedScenarios = ref<string[]>([])

/* -------------------------------
 🔹 Asset Risk Factor Mapping
-------------------------------- */
const RISK_FACTOR_MAP = {
  coal: ['EW', 'AT', 'RD', 'WT'],
  natural_gas: ['EW', 'AT'],
  solar: ['EW', 'AT', 'RD', 'DA'],
  wind: ['EW', 'AT'],
} as const

const RISK_FACTORS = [
  { code: 'EW', name: 'Extreme Weather' },
  { code: 'AT', name: 'Air Temperature' },
  { code: 'RD', name: 'River Discharge' },
  { code: 'DA', name: 'Dust Accumulation' },
  { code: 'WT', name: 'Water Temperature' },
] as const

type AssetType = keyof typeof RISK_FACTOR_MAP
type RiskFactorCode = (typeof RISK_FACTORS)[number]['code']

/* -------------------------------
 🔹 Projects
-------------------------------- */
const projects = ref([
  { id: 1, name: 'Coal Power Plant Alpha', type: 'coal', location: '53.339688, -6.236688' },
  { id: 2, name: 'Gas Combined Cycle', type: 'natural_gas', location: '37.7749, -122.4194' },
  { id: 3, name: 'Solar Field Delta', type: 'solar', location: '35.6895, 139.6917' },
  { id: 4, name: 'Wind Farm Omega', type: 'wind', location: '51.5074, -0.1278' },
])

/* -------------------------------
 🔹 Selection State
-------------------------------- */
const selectedProjects = ref<number[]>([])
const selectedRiskFactors = ref<Record<number, RiskFactorCode[]>>({})
const showSummary = ref(true)

/* -------------------------------
 🔹 Methods
-------------------------------- */
const isProjectSelected = (id: number) => selectedProjects.value.includes(id)

const getRiskFactors = (type: AssetType) =>
  RISK_FACTORS.filter(f => RISK_FACTOR_MAP[type]?.includes(f.code))

const toggleProjectSelection = (id: number) => {
  if (isProjectSelected(id)) {
    selectedProjects.value = selectedProjects.value.filter(pid => pid !== id)
    delete selectedRiskFactors.value[id]
  }
  else {
    selectedProjects.value.push(id)
    selectedRiskFactors.value[id] = []
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
      selectedRiskFactors.value[p.id] = selectedRiskFactors.value[p.id] || []
    })
  }
}

const toggleSelectAllRiskFactors = () => {
  const allSelected = projects.value.every(
    p =>
      !isProjectSelected(p.id)
      || selectedRiskFactors.value[p.id]?.length === getRiskFactors(p.type as AssetType).length,
  )

  projects.value.forEach(p => {
    if (isProjectSelected(p.id)) {
      selectedRiskFactors.value[p.id] = allSelected
        ? []
        : getRiskFactors(p.type as AssetType).map(r => r.code)
    }
  })
}

const selectedSummary = computed(() =>
  projects.value
    .filter(p => selectedProjects.value.includes(p.id))
    .map(p => ({
      ...p,
      risks:
        selectedRiskFactors.value[p.id]?.map(
          code => RISK_FACTORS.find(f => f.code === code)?.name || code,
        ) || [],
    })),
)

const { mdAndUp } = useDisplay()

/* -------------------------------
 🔹 View Results Event
-------------------------------- */
const onViewResults = () => {
  emit('changeTab', 'Result')
}
</script>

<template>
  <!-- Scenario -->
  <div class="scenario-section mb-6">
    <div
      v-if="mdAndUp"
      class="d-flex justify-end mb-3"
    >
      <VBtn
        color="primary"
        variant="flat"
        @click="onViewResults"
      >
        View Results
      </VBtn>
    </div>

    <div class="d-flex align-center text-body-1 mb-3">
      <div class="vertical-bar me-2" />
      Scenario
    </div>

    <div class="d-flex align-center flex-wrap gap-3 scenario-checkboxes">
      <VCheckbox
        v-model="baselineChecked"
        label="Baseline"
        hide-details
        density="compact"
      />
      <VCheckbox
        v-for="scenario in otherScenarios"
        :key="scenario.value"
        v-model="selectedScenarios"
        :label="scenario.label"
        :value="scenario.value"
        hide-details
        density="compact"
      />
    </div>
  </div>

  <VDivider
    class="my-4"
    style="border-style: dashed;"
  />

  <!-- Your Projects -->
  <div class="mb-3">
    <div class="d-flex align-center text-body-1 mb-2">
      <div class="vertical-bar me-2" />
      Your Projects
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
        {{ selectedProjects.length === projects.length ? 'Deselect All Projects' : 'Select All Projects' }}
      </VBtn>

      <VBtn
        size="small"
        variant="outlined"
        color="secondary"
        class="w-100 w-md-auto"
        @click="toggleSelectAllRiskFactors"
      >
        Toggle All Risk Factors
      </VBtn>

      <VBtn
        size="small"
        variant="tonal"
        color="info"
        class="w-100 w-md-auto"
        @click="showSummary = !showSummary"
      >
        {{ showSummary ? 'Hide Summary' : 'Show Summary' }}
      </VBtn>
    </div>
  </div>

  <!--  Selection Summary (Scenario Chips + Summary Card) -->
  <div
    v-if="showSummary && selectedSummary.length"
    class="mt-4"
  >
    <div class="text-body-1 mb-2">
      <div class="vertical-bar me-2" />
      Selection Summary
    </div>

    <!-- Scenario Chips -->
    <div class="d-flex flex-wrap gap-2 mb-3">
      <VChip
        v-if="baselineChecked"
        size="small"
        color="primary"
        variant="tonal"
      >
        Baseline
      </VChip>

      <VChip
        v-for="sc in selectedScenarios"
        :key="sc"
        size="small"
        color="secondary"
        variant="tonal"
      >
        {{ sc }}
      </VChip>
    </div>

    <!-- Summary Card -->
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
            {{ item.name }} <span class="asset-type">({{ item.type }})</span>
          </div>

          <div class="summary-risks">
            <span class="label">Risks:</span>

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

  <!-- Desktop Table -->
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
          <th style="inline-size: 60px;" />
          <th class="text-left">
            Project Name
          </th>
          <th class="text-center" />
          <th class="text-left">
            Asset Type
          </th>
          <th class="text-left">
            Risk Factors
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
            {{ project.type }}
          </td>
          <td>
            <div class="d-flex flex-wrap gap-4">
              <div
                v-for="risk in getRiskFactors(project.type as AssetType)"
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
                <span
                  class="text-body-2"
                  :class="{ 'text-disabled': !isProjectSelected(project.id) }"
                >
                  {{ risk.name }}
                </span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
  </div>

  <!-- Mobile Cards -->
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
            :model-value="isProjectSelected(project.id)"
            hide-details
            density="compact"
            @update:model-value="toggleProjectSelection(project.id)"
          />
        </div>

        <div class="text-body-2 text-medium-emphasis mb-2">
          {{ project.type }} — {{ project.location }}
        </div>

        <div class="d-flex flex-wrap gap-3">
          <div
            v-for="risk in getRiskFactors(project.type as AssetType)"
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
            <span
              class="text-body-2"
              :class="{ 'text-disabled': !isProjectSelected(project.id) }"
            >
              {{ risk.name }}
            </span>
          </div>
        </div>
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

<style scoped lang="scss">
/* ⭐ Summary Card 예쁜 버전 */
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

/* ---------- Existing ---------- */

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
  padding-block: 10px 16px;
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

.baseline-checkbox .v-label {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

.project-table th,
.project-table td {
  block-size: 50px !important;
  vertical-align: middle;
}

.project-table th {
  text-align: center !important;
}

/* ❗ 여기에서 vertical-bar 스타일 완전히 제거됨 */
</style>
