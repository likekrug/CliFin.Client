<script setup lang="ts">
interface Project {
  id: number
  name: string
  type: string
  location: string
}

defineProps<{ project: Project }>()
</script>

<template>
  <VCard
    outlined
    class="pa-0"
  >
    <!-- 🔹 Title -->
    <VCardTitle class="d-flex align-center justify-space-between px-6 py-4">
      Baseline Projection Overview
      <VBtn
        icon
        variant="outlined"
        size="28"
        color="secondary"
        class="rounded"
      >
        <VIcon icon="ri-arrow-right-line" />
      </VBtn>
    </VCardTitle>

    <VDivider />

    <!-- 🔹 Capital Structure -->
    <VCardText class="px-6 py-4">
      <h6 class="text-subtitle-1 font-weight-semibold mb-3">
        Capital Structure
      </h6>

      <div class="text-body-1">
        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Debt amount</span>
          <span class="text-high-emphasis">$12,000,000 $</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Tenor / Margin</span>
          <span class="text-high-emphasis">10 Year / 3.5%</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">EOD threshold / DSRA</span>
          <span class="text-high-emphasis">1.2x / 6 months (Y)</span>
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- 🔹 Valuation Summary -->
    <VCardText class="px-6 py-4">
      <h6 class="text-subtitle-1 font-weight-semibold mb-3">
        Valuation Summary
      </h6>

      <div class="text-body-1">
        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Equity IRR</span>
          <span class="text-high-emphasis">14.2 %</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Equity NPV</span>
          <span class="text-high-emphasis">$5,430,000 $</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Payback period equity</span>
          <span class="text-high-emphasis">8.5 Year</span>
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- 🔹 Investment Summary -->
    <VCardText class="px-6 py-4">
      <h6 class="text-subtitle-1 font-weight-semibold mb-3">
        Investment Summary
      </h6>

      <div class="text-body-1">
        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Min DSCR</span>
          <span class="text-high-emphasis">1.35</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">LLCR</span>
          <span class="text-high-emphasis">1.65</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">Default year</span>
          <span class="text-high-emphasis">2031 Year</span>
        </div>

        <div class="d-flex justify-space-between align-center my-2">
          <span class="text-high-emphasis font-weight-medium">DSRA trigger</span>
          <span class="text-high-emphasis">Y</span>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.v-card {
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 5%);
}

/* 텍스트 정렬 및 시각적 간격 조정 */
.text-body-1 {
  line-height: 1.8;
}
</style>
