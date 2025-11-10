<script setup lang="ts">
import { ref } from 'vue'
import InformationDrawer from './InformationDrawer.vue'
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
// 🔹 Asset Characteristics
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
// 🔹 Market Conditions
// ----------------------
const revenue = ref({
  sell_price: null,
  sell_price_escalator: null,
  capacity_revenue: null,
  capacity_revenue_escalator: null,
})

const expense = ref({
  o_and_m_variable: null,
  o_and_m_fixed: null,
  fuel_price: null,
  insurance_rate: null,
  property_tax_rate: null,
  insurance_escalator: null,
  common_escalator: null,
})

// ----------------------
// 🔹 Financing & Tax
// ----------------------
const finance = ref({
  tenor: null,
  interest_rate: null,
  debt_to_equity: null,
  commitment_fee_rate: null,
  upfront_fee_rate: null,
  maintenance_capex: null,
})

const tax = ref({
  federal_tax_rate: null,
})

// ----------------------
// 🔹 DSRA
// ----------------------
const dsra = ref({
  enabled: true,
  threshold: null,
})

// ----------------------
// 🔹 위치 선택
// ----------------------
const onSelectLocation = (coords: { lat: number; lng: number; address: string }) => {
  location.value = { lat: coords.lat, lng: coords.lng }
  address.value = coords.address
  dialog.value = false
}

// ----------------------
// 🔹 아코디언 상태
// ----------------------
const isExpandedAsset = ref(true)
const isExpandedMarket = ref(true)
const isExpandedFinance = ref(true)

// ----------------------
// 🔹 Drawer
// ----------------------
const isInfoDrawer = ref(false)
const drawerCategory = ref<'asset' | 'market' | 'finance'>('asset')

const openDrawer = (category: 'asset' | 'market' | 'finance') => {
  drawerCategory.value = category
  isInfoDrawer.value = true
}
</script>

