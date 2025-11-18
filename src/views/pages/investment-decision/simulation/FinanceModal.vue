<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  modelValue: boolean
  project: any | null
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const { smAndDown } = useDisplay()

/* -------------------------------
  Dialog Visible (v-model)
-------------------------------- */
const localVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

/* -------------------------------
  로컬 상태
-------------------------------- */
const local = ref({
  de: false,
  tenor: false,
  dsra: false,

  after_de: 0,
  after_tenor: 0,

  after_dsra: false,
  after_threshold: null as number | null,
})

/* -----------------------------------
  모달 열릴 때 부모 데이터 복사
------------------------------------ */
watch(
  () => props.project,
  p => {
    if (!p)
      return

    // 처음엔 모두 비활성
    local.value.de = false
    local.value.tenor = false
    local.value.dsra = false

    // after 값 불러오기
    local.value.after_de = p.finance.after.de
    local.value.after_tenor = p.finance.after.tenor
    local.value.after_dsra = p.finance.after.dsra
    local.value.after_threshold = p.finance.after.threshold
  },
  { immediate: true },
)

/* -----------------------------------
  저장 처리
------------------------------------ */
const onSave = () => {
  if (!props.project)
    return

  emit('save', {
    after: {
      de: local.value.after_de,
      tenor: local.value.after_tenor,
      dsra: local.value.after_dsra,
      threshold: local.value.after_dsra ? local.value.after_threshold : null,
    },
    visible: {
      de: local.value.de,
      tenor: local.value.tenor,
      dsra: local.value.dsra,
    },
  })

  localVisible.value = false
}
</script>

<template>
  <VDialog
    :model-value="localVisible"
    :fullscreen="smAndDown"
    :scrim="smAndDown ? false : true"
    transition="dialog-bottom-transition"
    @update:model-value="val => (localVisible = val)"
  >
    <VCard
      :min-width="smAndDown ? undefined : 500"
      class="mx-auto"
      :class="smAndDown ? 'rounded-0 pa-4' : 'pa-6'"
    >
      <div class="d-flex justify-space-between align-center mb-1">
        <div class="text-h5 font-weight-semibold">
          Modify financial conditions
        </div>

        <VBtn
          icon="ri-close-line"
          variant="text"
          density="comfortable"
          @click="localVisible = false"
        />
      </div>

      <VDivider class="my-2" />
      <div class="text-h6 mb-6">
        {{ project?.name }}
      </div>

      <!--
        ============================
        Debt to Equity
        =============================
      -->
      <div class="mb-4">
        <div class="d-flex align-center mb-2">
          <VCheckbox
            v-model="local.de"
            hide-details
            density="compact"
          />
          <span class="text-subtitle-1 font-weight-medium">Debt to Equity</span>
        </div>

        <div class="d-flex align-center gap-3 ms-8 mb-2">
          <span class="text-body-2">Before: {{ project.finance.before.de }}%</span>
          <span class="arrow">→</span>

          <VTextField
            v-model.number="local.after_de"
            type="number"
            density="compact"
            hide-details
            style="max-inline-size: 120px;"
            suffix="%"
            :disabled="!local.de"
          />
        </div>
      </div>

      <!--
        ============================
        Tenor
        =============================
      -->
      <div class="mb-4">
        <div class="d-flex align-center mb-2">
          <VCheckbox
            v-model="local.tenor"
            hide-details
            density="compact"
          />
          <span class="text-subtitle-1 font-weight-medium">Tenor</span>
        </div>

        <div class="d-flex align-center gap-3 ms-8 mb-2">
          <span class="text-body-2">Before: {{ project.finance.before.tenor }} Years</span>
          <span class="arrow">→</span>

          <VTextField
            v-model.number="local.after_tenor"
            type="number"
            density="compact"
            hide-details
            style="max-inline-size: 140px;"
            suffix="Years"
            :disabled="!local.tenor"
          />
        </div>
      </div>

      <!--
        ============================
        DSRA
        =============================
      -->
      <div class="mb-4">
        <div class="d-flex align-center mb-2">
          <VCheckbox
            v-model="local.dsra"
            hide-details
            density="compact"
          />
          <span class="text-subtitle-1 font-weight-medium">DSRA</span>
        </div>

        <div class="ms-8">
          <!-- Before -->
          <div class="text-body-2 mb-2">
            Before:
            <strong>{{ project.finance.before.dsra ? 'Yes' : 'No' }}</strong>
            <span v-if="project.finance.before.dsra && project.finance.before.threshold">
              (Threshold: {{ project.finance.before.threshold }})
            </span>
          </div>

          <!-- NO / YES + Threshold in one row -->
          <div class="d-flex align-center gap-4">
            <VRadioGroup
              v-model="local.after_dsra"
              inline
              hide-details
              :disabled="!local.dsra"
              class="mr-4"
            >
              <VRadio
                label="No"
                :value="false"
              />
              <VRadio
                label="Yes"
                :value="true"
              />
            </VRadioGroup>

            <!-- Threshold → YES 오른쪽 줄에 배치 -->
            <div v-if="local.after_dsra">
              <VTextField
                v-model.number="local.after_threshold"
                label="Threshold"
                type="number"
                density="compact"
                hide-details
                placeholder="e.g. 1.5"
                style="max-inline-size: 160px;"
                :disabled="!local.dsra"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="d-flex justify-end gap-4 mt-6">
        <VBtn
          variant="text"
          @click="localVisible = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          @click="onSave"
        >
          Save
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>

<style scoped>
.arrow {
  opacity: 0.7;
}
</style>
