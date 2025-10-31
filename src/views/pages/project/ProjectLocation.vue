<script setup lang="ts">
import { ref } from 'vue'
import MapSearchDialog from './MapSearchDialog.vue'

const location = ref<{ lat: number; lng: number } | null>(null)
const address = ref('')
const dialog = ref(false)

const onSelectLocation = (coords: { lat: number; lng: number; address: string }) => {
  location.value = { lat: coords.lat, lng: coords.lng }
  address.value = coords.address
  dialog.value = false
}
</script>

<template>
  <div>
    <h6 class="text-h6 mb-4">
      Location
    </h6>

    <VRow class="align-center">
      <VCol
        cols="12"
        md="3"
      >
        <VBtn
          color="primary"
          variant="outlined"
          block
          @click="dialog = true"
        >
          Search
        </VBtn>
      </VCol>

      <VCol
        cols="12"
        md="9"
      >
        <VTextField
          label="Selected Coordinates"
          :model-value="location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ''"
          readonly
          variant="outlined"
          density="comfortable"
        />

        <VTextField
          label="Selected Address"
          :model-value="address"
          readonly
          variant="outlined"
          density="comfortable"
          class="mt-3"
        />
      </VCol>
    </VRow>

    <MapSearchDialog
      v-model="dialog"
      @select-location="onSelectLocation"
    />
  </div>
</template>