<template>
  <!-- 1️⃣ Project Information -->
  <VCard
    flat
    variant="outlined"
    class="mt-0 first-card"
  >
    <VCardItem class="item-card">
      <VCardTitle>Project Information</VCardTitle>
    </VCardItem>
    <VDivider />
    <VCardText class="card-text">
      <VRow class="align-center no-gutters">
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

        <VCol
          cols="12"
          md="5"
          class="py-0 d-flex align-center"
        >
          <div class="text-body-1 text-high-emphasis me-3">
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
              class="me-4"
            />
          </VRadioGroup>
        </VCol>

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
              color="rgba(var(--v-theme-on-surface), 0.6)"
              class="me-2"
              icon="ri-map-pin-line"
            />
            Location
          </div>
          <VRow class="align-start">
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
          >our terms of service.</a>
        </p>
      </div>
    </VCardText>
  </VCard>

  <!-- 2️⃣ Asset Characteristics -->
  <VCard
    flat
    variant="outlined"
    class="mt-3"
  >
    <VCardItem>
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <VCardTitle class="me-2">
            Asset Specifications
          </VCardTitle>
          <VAvatar
            color="warning"
            variant="tonal"
            size="28"
            class="cursor-pointer"
            @click="openDrawer('asset')"
          >
            <VIcon
              icon="ri-question-line"
              size="16"
            />
          </VAvatar>
        </div>
        <IconBtn
          :color="isExpandedAsset ? 'primary' : 'default'"
          @click="isExpandedAsset = !isExpandedAsset"
        >
          <VIcon
            size="20"
            :icon="isExpandedAsset ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
          />
        </IconBtn>
      </div>
    </VCardItem>

    <VExpandTransition>
      <div v-show="isExpandedAsset">
        <VDivider />
        <VCardText>
          <div class="mb-4">
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> Fuel Expense
            </div>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="fuelExpense.capacity"
                  label="Capacity"
                  suffix="MW"
                  hint="300–1000 MW"
                  persistent-hint
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="fuelExpense.capacity_factor"
                  label="Capacity Factor"
                  suffix="%"
                  hint="50–90 %"
                  persistent-hint
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="fuelExpense.heat_rate"
                  label="Heat Rate"
                  suffix="MMBtu/MWh"
                  hint="8.5–10.5 MMBtu/MWh"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </div>

          <div>
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> Capex
            </div>
            <VRow>
              <VCol
                v-for="(val, key) in capex"
                :key="key"
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="capex[key]"
                  :label="key.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())"
                  suffix="$"
                  persistent-hint
                  autocomplete="off"
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>

  <!-- 3️⃣ Market Conditions -->
  <VCard
    flat
    variant="outlined"
    class="mt-3"
  >
    <VCardItem>
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <VCardTitle class="me-2">
            Market Conditions
          </VCardTitle>
          <VAvatar
            color="warning"
            variant="tonal"
            size="28"
            class="cursor-pointer"
            @click="openDrawer('market')"
          >
            <VIcon
              icon="ri-chat-1-line"
              size="16"
            />
          </VAvatar>
        </div>
        <IconBtn
          :color="isExpandedMarket ? 'primary' : 'default'"
          @click="isExpandedMarket = !isExpandedMarket"
        >
          <VIcon
            size="20"
            :icon="isExpandedMarket ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
          />
        </IconBtn>
      </div>
    </VCardItem>

    <VExpandTransition>
      <div v-show="isExpandedMarket">
        <VDivider />
        <VCardText>
          <div class="mb-4">
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> Revenue
            </div>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="revenue.sell_price"
                  label="Sell price"
                  suffix="$/MWh"
                  hint="30–70 $/MWh"
                  persistent-hint
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="revenue.sell_price_escalator"
                  label="Sell price escalator"
                  suffix="%"
                  hint="1–3 %"
                  persistent-hint
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="revenue.capacity_revenue"
                  label="Capacity revenue"
                  suffix="$/MW-yr"
                  hint="30–100 $/MW-yr"
                  persistent-hint
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="revenue.capacity_revenue_escalator"
                  label="Capacity revenue escalator"
                  suffix="%"
                  hint="1–3 %"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </div>

          <div>
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> Expense
            </div>
            <VRow>
              <VCol
                v-for="(val, key) in expense"
                :key="key"
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense[key]"
                  :label="key.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())"
                  suffix="%"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>

  <!-- 4️⃣ Financing Terms & Tax -->
  <VCard
    flat
    variant="outlined"
    class="mt-3"
  >
    <VCardItem>
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <VCardTitle class="me-2">
            Financing Terms Conditions
          </VCardTitle>
          <VAvatar
            size="28"
            variant="outlined"
            color="secondary"
            rounded
            class="cursor-pointer"
            @click="openDrawer('finance')"
          >
            <VIcon
              icon="ri-question-line"
              size="16"
            />
          </VAvatar>
        </div>
        <IconBtn
          :color="isExpandedFinance ? 'primary' : 'default'"
          @click="isExpandedFinance = !isExpandedFinance"
        >
          <VIcon
            size="20"
            :icon="isExpandedFinance ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
          />
        </IconBtn>
      </div>
    </VCardItem>

    <VExpandTransition>
      <div v-show="isExpandedFinance">
        <VDivider />
        <VCardText>
          <div class="mb-4">
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> Financial Terms
            </div>
            <VRow>
              <VCol
                v-for="(val, key) in finance"
                :key="key"
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance[key]"
                  :label="key.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())"
                  suffix="%"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </div>

          <div class="mb-4">
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> Tax
            </div>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="tax.federal_tax_rate"
                  label="Federal tax rate"
                  suffix="%"
                  hint="15–35 %"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </div>

          <div class="mb-4">
            <div class="d-flex align-center text-body-1 mb-3">
              <div class="vertical-bar me-2" /> DSRA
            </div>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <div class="d-flex align-center">
                  <span class="text-body-1 me-2">No</span>
                  <VSwitch
                    v-model="dsra.enabled"
                    color="primary"
                    inset
                    hide-details
                  />
                  <span class="text-body-1 ms-2">Yes</span>
                </div>
              </VCol>
              <VCol
                v-if="dsra.enabled"
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="dsra.threshold"
                  label="Threshold"
                  hint="e.g. 1.5"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>

  <!-- ✅ Information Drawer -->
  <InformationDrawer
    v-model="isInfoDrawer"
    :category="drawerCategory"
    :asset-type="selectedType || 'coal'"
  />
</template>

<style scoped>
.vertical-bar {
  display: inline-block;
  border-radius: 2px;
  background-color: rgba(var(--v-theme-success));
  block-size: 16px;
  inline-size: 3px;
}
</style>
