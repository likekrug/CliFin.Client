<template>
  <div>
    <p class="text-body-1 mb-2">
      🧾 Default Check tab content
    </p>

    <VTimeline
      align="start"
      side="end"
      density="compact"
      line-thickness="1"
      class="v-timeline--variant-outlined"
    >
      <VTimelineItem
        icon="ri-checkbox-circle-line"
        icon-color="success"
        fill-dot
        size="20"
      >
        <div class="text-caption text-uppercase text-success">
          Sender
        </div>
        <div class="app-timeline-title">
          Veronica Herman
        </div>
        <div class="text-body-2">
          162 Windsor, California(CA), 95492
        </div>
      </VTimelineItem>

      <VTimelineItem
        icon="ri-map-pin-line"
        icon-color="primary"
        fill-dot
        size="20"
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
</template>
