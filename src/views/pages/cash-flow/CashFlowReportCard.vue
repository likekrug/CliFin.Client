<script setup lang="ts">
import { ref } from 'vue'
import ProjectionOverviewDrawer from './ProjectionOverviewDrawer.vue'

// --------------------------------------------------
// 🔹 카드 데이터 (대표값 isMain / 하위 표시 showBelow)
// --------------------------------------------------
const logisticData = ref([
  {
    icon: 'ri-bank-line',
    color: 'primary',
    title: 'Capital Structure',
    items: [
      { value: '10.3%', label: 'Leverage ratio (Debt / Total)', isMain: true, showBelow: false },
      { value: '$12,000,000', label: 'Debt amount', isMain: false, showBelow: true },
      { value: '10 Year / 3.5%', label: 'Tenor / Margin', isMain: false, showBelow: true },
      { value: '1.2x / 6 months (Y)', label: 'EOD threshold / DSRA', isMain: false, showBelow: true },
    ],
    isHover: false,
    hasDrawer: true, // ← ⭐ 첫 번째 카드만 drawer on
  },

  {
    icon: 'ri-line-chart-line',
    color: 'success',
    title: 'Valation Summary',
    items: [
      { value: '14.2%', label: 'Equity IRR', isMain: true, showBelow: true },
      { value: '$5,430,000', label: 'Equity NPV', isMain: false, showBelow: true },
      { value: '8.5 Year', label: 'Payback period equity', isMain: false, showBelow: true },
    ],
    isHover: false,
    hasDrawer: false,
  },

  {
    icon: 'ri-briefcase-line',
    color: 'info',
    title: 'Investment Summary',
    items: [
      { value: '1.35', label: 'Min DSCR', isMain: false, showBelow: true },
      { value: '1.65', label: 'LLCR', isMain: true, showBelow: true },
      { value: '2031', label: 'Default year', isMain: false, showBelow: true },
      { value: 'Y', label: 'DSRA trigger', isMain: false, showBelow: true },
    ],
    isHover: false,
    hasDrawer: false,
  },
])

// --------------------------------------------------
// 🔹 대표값 추출
// --------------------------------------------------
const getMainItem = (items: any[]) =>
  items.find(item => item.isMain)

// --------------------------------------------------
// 🔹 showBelow === true 인 항목만
// --------------------------------------------------
const getBelowItems = (items: any[]) =>
  items.filter(item => item.showBelow)

// --------------------------------------------------
// 🔹 Drawer 오픈 함수 (외부에서 구현 예정)
// --------------------------------------------------
const isInfoDrawer = ref(false)

const openDrawer = () => {
  isInfoDrawer.value = true
}
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
        :style="
          data.isHover
            ? `border-block-end-color: rgb(var(--v-theme-${data.color}))`
            : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.7)`
        "
        @mouseenter="data.isHover = true"
        @mouseleave="data.isHover = false"
      >
        <VCardText class="px-6 py-4 h-100">
          <!-- ⭐ 대표값 영역 -->
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

          <!-- ⭐ 제목 + Drawer 아이콘 (첫 번째 카드만 활성) -->
          <div class="d-flex align-center justify-space-between mb-3 mt-2 w-100">
            <h6 class="text-h6 font-weight-regular mb-0">
              {{ data.title }}
            </h6>

            <!-- 첫 번째 카드만 Drawer 아이콘 표시 -->
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
            <div class="text-body-1 font-weight-medium me-2">
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

.skin--bordered {
  .logistics-card-statistics:hover {
    margin-block-end: -2px;
  }
}
</style>
