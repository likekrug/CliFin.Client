<script setup lang="ts">
import { ref } from 'vue'
import FinanceModal from './simulation/FinanceModal.vue'

const emit = defineEmits(['changeTab'])

interface FinanceValue {
  before: {
    de: number
    tenor: number
    dsra: boolean
    threshold: number | null
  }
  after: {
    de: number
    tenor: number
    dsra: boolean
    threshold: number | null
  }
  visible: {
    de: boolean
    tenor: boolean
    dsra: boolean
  }
}

interface Project {
  id: number
  name: string
  asset: string
  checked: boolean
  finance: FinanceValue
}

/* --------------------------
   프로젝트 데이터 (테스트용)
--------------------------- */
const projects = ref<Project[]>([
  {
    id: 1,
    name: 'Coal Alpha',
    asset: 'Coal',
    checked: false,
    finance: {
      before: { de: 45, tenor: 10, dsra: true, threshold: 1.5 },
      after: { de: 45, tenor: 10, dsra: true, threshold: 1.5 },
      visible: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 2,
    name: 'Solar Bravo',
    asset: 'Solar',
    checked: false,
    finance: {
      before: { de: 50, tenor: 12, dsra: false, threshold: null },
      after: { de: 50, tenor: 12, dsra: false, threshold: null },
      visible: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 3,
    name: 'Wind Charlie',
    asset: 'Wind',
    checked: false,
    finance: {
      before: { de: 55, tenor: 15, dsra: true, threshold: 2.0 },
      after: { de: 55, tenor: 15, dsra: true, threshold: 2.0 },
      visible: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 4,
    name: 'Gas Delta',
    asset: 'Gas',
    checked: false,
    finance: {
      before: { de: 48, tenor: 9, dsra: false, threshold: null },
      after: { de: 48, tenor: 9, dsra: false, threshold: null },
      visible: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 5,
    name: 'Solar Echo',
    asset: 'Solar',
    checked: false,
    finance: {
      before: { de: 52, tenor: 11, dsra: true, threshold: 1.2 },
      after: { de: 52, tenor: 11, dsra: true, threshold: 1.2 },
      visible: { de: false, tenor: false, dsra: false },
    },
  },
  {
    id: 6,
    name: 'Coal Foxtrot',
    asset: 'Coal',
    checked: false,
    finance: {
      before: { de: 60, tenor: 20, dsra: false, threshold: null },
      after: { de: 60, tenor: 20, dsra: false, threshold: null },
      visible: { de: false, tenor: false, dsra: false },
    },
  },
])

/* --------------------------
   모달 제어
--------------------------- */
const modalOpen = ref(false)
const targetProject = ref<Project | null>(null)

const openFinanceModal = (p: Project) => {
  targetProject.value = p
  modalOpen.value = true
}

/* --------------------------
   Save Handler
--------------------------- */
const handleSave = ({ after, visible }: any) => {
  if (!targetProject.value)
    return

  targetProject.value.finance.after = { ...after }
  targetProject.value.finance.visible = { ...visible }
}

/* --------------------------
   체크박스 핸들러
--------------------------- */
const onCheckChanged = (p: Project, val: boolean | null) => {
  p.checked = val === true

  if (!p.checked) {
    p.finance.after = { ...p.finance.before }
    p.finance.visible = { de: false, tenor: false, dsra: false }
  }
}
</script>

<template>
  <VRow
    dense
    align="start"
  >
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
      >
        <!-- Header -->
        <div class="d-flex justify-space-between mb-2">
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

          <VBtn
            icon="ri-edit-box-line"
            variant="text"
            size="small"
            color="primary"
            :disabled="!p.checked"
            @click="openFinanceModal(p)"
          />
        </div>

        <div class="text-caption text-secondary mb-3">
          {{ p.asset }}
        </div>

        <!-- Financial Box -->
        <div
          class="financial-box"
          :class="{
            visible:
              p.finance.visible.de
              || p.finance.visible.tenor
              || p.finance.visible.dsra,

            hidden:
              !(
                p.finance.visible.de
                || p.finance.visible.tenor
                || p.finance.visible.dsra
              ),
          }"
        >
          <div v-if="p.finance.visible.de">
            <strong>Debt to Equity:</strong> {{ p.finance.after.de }}%
          </div>

          <div v-if="p.finance.visible.tenor">
            <strong>Tenor:</strong> {{ p.finance.after.tenor }} Years
          </div>

          <div v-if="p.finance.visible.dsra">
            <strong>DSRA:</strong>
            <span v-if="p.finance.after.dsra">
              Y:Threshold: {{ p.finance.after.threshold }}
            </span>
            <span v-else>N</span>
          </div>
        </div>

        <VBtn
          block
          size="small"
          variant="tonal"
          color="primary"
          :disabled="!p.checked"
          @click="openFinanceModal(p)"
        >
          Modify Financial Conditions
        </VBtn>
      </VCard>
    </VCol>
  </VRow>

  <FinanceModal
    v-model="modalOpen"
    :project="targetProject"
    @save="handleSave"
  />
</template>

<style scoped>
.card-box {
  display: flex;
  flex-direction: column;
}

.financial-box.visible {
  padding: 12px;
  border-radius: 8px;
  background-color: rgb(var(--v-theme-secondary), 0.18);
  margin-block-end: 16px;
  min-block-size: 95px;
}

.financial-box.hidden {
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
  block-size: 0 !important;
}
</style>
