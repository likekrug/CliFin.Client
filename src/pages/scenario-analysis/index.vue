<script setup lang="ts">
const currentTab = ref('New')
const tabsData = ['Create Scenario', 'Result', 'Default Check']
</script>

<template>
  <VCard>
    <VTabs
      v-model="currentTab"
      grow
      class="disable-tab-transition custom-tab-bar"
    >
      <VTab
        v-for="(tab, index) in tabsData"
        :key="index"
        class="custom-tab"
      >
        {{ tab }}
      </VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="text-body-2 mb-1">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="text-body-2">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider
              class="my-4"
              style="border-style: dashed;"
            />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="text-body-2 mb-1">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="text-body-2">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="text-body-2">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="text-body-2">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider
              class="my-4"
              style="border-style: dashed;"
            />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="text-body-2">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="text-body-2">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="text-body-2">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="text-body-2">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider
              class="my-4"
              style="border-style: dashed;"
            />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="text-body-2">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="text-body-2">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>

<style scoped>
.custom-tab-bar {
  align-items: center !important;
  min-block-size: 72px; /* Baseline 헤더보다 살짝 높음 */
}

.custom-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 72px;
  color: rgba(var(--v-theme-on-surface), 0.87) !important;
  font-size: 1.25rem; /* ≈ 20px */
  line-height: 1;
  text-transform: none;
}

/* 활성 탭 시 색상 강조 */
.v-tab.v-tab--selected {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
