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
// 🔹 Market Conditions 상태
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
// 🔹 Financing & Tax 상태
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
// 🔹 DSRA 상태
// ----------------------
const dsra = ref({
  enabled: true,
  threshold: null,
})

// ----------------------
// 🔹 자식에서 전달된 위치 선택 처리
// ----------------------
const onSelectLocation = (coords: { lat: number; lng: number; address: string }) => {
  location.value = { lat: coords.lat, lng: coords.lng }
  address.value = coords.address
  dialog.value = false
}

// ----------------------
// 🔹 카드별 아코디언 상태
// ----------------------
const isExpandedAsset = ref(true)
const isExpandedMarket = ref(true)
const isExpandedFinance = ref(true)
</script>

<template>
  <!-- ============================= -->
  <!-- 1. Project Information -->
  <!-- ============================= -->
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
              color="primary"
              class="me-2"
              icon="ri-map-pin-line"
            />
            Location
          </div>

          <VRow class="align-start">
            <VCol
              cols="12"
              md="2"
              class="mb-3 mb-md-0"
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
              class="mb-3 mb-md-0"
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

  <!-- ============================= -->
  <!-- 2. Asset Characteristics -->
  <!-- ============================= -->
  <VCard
    flat
    variant="outlined"
    class="mt-3"
  >
    <VCardItem>
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <VCardTitle class="me-2">
            Asset Characteristics
          </VCardTitle>

          <VTooltip text="설비 용량, 효율, 열비율 등 기본 특성을 설정합니다.">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                color="info"
                variant="tonal"
                size="28"
                class="me-2 cursor-pointer"
              >
                <VIcon
                  icon="ri-chat-1-line"
                  size="16"
                />
              </VAvatar>
            </template>
          </VTooltip>

          <VTooltip text="프로젝트 CAPEX 및 설비 관련 데이터입니다.">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                rounded
                color="warning"
                variant="tonal"
                size="28"
                class="me-2 cursor-pointer"
              >
                <VIcon
                  icon="ri-information-line"
                  size="16"
                />
              </VAvatar>
            </template>
          </VTooltip>

          <VTooltip text="프로젝트 CAPEX 및 설비 관련 데이터입니다.">
            <template #activator="{ props }">
              <VAvatar
                rounded
                v-bind="props"
                color="black"
                variant="tonal"
                size="28"
                class="cursor-pointer border me-2"
              >
                <VIcon
                  icon="ri-question-line"
                  size="16"
                  color="black"
                />
              </VAvatar>
            </template>
          </VTooltip>

          <VTooltip text="도움말 또는 추가 설명 보기">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                rounded
                color="black"
                variant="outlined"
                size="28"
                class="cursor-pointer border border-opacity-75"
                style="border-color: rgba(0, 0, 0, 60%);"
              >
                <VIcon
                  icon="ri-question-line"
                  size="16"
                  color="black"
                />
              </VAvatar>
            </template>
          </VTooltip>
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
          <div class="mb-3">
            <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
              <div class="vertical-bar me-2" />
              <span>Fuel Expense</span>
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
                  hide-details="auto"
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
                  hide-details="auto"
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
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </div>

          <div>
            <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
              <div class="vertical-bar me-2" />
              <span>Capex</span>
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
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>

  <!-- ============================= -->
  <!-- 3. Market Conditions -->
  <!-- ============================= -->
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

          <VTooltip text="전력 판매 단가, CAPACITY 수익, 보험료 등의 시장 조건을 입력합니다.">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                color="info"
                variant="tonal"
                size="28"
                class="me-2 cursor-pointer"
              >
                <VIcon
                  icon="ri-chat-1-line"
                  size="16"
                />
              </VAvatar>
            </template>
          </VTooltip>

          <VTooltip text="시장 가격 및 비용 인상률 정보">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                color="warning"
                rounded
                variant="tonal"
                size="28"
                class="cursor-pointer"
              >
                <VIcon
                  icon="ri-chat-1-line"
                  size="16"
                />
              </VAvatar>
            </template>
          </VTooltip>
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
            <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
              <div class="vertical-bar me-2" />
              <span>Revenue</span>
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
                  hide-details="auto"
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
                  hide-details="auto"
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
                  hide-details="auto"
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
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </div>

          <div>
            <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
              <div class="vertical-bar me-2" />
              <span>Expense</span>
            </div>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.o_and_m_variable"
                  label="O&M variable cost"
                  suffix="$/MWh"
                  hint="2–5 $/MWh"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.o_and_m_fixed"
                  label="O&M fixed cost"
                  suffix="$/MW-yr"
                  hint="18,000–30,000 $/MW-yr"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.fuel_price"
                  label="Fuel price"
                  suffix="$/MMBtu"
                  hint="1.5–5 $/MMBtu"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.insurance_rate"
                  label="Insurance rate"
                  suffix="%"
                  hint="1–15 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.property_tax_rate"
                  label="Property tax rate"
                  suffix="%"
                  hint="0.5–2 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.insurance_escalator"
                  label="Insurance escalator"
                  suffix="%"
                  hint="2–4 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="expense.common_escalator"
                  label="Common escalator"
                  suffix="%"
                  hint="1.5–3.5 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>

  <!-- ============================= -->
  <!-- 4. Financing Terms & Tax -->
  <!-- ============================= -->
  <VCard
    flat
    variant="outlined"
    class="mt-3"
  >
    <VCardItem>
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <VCardTitle class="me-2">
            Financing Terms & Tax
          </VCardTitle>

          <VTooltip text="금융 조건 및 세율 관련 정보를 설정합니다.">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                color="info"
                variant="tonal"
                size="28"
                class="me-2 cursor-pointer"
              >
                <VIcon
                  icon="ri-chat-1-line"
                  size="16"
                />
              </VAvatar>
            </template>
          </VTooltip>

          <VTooltip text="대출 비율, 금리, 유지보수 비용, 세율 등의 데이터">
            <template #activator="{ props }">
              <VAvatar
                v-bind="props"
                color="warning"
                variant="tonal"
                size="28"
                class="cursor-pointer"
              >
                <VIcon
                  icon="ri-line-chart-line"
                  size="16"
                />
              </VAvatar>
            </template>
          </VTooltip>
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
            <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
              <div class="vertical-bar me-2" />
              <span>Financial Terms</span>
            </div>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance.tenor"
                  label="Tenor"
                  suffix="year"
                  hint="15–30 year"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance.interest_rate"
                  label="Interest rate"
                  suffix="%"
                  hint="5–9 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance.debt_to_equity"
                  label="Debt to equity ratio"
                  suffix="%"
                  hint="70–90 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance.commitment_fee_rate"
                  label="Commitment fee rate"
                  suffix="%"
                  hint="0.5–1.5 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance.upfront_fee_rate"
                  label="Upfront fee rate"
                  suffix="%"
                  hint="0.5–2 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="finance.maintenance_capex"
                  label="Maintenance capex"
                  suffix="%"
                  hint="0–2.5 %"
                  persistent-hint
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </div>

          <div>
            <div class="d-flex align-center text-body-1 text-high-emphasis mb-4">
              <div class="vertical-bar me-2" />
              <span>Tax</span>
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
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>

  <!-- ============================= -->
  <!-- 5. DSRA -->
  <!-- ============================= -->
  <VCard
    flat
    variant="outlined"
    class="mt-3"
  >
    <VCardItem>
      <VCardTitle>DSRA</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow class="align-center">
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
            hide-details="auto"
          />
        </VCol>
      </VRow>
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

.first-card .item-card {
  display: flex;
  align-items: center;
  block-size: 52px !important;
  padding-block: 0 !important;
  padding-inline: 20px !important;
}

.v-card-item {
  padding-block: 7px !important;
}

.v-card-item + .v-divider {
  margin-block-start: 0 !important;
}

.v-card-text {
  padding-block-start: 12px !important;
}

.v-card-text > div:first-of-type {
  margin-block-start: 4px !important;
}

.v-card-text .text-high-emphasis.mb-4 {
  margin-block-end: 0.75rem !important;
}

.first-card .card-text {
  padding-block: 0 16px !important;
}
</style>
