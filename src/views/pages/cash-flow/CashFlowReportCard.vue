<script setup lang="ts">
import { computed, ref } from 'vue'
import ProjectionOverviewDrawer from './ProjectionOverviewDrawer.vue'

// --------------------------------------------------
// 🔹 Props
// --------------------------------------------------
interface TableRow {
  id: string
  label: string
  value: string | number
  unit?: string
}

interface Props {
  table: {
    sections: {
      rows: TableRow[]
    }[]
  }
}

const props = defineProps<Props>()

// --------------------------------------------------
// 🔹 table → rowMap (id 기반 lookup)
// --------------------------------------------------
const rowMap = computed<Record<string, TableRow>>(() => {
  const rows = props.table?.sections?.[0]?.rows ?? []

  return Object.fromEntries(rows.map(r => [r.id, r]))
})

// --------------------------------------------------
// 🔹 format utils
// --------------------------------------------------
const formatCurrency = (v?: number) =>
  typeof v === 'number' && !Number.isNaN(v)
    ? `$${Math.round(v).toLocaleString()}`
    : '-'

const formatPercent = (v?: number) =>
  typeof v === 'number' && !Number.isNaN(v)
    ? `${v.toFixed(2)}%`
    : '-'

// --------------------------------------------------
// 🔹 카드 데이터 (table 기반)
// --------------------------------------------------
const logisticData = computed(() => [
  {
    icon: 'ri-bank-line',
    color: 'primary',
    title: 'Capital Structure',
    hasDrawer: true,
    items: [
      {
        value: '-',
        label: 'Leverage ratio(Debt/Total)',
        isMain: true,
        showBelow: false,
      },
      {
        value: formatCurrency(rowMap.value.DEBT?.value as number),
        label: 'Debt amount',
        isMain: false,
        showBelow: true,
      },
      {
        value: `${rowMap.value.TENOR?.value ?? '-'}`,
        label: 'Tenor / Margin',
        isMain: false,
        showBelow: true,
      },
      {
        value: rowMap.value.EODDSRA?.value ?? '-',
        label: 'EOD threshold / DSRA',
        isMain: false,
        showBelow: true,
      },
    ],
  },

  {
    icon: 'ri-line-chart-line',
    color: 'success',
    title: 'Valuation Summary',
    hasDrawer: false,
    items: [
      {
        value: formatPercent(rowMap.value.EQIRR?.value as number),
        label: 'Equity IRR',
        isMain: true,
        showBelow: true,
      },
      {
        value: formatCurrency(rowMap.value.EQUITYNPV?.value as number),
        label: 'Equity NPV',
        isMain: false,
        showBelow: true,
      },
      {
        value: rowMap.value.PP?.value ?? '-',
        label: 'Payback period equity',
        isMain: false,
        showBelow: true,
      },
    ],
  },

  {
    icon: 'ri-briefcase-line',
    color: 'info',
    title: 'Investment Summary',
    hasDrawer: false,
    items: [
      {
        value: rowMap.value.MINDSCR?.value ?? '-',
        label: 'Min DSCR',
        isMain: false,
        showBelow: true,
      },
      {
        value: rowMap.value.LLCR?.value ?? '-',
        label: 'LLCR',
        isMain: true,
        showBelow: true,
      },
      {
        value: rowMap.value.DEFAULTYR?.value ?? '-',
        label: 'Default year',
        isMain: false,
        showBelow: true,
      },
      {
        value:
          rowMap.value.DSRATRG?.value
          ?? '-',
        label: 'DSRA trigger',
        isMain: false,
        showBelow: true,
      },
    ],
  },
])

// --------------------------------------------------
// 🔹 대표값 / 하위값 helper
// --------------------------------------------------
const getMainItem = (items: any[]) =>
  items.find(item => item.isMain)

const getBelowItems = (items: any[]) =>
  items.filter(item => item.showBelow)

// --------------------------------------------------
// 🔹 Drawer
// --------------------------------------------------
const isInfoDrawer = ref(false)
const openDrawer = () => (isInfoDrawer.value = true)
</script>

<template>
  <VRow class="align-stretch">
    <VCol
      v-for="(data, index) in logisticData"
      :key="index"
      cols="12"
      md="4"
      sm="12"
      class="d-flex"
    >
      <VCard
        class="logistics-card-statistics cursor-pointer flex-grow-1 h-100"
        :style="`border-block-end-color: rgba(var(--v-theme-${data.color}),0.8)`"
      >
        <VCardText class="px-6 py-4 h-100">
          <!-- ⭐ 대표값 -->
          <div class="d-flex align-center justify-space-between mb-1">
            <div class="d-flex align-center gap-x-4">
              <VAvatar
                variant="tonal"
                :color="data.color"
                rounded
              >
                <VIcon
                  :icon="data.icon"
                  size="24"
                />
              </VAvatar>

              <h4 class="text-h4 mb-0">
                {{ getMainItem(data.items)?.value }}
              </h4>
            </div>

            <span class="text-sm text-disabled">
              {{ getMainItem(data.items)?.label }}
            </span>
          </div>

          <!-- ⭐ 제목 + Drawer -->
          <div class="d-flex align-center justify-space-between mb-3 mt-2">
            <h6 class="text-h6 font-weight-regular mb-0">
              {{ data.title }}
            </h6>

            <VAvatar
              v-if="data.hasDrawer"
              color="warning"
              variant="tonal"
              size="26"
              class="cursor-pointer"
              @click="openDrawer"
            >
              <VIcon
                icon="ri-question-line"
                size="16"
              />
            </VAvatar>
          </div>

          <!-- 하위 항목 -->
          <div
            v-for="(item, i) in getBelowItems(data.items)"
            :key="i"
            class="d-flex align-center justify-space-between mb-1"
          >
            <div class="text-body-1 font-weight-medium">
              {{ item.value }}
            </div>

            <span class="text-sm text-disabled text-end">
              {{ item.label }}
            </span>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <ProjectionOverviewDrawer v-model="isInfoDrawer" />
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-radius: 8px;
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;
    @include mixins.elevation(10);
    transition: all 0.1s ease-out;
  }
}
</style>
