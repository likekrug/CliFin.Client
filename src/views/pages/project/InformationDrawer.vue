<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'

interface Props {
  modelValue: boolean
  category: 'C1' | 'C3' | 'C4'
  assetType: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const { mdAndUp } = useDisplay()

// ✅ 반응형 Drawer 폭 설정
const drawerWidth = computed(() => (mdAndUp.value ? 1400 : 440))

// ✅ Drawer 닫기 이벤트
const closeNavigationDrawer = () => emit('update:modelValue', false)
const handleDrawerModelValueUpdate = (val: boolean) => emit('update:modelValue', val)

// ✅ Drawer 열리고 닫힐 때 Scroll + Overlay 제어
watch(
  () => props.modelValue,
  async val => {
    await nextTick()

    const body = document.body

    if (val) {
      // 🔹 Drawer 열릴 때: 스크롤 위치 저장 + 고정
      const scrollY = window.scrollY

      body.style.top = `-${scrollY}px`
      body.dataset.scrollY = scrollY.toString()
      body.classList.add('drawer-open')
    }
    else {
      // 🔹 Drawer 닫힐 때
      const scrollY = body.dataset.scrollY ? Number.parseInt(body.dataset.scrollY) : 0

      // 1️⃣ Vuetify overlay 먼저 제거
      const vuetifyOverlay = document.querySelector('.v-overlay.v-overlay--active')
      if (vuetifyOverlay)
        vuetifyOverlay.classList.remove('v-overlay--active')

      // 2️⃣ 0.3초 뒤 body 스크롤 복원
      setTimeout(() => {
        body.classList.remove('drawer-open')
        body.style.removeProperty('top')
        window.scrollTo(0, scrollY)
      }, 300)
    }
  },
)

// ✅ Drawer 섹션 제목
const sectionTitle = computed(() => {
  switch (props.category) {
    case 'C1': return 'Asset Characteristics'
    case 'C3': return 'Market Conditions'
    case 'C4': return 'Financing Terms & Tax'
    default: return 'Information'
  }
})

// ✅ Drawer 내용 데이터
const infoData = computed(() => {
  switch (props.category) {
    case 'C1':
      return [
        {
          title: 'Fuel Expense',
          items: [
            { name: 'Capacity', desc: 'The maximum amount of electricity a generator can produce at full load under ideal conditions (MW).', range: '300–1000 MW' },
            { name: 'Capacity Factor', desc: 'A ratio measuring how much electricity a power plant actually produces compared to its maximum potential (%).', range: '50–90 %' },
            { name: 'Heat Rate', desc: 'Indicates thermal efficiency — lower heat rate means higher efficiency (MMBtu/MWh).', range: '8.5–10.5 MMBtu/MWh' },
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

    case 'C3':
      return [
        {
          title: 'Revenue',
          items: [
            { name: 'Sell Price', desc: 'Electricity selling price per megawatt-hour ($/MWh).', range: '30–70 $/MWh' },
            { name: 'Sell Price Escalator', desc: 'Annual escalation rate for electricity prices (%).', range: '1–3 %' },
            { name: 'Capacity Revenue', desc: 'Revenue from capacity payments, typically expressed as $/MW-yr.', range: '30–100 $/MW-yr' },
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

    case 'C4':
      return [
        {
          title: 'Financial Terms',
          items: [
            { name: 'Tenor', desc: 'Loan repayment period (years).' },
            { name: 'Interest Rate', desc: 'Annual interest rate applied to project debt (%).', range: '3–8 %' },
            { name: 'Debt to Equity Ratio', desc: 'Proportion of debt vs. equity in the financing structure (%).', range: '60–80 %' },
          ],
        },
        {
          title: 'Tax',
          items: [
            { name: 'Federal Tax Rate', desc: 'Corporate income tax rate applied to project earnings (%).', range: '15–35 %' },
          ],
        },
      ]
    default:
      return []
  }
})
</script>

<template>
  <Teleport to="body">
    <VNavigationDrawer
      temporary
      location="end"
      :width="drawerWidth"
      elevation="24"
      attach="body"
      teleport-disabled="false"
      scrim="rgba(0,0,0,0.45)"
      :model-value="modelValue"
      class="info-drawer"
      @update:model-value="handleDrawerModelValueUpdate"
    >
      <!-- Header -->
      <div class="drawer-header d-flex align-center justify-space-between pa-4">
        <h6 class="font-weight-semibold mb-0 text-h5">
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

      <!-- Content -->
      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText class="pt-4">
            <template
              v-for="(section, idx) in infoData"
              :key="idx"
            >
              <div class="mb-6">
                <h6 class="text-body-1 font-weight-semibold text-high-emphasis mb-3">
                  {{ section.title }}
                </h6>

                <VTable
                  density="comfortable"
                  class="text-body-1 materio-table"
                >
                  <thead>
                    <tr>
                      <th class="text-center text-caption text-uppercase font-weight-semibold text-medium-emphasis">
                        Item
                      </th>
                      <th class="text-center text-caption text-uppercase font-weight-semibold text-medium-emphasis">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, i) in section.items"
                      :key="i"
                    >
                      <td class="font-weight-medium text-high-emphasis text-left">
                        {{ item.name }}
                      </td>
                      <td class="text-high-emphasis text-left">
                        {{ item.desc }}
                        <div
                          v-if="item.range"
                          class="text-caption text-medium-emphasis mt-1"
                        >
                          Range: {{ item.range }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </template>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>
  </Teleport>
</template>

<style scoped>
:deep(.v-navigation-drawer.info-drawer) {
  position: fixed !important;
  z-index: 2600 !important;
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--v-theme-surface));
  block-size: 100vh !important;
  border-start-end-radius: 12px;
  border-start-start-radius: 12px;
}

.drawer-header {
  position: sticky;
  z-index: 10;
  background-color: rgb(var(--v-theme-surface));
  inset-block-start: 0;
}

/* ✅ Materio 기본 테이블 셀 스타일 */
:deep(.materio-table th),
:deep(.materio-table td) {
  border-block-end: 1px solid rgba(var(--v-border-color), 0.06);
  padding-block: 14px !important;
  padding-inline: 16px !important;
  vertical-align: middle !important;
}

/* ✅ 마지막 행 라인 강조 */
:deep(.materio-table tbody tr:last-child td) {
  border-block-end: 1px solid rgba(var(--v-border-color), 0.12) !important;
}
</style>
