<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['changeTab'])

/* -----------------------------------
  프로젝트 정의
----------------------------------- */
interface Project {
  id: number
  name: string
  asset: AssetType
  checked: boolean
}

type AssetType = 'Coal' | 'Natural Gas' | 'Wind' | 'Solar'
type ParameterType = 'interest' | 'tax' | 'electricity' | 'fuel'

const projects = ref<Project[]>([
  { id: 1, name: 'Coal Alpha', asset: 'Coal', checked: false },
  { id: 2, name: 'Solar Bravo', asset: 'Solar', checked: false },
  { id: 3, name: 'Wind Charlie', asset: 'Wind', checked: false },
  { id: 4, name: 'Gas Delta', asset: 'Natural Gas', checked: false },
  { id: 5, name: 'Solar Echo', asset: 'Solar', checked: false },
  { id: 6, name: 'Coal Foxtrot', asset: 'Coal', checked: false },
])

/* 체크 핸들러 */
const onCheckChanged = (p: Project, val: boolean | null) => {
  p.checked = val === true
}

/* Fuel Price 활성화 여부 */
const fuelEnabled = computed(() =>
  projects.value.some(
    p => p.checked && (p.asset === 'Coal' || p.asset === 'Natural Gas'),
  ),
)

/* Parameter 라디오 선택 */
const selectedParameter = ref<ParameterType | null>(null)

/* -----------------------------------
  AssetType별 Parameter → Mean/Std
----------------------------------- */

interface MeanStdItem {
  key: string
  label: string
  mean: { default: number; min: number; max: number }
  std: { default: number; min: number; max: number }
}

const PARAMETER_INPUT_SCHEMA: Record<
  AssetType,
  Record<ParameterType, MeanStdItem[] | null>
> = {
  'Coal': {
    interest: [
      {
        key: 'interest',
        label: 'Interest Rate',
        mean: { default: 7, min: 0, max: 20 },
        std: { default: 5, min: 0, max: 10 },
      },
    ],
    electricity: [
      {
        key: 'electricity',
        label: 'Electricity Price',
        mean: { default: 50, min: 0, max: 200 },
        std: { default: 10, min: 0, max: 50 },
      },
    ],
    tax: [
      {
        key: 'federal',
        label: 'Federal Corporate Tax',
        mean: { default: 21, min: 0, max: 40 },
        std: { default: 5, min: 0, max: 10 },
      },
      {
        key: 'state',
        label: 'State Corporate Tax',
        mean: { default: 7, min: 0, max: 20 },
        std: { default: 3, min: 0, max: 8 },
      },
    ],
    fuel: [
      {
        key: 'fuel',
        label: 'Fuel Price',
        mean: { default: 115, min: 0, max: 300 },
        std: { default: 70, min: 0, max: 150 },
      },
    ],
  },

  'Natural Gas': {
    interest: [
      {
        key: 'interest',
        label: 'Interest Rate',
        mean: { default: 7, min: 0, max: 20 },
        std: { default: 5, min: 0, max: 10 },
      },
    ],
    electricity: [
      {
        key: 'electricity',
        label: 'Electricity Price',
        mean: { default: 90, min: 0, max: 200 },
        std: { default: 10, min: 0, max: 50 },
      },
    ],
    tax: [
      {
        key: 'federal',
        label: 'Federal Corporate Tax',
        mean: { default: 21, min: 0, max: 40 },
        std: { default: 5, min: 0, max: 10 },
      },
      {
        key: 'state',
        label: 'State Corporate Tax',
        mean: { default: 9, min: 0, max: 20 },
        std: { default: 4, min: 0, max: 10 },
      },
    ],
    fuel: [
      {
        key: 'fuel',
        label: 'Fuel Price',
        mean: { default: 110, min: 0, max: 300 },
        std: { default: 60, min: 0, max: 150 },
      },
    ],
  },

  'Wind': {
    interest: [
      {
        key: 'interest',
        label: 'Interest Rate',
        mean: { default: 5, min: 0, max: 15 },
        std: { default: 1, min: 0, max: 5 },
      },
    ],
    electricity: [
      {
        key: 'electricity',
        label: 'Electricity Price',
        mean: { default: 70, min: 0, max: 200 },
        std: { default: 10, min: 0, max: 50 },
      },
    ],
    tax: [
      {
        key: 'federal',
        label: 'Federal Corporate Tax',
        mean: { default: 21, min: 0, max: 40 },
        std: { default: 5, min: 0, max: 10 },
      },
      {
        key: 'state',
        label: 'State Corporate Tax',
        mean: { default: 7, min: 0, max: 20 },
        std: { default: 3, min: 0, max: 8 },
      },
      {
        key: 'property',
        label: 'Property Tax',
        mean: { default: 25, min: 0, max: 60 },
        std: { default: 5, min: 0, max: 15 },
      },
      {
        key: 'sales',
        label: 'Sales Tax',
        mean: { default: 20, min: 0, max: 50 },
        std: { default: 5, min: 0, max: 10 },
      },
    ],
    fuel: null,
  },

  'Solar': {
    interest: [
      {
        key: 'interest',
        label: 'Interest Rate',
        mean: { default: 5, min: 0, max: 15 },
        std: { default: 1, min: 0, max: 5 },
      },
    ],
    electricity: [
      {
        key: 'electricity',
        label: 'Electricity Price',
        mean: { default: 60, min: 0, max: 200 },
        std: { default: 10, min: 0, max: 50 },
      },
    ],
    tax: [
      {
        key: 'federal',
        label: 'Federal Corporate Tax',
        mean: { default: 21, min: 0, max: 40 },
        std: { default: 5, min: 0, max: 10 },
      },
      {
        key: 'state',
        label: 'State Corporate Tax',
        mean: { default: 7, min: 0, max: 20 },
        std: { default: 3, min: 0, max: 8 },
      },
      {
        key: 'property',
        label: 'Property Tax',
        mean: { default: 25, min: 0, max: 60 },
        std: { default: 5, min: 0, max: 15 },
      },
      {
        key: 'sales',
        label: 'Sales Tax',
        mean: { default: 20, min: 0, max: 50 },
        std: { default: 5, min: 0, max: 10 },
      },
    ],
    fuel: null,
  },
}

