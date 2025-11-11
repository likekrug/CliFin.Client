<script setup lang="ts">
import { ref } from 'vue'

interface Project {
  id: number
  name: string
  type: string
  location: string
}

defineProps<{ project: Project }>()

const showReport = ref(false)

const toggleCard = () => {
  showReport.value = !showReport.value
}
</script>

<template>
  <VCard
    outlined
    class="pa-0 projection-card"
  >
    <!-- ✅ 카드 헤더 -->

    <VBtn
      icon
      variant="tonal"
      size="32"
      color="warning"
      class="rounded"
      @click="toggleCard"
    >
      <VIcon
        :icon="showReport ? 'ri-arrow-left-line' : 'ri-question-line'"
        size="20"
      />
    </VBtn>
    </VCardTitle>

    <VDivider class="custom-divider" />

    <!-- ✅ Overview 카드 -->
    <template v-if="!showReport">
      <VCardText class="px-6 py-4 section">
        <h6 class="section-title">
          Capital Structure
        </h6>

        <div class="info-row">
          <span class="label">Debt amount</span>
          <span class="value right">$12,000,000</span>
        </div>

        <div class="info-row">
          <span class="label">Tenor / Margin</span>
          <span class="value right">10 Year / 3.5%</span>
        </div>

        <div class="info-row">
          <span class="label">EOD threshold / DSRA</span>
          <span class="value right">1.2x / 6 months (Y)</span>
        </div>
      </VCardText>

      <VDivider class="custom-divider" />

      <VCardText class="px-6 py-4 section">
        <h6 class="section-title">
          Valuation Summary
        </h6>

        <div class="info-row">
          <span class="label">Equity IRR</span>
          <span class="value right">14.2 %</span>
        </div>

        <div class="info-row">
          <span class="label">Equity NPV</span>
          <span class="value right">$5,430,000</span>
        </div>

        <div class="info-row">
          <span class="label">Payback period equity</span>
          <span class="value right">8.5 Year</span>
        </div>
      </VCardText>

      <VDivider class="custom-divider" />

      <VCardText class="px-6 py-4 section">
        <h6 class="section-title">
          Investment Summary
        </h6>

        <div class="info-row">
          <span class="label">Min DSCR</span>
          <span class="value right">1.35</span>
        </div>

        <div class="info-row">
          <span class="label">LLCR</span>
          <span class="value right">1.65</span>
        </div>

        <div class="info-row">
          <span class="label">Default year</span>
          <span class="value right">2031</span>
        </div>

        <div class="info-row">
          <span class="label">DSRA trigger</span>
          <span class="value right">Y</span>
        </div>
      </VCardText>
    </template>

    <!-- ✅ Report 카드 -->
    <template v-else>
      <VCardText class="px-6 py-4 section">
        <h6 class="section-title">
          Capital Structure
        </h6>

        <div class="info-row">
          <span class="label">Debt amount</span>
          <span class="value left">Debt service</span>
        </div>

        <div class="info-row">
          <span class="label">Tenor / Margin</span>
          <span class="value left">Loan duration / interest margin</span>
        </div>

        <div class="info-row">
          <span class="label">EOD threshold / DSRA</span>
          <span class="value left">
            Event of Default threshold / Debt Service Reserve Account condition
          </span>
        </div>
      </VCardText>

      <VDivider class="custom-divider" />

      <VCardText class="px-6 py-4 section">
        <h6 class="section-title">
          Valuation Summary
        </h6>

        <div class="info-row">
          <span class="label">Equity IRR</span>
          <span class="value left">Internal rate of return to equity investors</span>
        </div>

        <div class="info-row">
          <span class="label">Equity NPV</span>
          <span class="value left">Net present value of equity cash flows</span>
        </div>

        <div class="info-row">
          <span class="label">Payback period equity</span>
          <span class="value left">
            The amount of time it takes to recover the cost of an investment or reach breakeven
          </span>
        </div>
      </VCardText>

      <VDivider class="custom-divider" />

      <VCardText class="px-6 py-4 section">
        <h6 class="section-title">
          Investment Summary
        </h6>

        <div class="info-row">
          <span class="label">Min DSCR</span>
          <span class="value left">
            The minimum DSCR observed across the project period, indicating the weakest coverage capacity
          </span>
        </div>

        <div class="info-row">
          <span class="label">LLCR</span>
          <span class="value left">Loan Life Coverage Ratio</span>
        </div>

        <div class="info-row">
          <span class="label">Default year</span>
          <span class="value left">
            Year in which default occurs based on DSCR threshold
          </span>
        </div>

        <div class="info-row">
          <span class="label">DSRA trigger</span>
          <span class="value left">
            Condition activating the use or replenishment of the DSRA account
          </span>
        </div>
      </VCardText>
    </template>
  </VCard>
</template>

<style scoped>
.projection-card {
  border-radius: 10px;
  background-color: rgb(var(--v-theme-surface)) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 10%);
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* ✅ 중간 제목: 검은색~회색 사이 */
.section-title {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 15px;
  font-weight: 600;
  margin-block-end: 10px;
}

.custom-divider {
  border: none !important;
  border-block-start: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
  opacity: 1 !important;
}

:root[data-theme="light"] .custom-divider {
  border-block-start-color: rgba(var(--v-theme-on-surface), 0.2) !important;
}

:root[data-theme="dark"] .custom-divider {
  border-block-start-color: rgba(var(--v-theme-on-surface), 0.1) !important;
}

/* 🔹 공통 구조 */
.info-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-block-end: 10px;
}

.label {
  flex: 0 0 180px;
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 600;
}

.value.right {
  flex: 1;
  color: rgba(var(--v-theme-on-surface), 0.9);
  text-align: end;
}

.value.left {
  flex: 1;
  color: rgba(var(--v-theme-on-surface), 0.85);
  line-height: 1.5;
  text-align: start;
}

/* 섹션 간 여백 */
.section + .section {
  margin-block-start: 8px;
}
</style>
