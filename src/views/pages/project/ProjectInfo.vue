<script setup lang="ts">
import { ref } from 'vue'
import MapSearchDialog from './MapSearchDialog.vue'

// ----------------------
// 🔹 프로젝트 기본 정보
// ----------------------
const projectName = ref('')
const selectedType = ref<string | null>(null)

const assetTypes = ref([
  { id: 'coal', name: 'Coal' },
  { id: 'gas', name: 'Natural Gas' },
  { id: 'solar', name: 'Solar' },
  { id: 'wind', name: 'Wind' },
])

// ----------------------
// 🔹 Location 상태
// ----------------------
const location = ref<{ lat: number; lng: number } | null>(null)
const address = ref('')
const dialog = ref(false)

// ----------------------
// 🔹 Asset Characteristics 상태
// ----------------------
const fuelExpense = ref({
  capacity: null,
  capacity_factor: null,
  heat_rate: null,
})

const capex = ref({
  power_generation: null,
  general_facilities: null,
  plant_equipment: null,
  construction_labor: null,
  project_management: null,
  spare_parts: null,
  other_costs: null,
  sales_tax_rate: null,
})

// ----------------------
// 🔹 자식에서 전달된 위치 선택 처리
// ----------------------
const onSelectLocation = (coords: { lat: number; lng: number; address: string }) => {
  location.value = { lat: coords.lat, lng: coords.lng }
  address.value = coords.address
  dialog.value = false
}
</script>

<template>
  <!-- ============================= -->
  <!-- 1. Project Information -->
  <!-- ============================= -->
  <VCard
    flat
    variant="outlined"
    title="Project Information"
  >
    <VCardText>
      <VRow class="align-center no-gutters">
        <!-- Project Name -->
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="projectName"
            label="Project Name"
            density="comfortable"
          />
        </VCol>

        <!-- Asset Type -->
        <VCol
          cols="12"
          md="5"
          class="py-0 d-flex align-center"
        >
          <div class="text-body-1 text-high-emphasis me-3">
            <VIcon
              size="10"
              color="rgba(var(--v-theme-primary),1)"
              class="me-2"
              icon="ri-circle-fill"
            />
            Asset Type :
          </div>
          <VRadioGroup
            v-model="selectedType"
            inline
            color="primary"
            class="mt-0"
          >
            <VRadio
              v-for="item in assetTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </VRadioGroup>
        </VCol>

        <!-- Create Button -->
        <VCol
          cols="12"
          md="3"
          class="text-end"
        >
          <VBtn
            color="primary"
            class="text-end py-0"
          >
            Create Project
          </VBtn>
        </VCol>

        <!-- Location -->
        <VCol
          cols="12"
          class="mt-n2"
        >
          <div class="d-flex align-center text-body-1 text-high-emphasis mb-2">
            <VIcon
              size="18"
              color="primary"
              class="me-2"
              icon="ri-map-pin-line"
            />
            Location
          </div>

          <VRow
            class="align-center"
            no-gutters
          >
            <VCol
              cols="12"
              md="2"
            >
              <VBtn
                color="primary"
                variant="outlined"
                block
                height="46"
                @click="dialog = true"
              >
                Search
              </VBtn>
            </VCol>

            <VCol
              cols="12"
              md="3"
              class="px-2"
            >
              <VTextField
                label="Coordinates"
                :model-value="location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ''"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <VCol
              cols="12"
              md="7"
            >
              <VTextField
                label="Address"
                :model-value="address"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </VCol>
          </VRow>

          <MapSearchDialog
            v-model="dialog"
            :init-location="location"
            :init-address="address"
            @select-location="onSelectLocation"
          />
        </VCol>
      </VRow>

      <div class="bg-var-theme-background rounded pa-5 mt-4">
        <h6 class="text-h6">
          Default values are provided, but you can modify them according to your project.
        </h6>
        <p class="my-2 text-body-1">
          By creating a project, you are deemed to have agreed to
          <a
            href="javascript:void(0)"
            class="font-weight-medium d-inline-block"
          >
            our terms of service.
          </a>
        </p>
      </div>
    </VCardText>
  </VCard>

  <!-- ============================= -->
  <!-- 2. Asset Characteristics -->
  <!-- ============================= -->
  <VCard
    flat
    variant="outlined"
    class="mt-6"
    title="Asset Characteristics"
  >
    <VCardText>
      <div class="section-border mb-6">
        <!-- Fuel Expense -->
        <div class="mb-3">
          <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
            <div class="vertical-bar me-2" />
            <span class="text-body-1 text-high-emphasis">Capex</span>
          </div>
          <VRow dense>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="fuelExpense.capacity"
                label="Capacity"
                suffix="MW"
                hint="300M–1000 MW"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="fuelExpense.capacity_factor"
                label="Capacity Factor"
                suffix="%"
                hint="50–90 %"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="fuelExpense.heat_rate"
                label="Heat Rate"
                suffix="MMBtu/MWh"
                hint="8.5–10.5 MMBtu/MWh"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
          </VRow>
        </div>

        <!-- Capex -->
        <div>
          <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
            <VIcon
              size="16"
              color="#16B1FF"
              class="me-2"
              icon="ri-subtract-line"
            />
            Capex
          </div>
          <VRow dense>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.power_generation"
                label="Power generation"
                suffix="$"
                hint="200M–350M $"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.general_facilities"
                label="General facilities"
                suffix="$"
                hint="120M–200M $"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.plant_equipment"
                label="Plant equipment"
                suffix="$"
                hint="350M–500M $"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.construction_labor"
                label="Construction labor"
                suffix="$"
                hint="300M–550M $"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.project_management"
                label="Project management"
                suffix="$"
                hint="10M–20M $"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.spare_parts"
                label="Spare parts"
                suffix="%"
                hint="0.2–0.5 %"
                persistent-hint
                hide-details="true"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.other_costs"
                label="Other costs"
                suffix="$"
                hint="450M–700M $"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
            <VCol
              cols="12"
              md="3"
              lg="3"
            >
              <VTextField
                v-model="capex.sales_tax_rate"
                label="Sales tax rate"
                suffix="%"
                hint="0–10 %"
                persistent-hint
                hide-details="auto"
              />
            </VCol>
          </VRow>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.vertical-bar {
  display: inline-block;
  border-radius: 2px;
  background-color: #16b1ff;
  block-size: 16px;
  inline-size: 3px;
}
</style>