/* -----------------------------------
  Parameter merge
----------------------------------- */
const mergedParameterItems = computed(() => {
  if (!selectedParameter.value)
    return []

  const selectedAssets = projects.value
    .filter(p => p.checked)
    .map(p => p.asset as AssetType)

  const items: MeanStdItem[] = []

  for (const asset of selectedAssets) {
    const data = PARAMETER_INPUT_SCHEMA[asset][selectedParameter.value]
    if (data)
      items.push(...data)
  }

  // 중복 제거
  const map = new Map()
  for (const item of items) map.set(item.key, item)

  return Array.from(map.values())
})

/* Fuel disable 처리: 강제 재렌더링 제거됨 */
watch(fuelEnabled, enabled => {
  if (!enabled && selectedParameter.value === 'fuel')
    selectedParameter.value = null
})

/* NEW: Number of runs */
const runCount = ref<number>(10)
</script>

<template>
  <!-- title -->
  <div class="d-flex align-center text-body-1 mb-4">
    <div class="vertical-bar me-2" />
    Select Your Project.
  </div>

  <!-- 프로젝트 선택 -->
  <VRow dense>
    <VCol
      v-for="p in projects"
      :key="p.id"
      cols="12"
      sm="4"
      md="2"
    >
      <VCard
        class="pa-4 card-box"
        variant="outlined"
        :class="p.checked ? 'card-selected' : 'card-default'"
      >
        <div class="d-flex justify-space-between mb-1">
          <div class="d-flex align-center gap-2">
            <VCheckbox
              :model-value="p.checked"
              hide-details
              density="compact"
              @update:model-value="val => onCheckChanged(p, val)"
            />
            <div class="font-weight-medium text-h6">
              {{ p.name }}
            </div>
          </div>
        </div>

        <div class="text-caption text-secondary">
          {{ p.asset }}
        </div>
      </VCard>
    </VCol>
  </VRow>

  <!-- PARAMETERS -->
  <div class="d-flex align-center text-body-1 mt-8 mb-2">
    <div class="vertical-bar me-2" />
    Parameters
  </div>

  <VRadioGroup
    v-model="selectedParameter"
    inline
    class="param-group"
    hide-details
  >
    <VRadio
      label="Interest Rate"
      value="interest"
    />
    <VRadio
      label="Tax Rate"
      value="tax"
    />
    <VRadio
      label="Electricity Price"
      value="electricity"
    />
    <VRadio
      label="Fuel Price"
      value="fuel"
      :disabled="!fuelEnabled"
    />
  </VRadioGroup>

  <!-- Mean / Std 자동 생성 -->
  <div
    v-if="selectedParameter"
    class="mt-4 pb-6"
  >
    <div
      v-for="item in mergedParameterItems"
      :key="item.key"
      class="mb-4"
    >
      <div class="text-body-1 font-weight-medium mb-2">
        {{ item.label }}
      </div>

      <VRow dense>
        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            label="Mean"
            :model-value="item.mean.default"
            :min="item.mean.min"
            :max="item.mean.max"
            type="number"
            density="comfortable"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VTextField
            label="Std"
            :model-value="item.std.default"
            :min="item.std.min"
            :max="item.std.max"
            type="number"
            density="comfortable"
          />
        </VCol>
      </VRow>
    </div>
  </div>

  <!-- NUMBER OF RUNS -->
  <div class="d-flex align-center text-body-1 mt-2 pb-4">
    <div class="vertical-bar me-2" />
    Number of runs
  </div>

  <VRow dense>
    <VCol
      cols="12"
      sm="4"
      md="3"
    >
      <VTextField
        v-model="runCount"
        label="Count"
        type="number"
        min="1"
        density="comfortable"
      />
    </VCol>
  </VRow>

  <!-- VIEW RESULT -->
  <div class="d-flex justify-end ">
    <VBtn
      color="primary"
      class="text-end py-0"
      @click="emit('changeTab', 'Result')"
    >
      View Result
    </VBtn>
  </div>
</template>

<style scoped>
.param-group {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.card-box {
  display: flex;
  flex-direction: column;
}

.card-default.v-card {
  border-color: #d9d9d9 !important;
}

.card-selected.v-card {
  border-width: 1px !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: none !important;
}
</style>
