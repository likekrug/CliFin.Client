<script setup lang="ts">
import { ref } from 'vue'

const logisticData = ref([
  {
    icon: 'ri-bank-line',
    color: 'primary',
    title: 'Capital Structure',
    items: [
      { value: '$12,000,000', label: 'Debt amount' },
      { value: '10 Year/3.5%', label: 'Tenor / Margin' },
      { value: '1.2x/6 months (Y)', label: 'EOD threshold / DSRA' },
    ],
    isHover: false,
  },
  {
    icon: 'ri-line-chart-line',
    color: 'success',
    title: 'Valuation Summary',
    items: [
      { value: '14.2%', label: 'Equity IRR' },
      { value: '$5,430,000', label: 'Equity NPV' },
      { value: '8.5 Year', label: 'Payback period equity' },
    ],
    isHover: false,
  },
  {
    icon: 'ri-briefcase-line',
    color: 'info',
    title: 'Investment Summary',
    items: [
      { value: '1.35', label: 'Min DSCR' },
      { value: '1.65', label: 'LLCR' },
      { value: '2031', label: 'Default year' },
      { value: 'Y', label: 'DSRA trigger' },
    ],
    isHover: false,
  },
])
</script>

<template>
  <VRow>
    <VCol
      v-for="(data, index) in logisticData"
      :key="index"
      cols="12"
      md="4"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.7)`"
          @mouseenter="data.isHover = true"
          @mouseleave="data.isHover = false"
        >
          <VCardText>
            <div class="d-flex align-center gap-x-4 mb-2">
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
                $12,000,000
              </h4>
            </div>

            <h6 class="text-h6 font-weight-regular">
              {{ data.title }}
            </h6>
            <!-- 세부항목 -->
            <div
              v-for="(item, i) in data.items"
              :key="i"
              class="d-flex align-center"
            >
              <div class="text-body-1 font-weight-medium me-2">
                {{ item.value }}
              </div>
              <span class="text-sm text-disabled text-end">{{ item.label }}</span>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
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
  .logistics-card-statistics {
    &:hover {
      margin-block-end: -2px;
    }
  }
}
</style>
