<script setup lang="ts">
import { computed } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

interface Props {
  modelValue: boolean
  category: 'asset' | 'market' | 'finance'
  assetType: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// ✅ Drawer 닫기
const closeNavigationDrawer = () => {
  emit('update:modelValue', false)
}

// ✅ v-model 업데이트
const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:modelValue', val)
}

// ✅ 섹션 타이틀
const sectionTitle = computed(() => {
  switch (props.category) {
    case 'asset': return 'Asset Characteristics'
    case 'market': return 'Market Conditions'
    case 'finance': return 'Financing Terms & Tax'
    default: return 'Information'
  }
})

// ✅ 섹션별 데이터
const infoData = computed(() => {
  switch (props.category) {
    case 'asset':
      return [
        {
          title: 'Fuel Expense',
          items: [
            { name: 'Capacity', desc: 'The maximum amount of electricity a generator can produce at full load under ideal conditions (MW).' },
            { name: 'Capacity Factor', desc: 'A ratio measuring how much electricity a power plant actually produces compared to its maximum potential (%).' },
            { name: 'Heat Rate', desc: 'Indicates thermal efficiency — lower heat rate means higher efficiency (MMBtu/MWh).' },
          ],
        },
        {
          title: 'Capex',
          items: [
            { name: 'Power Generation', desc: 'Capital cost of turbines, generators, boilers, and auxiliaries including HRSGs for combined-cycle plants.' },
            { name: 'General Facilities', desc: 'Non-process infrastructure such as control buildings, offices, storage areas, and site utilities.' },
            { name: 'Plant Equipment', desc: 'Expenditures for process-related and balance-of-plant (BOP) equipment: pumps, compressors, transformers, cooling systems, and emission control units.' },
            { name: 'Construction Labor', desc: 'Total labor cost for on-site construction and installation, including civil, structural, mechanical, and electrical works.' },
            { name: 'Project Management', desc: 'EPC management, project planning, scheduling, supervision, and quality assurance costs.' },
            { name: 'Spare Parts', desc: 'Initial spare parts and consumables required for commissioning, start-up, and early operation.' },
          ],
        },
      ]

    case 'market':
      return [
        {
          title: 'Revenue',
          items: [
            { name: 'Sell Price', desc: 'Electricity selling price per megawatt-hour ($/MWh).' },
            { name: 'Sell Price Escalator', desc: 'Annual escalation rate for electricity prices (%).' },
            { name: 'Capacity Revenue', desc: 'Revenue from capacity payments, typically expressed as $/MW-yr.' },
          ],
        },
        {
          title: 'Expense',
          items: [
            { name: 'O&M Variable Cost', desc: 'Operational cost that varies with power output ($/MWh).' },
            { name: 'O&M Fixed Cost', desc: 'Annual fixed operation and maintenance cost ($/MW-yr).' },
            { name: 'Fuel Price', desc: 'Unit cost of primary fuel used for generation ($/MMBtu).' },
          ],
        },
      ]

    case 'finance':
      return [
        {
          title: 'Financial Terms',
          items: [
            { name: 'Tenor', desc: 'Loan repayment period (years).' },
            { name: 'Interest Rate', desc: 'Annual interest rate applied to project debt (%).' },
            { name: 'Debt to Equity Ratio', desc: 'Proportion of debt vs. equity in the financing structure (%).' },
          ],
        },
        {
          title: 'Tax',
          items: [
            { name: 'Federal Tax Rate', desc: 'Corporate income tax rate applied to project earnings (%).' },
          ],
        },
      ]
    default:
      return []
  }
})
</script>

<template>
  <!-- ✅ 완전한 Materio Drawer 구조 -->
  <Teleport to="body">
    <VNavigationDrawer
      data-allow-mismatch
      temporary
      location="end"
      width="520"
      elevation="24"
      class="info-drawer scrollable-content"
      :model-value="modelValue"
      attach="body"

      scrim="rgba(0,0,0,0.35)"
      @update:model-value="handleDrawerModelValueUpdate"
    >
      <!-- Header -->
      <div class="drawer-header d-flex align-center justify-space-between pa-4">
        <h6 class="text-h6 font-weight-semibold mb-0">
          {{ sectionTitle }}
        </h6>
        <VBtn
          icon
          variant="text"
          density="comfortable"
          @click="closeNavigationDrawer"
        >
          <VIcon
            icon="ri-close-line"
            size="22"
          />
        </VBtn>
      </div>

      <VDivider />

      <!-- Scrollable Content -->
      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <template
              v-for="(section, idx) in infoData"
              :key="idx"
            >
              <div class="mb-4">
                <h6 class="text-subtitle-1 font-weight-semibold mb-2">
                  {{ section.title }}
                </h6>
                <VTable
                  density="compact"
                  class="info-table"
                >
                  <thead>
                    <tr>
                      <th class="text-left text-uppercase text-caption">
                        Item
                      </th>
                      <th class="text-left text-uppercase text-caption">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in section.items"
                      :key="i"
                    >
                      <td class="font-weight-medium">
                        {{ item.name }}
                      </td>
                      <td class="text-body-2">
                        {{ item.desc }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>

              <VDivider
                v-if="idx < infoData.length - 1"
                class="my-4"
              />
            </template>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>
  </Teleport>
</template>

<style scoped>
/* ✅ Drawer 본체 (AppBar 위까지 완전 덮음) */
:deep(.v-navigation-drawer.info-drawer) {
  position: fixed !important;
  z-index: 2600 !important;
  background-color: rgb(var(--v-theme-surface));
  block-size: 100vh !important;
  border-start-end-radius: 12px;
  border-start-start-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 20%);
  inset-block-start: 0 !important;
  inset-inline-end: 0 !important;
}

/* Header */
.drawer-header {
  position: sticky;
  z-index: 2;
  background-color: rgb(var(--v-theme-surface));
  inset-block-start: 0;
}

/* Table 스타일 */
.info-table th {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-weight: 600;
}

.info-table td {
  color: rgba(var(--v-theme-on-surface), 0.87);
  padding-block: 6px;
  vertical-align: top;
}
</style>
