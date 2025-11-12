<template>
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
  </div>
</template>
