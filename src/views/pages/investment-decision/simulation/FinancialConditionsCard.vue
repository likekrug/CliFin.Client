<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  selected: boolean
  before: { de: number; tenor: number; dsra: number }
  modelValue: { de: number; tenor: number; dsra: number }
  active: { de: boolean; tenor: boolean; dsra: boolean }
}>()

const emit = defineEmits(['update:modelValue', 'update:active'])

const { mdAndUp } = useDisplay()

// v-model modify
const modify = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

// toggle active flags
const toggleActive = (key: 'de' | 'tenor' | 'dsra') => {
  emit('update:active', {
    ...props.active,
    [key]: !props.active[key],
  })
}
</script>

<template>
  <div
    class="fc-wrapper pa-4"
    :class="!props.selected ? 'opacity-50 pointer-events-none' : ''"
  >
    <!-- ▒▒▒▒▒ PC UI ▒▒▒▒▒ -->
    <div
      v-if="mdAndUp"
      class="pc-row d-flex gap-8"
    >
      <!-- Debt to Equity -->
      <div class="flex-1">
        <div class="d-flex align-center mb-2 gap-2">
          <VCheckbox
            :model-value="props.active.de"
            hide-details
            density="compact"
            @update:model-value="toggleActive('de')"
          />
          <span class="text-subtitle-1 font-weight-medium">Debt to Equity</span>
        </div>

        <div class="d-flex align-center gap-2">
          <VTextField
            :model-value="props.before.de"
            disabled
            label="Before"
            density="compact"
            variant="outlined"
            suffix="%"
            class="before-field"
          />

          <VIcon
            color="primary"
            size="20"
          >
            ri-arrow-right-line
          </VIcon>

          <VTextField
            v-model="modify.de"
            :disabled="!props.active.de"
            label="Modify"
            density="compact"
            variant="outlined"
            suffix="%"
          />
        </div>
      </div>

      <!-- Tenor -->
      <div class="flex-1">
        <div class="d-flex align-center mb-2 gap-2">
          <VCheckbox
            :model-value="props.active.tenor"
            hide-details
            density="compact"
            @update:model-value="toggleActive('tenor')"
          />
          <span class="text-subtitle-1 font-weight-medium">Tenor</span>
        </div>

        <div class="d-flex align-center gap-2">
          <VTextField
            :model-value="props.before.tenor"
            disabled
            label="Before"
            density="compact"
            variant="outlined"
            suffix="Year"
          />

          <VIcon
            color="primary"
            size="20"
          >
            ri-arrow-right-line
          </VIcon>

          <VTextField
            v-model="modify.tenor"
            :disabled="!props.active.tenor"
            label="Modify"
            density="compact"
            variant="outlined"
            suffix="Year"
          />
        </div>
      </div>

      <!-- DSRA -->
      <div class="flex-1">
        <div class="d-flex align-center mb-2 gap-2">
          <VCheckbox
            :model-value="props.active.dsra"
            hide-details
            density="compact"
            @update:model-value="toggleActive('dsra')"
          />
          <span class="text-subtitle-1 font-weight-medium">DSRA</span>
        </div>

        <div class="d-flex align-center gap-2">
          <VTextField
            :model-value="props.before.dsra"
            disabled
            label="Before"
            density="compact"
            variant="outlined"
            suffix="Month"
            class="before-field"
          />

          <VIcon
            color="primary"
            size="20"
          >
            ri-arrow-right-line
          </VIcon>

          <VTextField
            v-model="modify.dsra"
            :disabled="!props.active.dsra"
            label="Modify"
            density="compact"
            variant="outlined"
            suffix="Month"
          />
        </div>

        <!-- DSCR -->
      </div>
    </div>

    <!-- ▒▒▒▒▒ MOBILE UI ▒▒▒▒▒ -->
    <div
      v-else
      class="d-flex flex-column gap-6"
    >
      <!-- Debt -->
      <div>
        <div class="d-flex align-center mb-2">
          <VCheckbox
            :model-value="props.active.de"
            hide-details
            density="compact"
            @update:model-value="toggleActive('de')"
          />
          <span class="font-weight-medium">Debt to Equity</span>
        </div>

        <div class="d-flex gap-3">
          <div class="flex-grow-1">
            <label class="text-caption">Before</label>
            <VTextField
              :model-value="props.before.de"
              disabled
              density="compact"
              variant="outlined"
              suffix="%"
              class="before-field"
            />
          </div>

          <VIcon
            color="primary"
            size="20"
            class="mt-6"
          >
            ri-arrow-right-line
          </VIcon>

          <div class="flex-grow-1">
            <label class="text-caption">Modify</label>
            <VTextField
              v-model="modify.de"
              :disabled="!props.active.de"
              density="compact"
              variant="outlined"
              suffix="%"
            />
          </div>
        </div>
      </div>

      <!-- Tenor -->
      <div>
        <div class="d-flex align-center mb-2">
          <VCheckbox
            :model-value="props.active.tenor"
            hide-details
            density="compact"
            @update:model-value="toggleActive('tenor')"
          />
          <span class="font-weight-medium">Tenor</span>
        </div>

        <div class="d-flex gap-3">
          <div class="flex-grow-1">
            <label class="text-caption">Before</label>
            <VTextField
              :model-value="props.before.tenor"
              disabled
              density="compact"
              variant="outlined"
              suffix="Year"
              class="before-field"
            />
          </div>

          <VIcon
            color="primary"
            size="20"
            class="mt-6"
          >
            ri-arrow-right-line
          </VIcon>

          <div class="flex-grow-1">
            <label class="text-caption">Modify</label>
            <VTextField
              v-model="modify.tenor"
              :disabled="!props.active.tenor"
              density="compact"
              variant="outlined"
              suffix="Year"
            />
          </div>
        </div>
      </div>

      <!-- DSRA -->
      <div>
        <div class="d-flex align-center mb-2">
          <VCheckbox
            :model-value="props.active.dsra"
            hide-details
            density="compact"
            @update:model-value="toggleActive('dsra')"
          />
          <span class="font-weight-medium">DSRA</span>
        </div>

        <div class="d-flex gap-3">
          <div class="flex-grow-1">
            <VTextField
              :model-value="props.before.dsra"
              disabled
              density="compact"
              label="Before"
              variant="outlined"
              suffix="Month"
              class="before-field"
              persistent-hint
            />
          </div>

          <VIcon
            color="primary"
            size="20"
            class="mt-6"
          >
            ri-arrow-right-line
          </VIcon>

          <div class="flex-grow-1">
            <VTextField
              v-model="modify.dsra"
              :disabled="!props.active.dsra"
              label="Modify"
              density="compact"
              variant="outlined"
              suffix="Month"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fc-wrapper {
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.opacity-50 { opacity: 0.5; }
.pointer-events-none { pointer-events: none; }

/* BEFORE 필드 스타일 정상화 (Vuetify disabled 흐림 방지) */
.before-field :deep(.v-field__overlay) {
  background: rgb(245, 245, 245) !important; /* 밝은 회색 */
}

.before-field :deep(input) {
  color: rgba(0, 0, 0, 85%) !important; /* 더 진하게 */
}

/* .before-field :deep(.v-field--disabled) {
  opacity: 1 !important;
} */
</style>
