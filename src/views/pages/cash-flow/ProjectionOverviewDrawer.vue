<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const close = () => emit('update:modelValue', false)
</script>

<template>
  <!-- ⭐ 데스크탑: 오른쪽 사이드 Drawer, 모바일: Fullscreen -->
  <VNavigationDrawer
    v-model="props.modelValue"
    location="right"
    :width="$vuetify.display.smAndDown ? '100%' : 850"
    temporary
    scrim
    style="block-size: 100vh !important;"
  >
    <!-- Header -->
    <div class="d-flex align-center justify-space-between px-6 py-4">
      <h5 class="text-h5 font-weight-bold">
        Projection Overview
      </h5>

      <VBtn
        icon
        variant="text"
        @click="close"
      >
        <VIcon
          icon="ri-close-line"
          size="22"
        />
      </VBtn>
    </div>

    <VDivider />

    <!--
      ===========================
      Capital Structure
      ============================
    -->
    <VCardText class="px-6 py-4 section">
      <h6 class="section-title">
        Capital Structure
      </h6>

      <div class="info-row">
        <span class="label">Debt amount</span>
        <span class="value right">Debt service</span>
      </div>

      <div class="info-row">
        <span class="label">Tenor / Margin</span>
        <span class="value right">Loan duration / interest margin</span>
      </div>

      <div class="info-row">
        <span class="label">EOD threshold / DSRA</span>
        <span class="value right">
          Event of Default threshold / Debt Service Reserve Account condition
        </span>
      </div>
    </VCardText>

    <VDivider />

    <!--
      ===========================
      Valuation Summary
      ============================
    -->
    <VCardText class="px-6 py-4 section">
      <h6 class="section-title">
        Valuation Summary
      </h6>

      <div class="info-row">
        <span class="label">Equity IRR</span>
        <span class="value right">
          Internal rate of return to equity investors
        </span>
      </div>

      <div class="info-row">
        <span class="label">Equity NPV</span>
        <span class="value right">
          Net present value of equity cash flows
        </span>
      </div>

      <div class="info-row">
        <span class="label">Payback period equity</span>
        <span class="value right">
          The amount of time it takes to recover the cost of an investment
          or reach breakeven
        </span>
      </div>
    </VCardText>

    <VDivider />

    <!--
      ===========================
      Investment Summary
      ============================
    -->
    <VCardText class="px-6 py-4 section">
      <h6 class="section-title">
        Investment Summary
      </h6>

      <div class="info-row">
        <span class="label">Min DSCR</span>
        <span class="value right">
          The minimum DSCR observed across the project period
        </span>
      </div>

      <div class="info-row">
        <span class="label">LLCR</span>
        <span class="value right">Loan Life Coverage Ratio</span>
      </div>

      <div class="info-row">
        <span class="label">Default year</span>
        <span class="value right">
          Year in which default occurs based on DSCR threshold
        </span>
      </div>

      <div class="info-row">
        <span class="label">DSRA trigger</span>
        <span class="value right">
          Condition activating the use or replenishment of the DSRA account
        </span>
      </div>
    </VCardText>
  </VNavigationDrawer>
</template>

<style scoped>
.section-title {
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 16px;
  font-weight: 600;
  margin-block-end: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-block-end: 10px;
}

.label {
  flex: 0 0 180px;
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-weight: 600;
}

.value.right {
  flex: 1;
  color: rgba(var(--v-theme-on-surface), 0.85);
  text-align: end;
}
</style>
