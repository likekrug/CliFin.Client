<script setup lang="ts">
import { ref } from 'vue'
import MapSearchDialog from './MapSearchDialog.vue' // 지도 검색 팝업 컴포넌트

// ----------------------
// 🔹 프로젝트 기본 정보
// ----------------------
const projectName = ref('')
const selectedType = ref<string | null>(null)

const assetTypes = ref([
  { id: 'coal', name: 'Coal' },
  { id: 'gas', name: 'Natural Gas' },
  { id: 'solar', name: 'Solar' },
  { id: 'wind', name: 'Wind' },
])

// ----------------------
// 🔹 Location (부모 컴포넌트의 상태)
// ----------------------
const location = ref<{ lat: number; lng: number } | null>(null)
const address = ref('')
const dialog = ref(false)

// ⭐️ [핵심] 자식 컴포넌트(팝업)에서 데이터가 전달될 때 실행되는 함수
const onSelectLocation = (coords: { lat: number; lng: number; address: string }) => {
  // 팝업에서 전달받은 좌표와 주소를 부모 상태에 저장
  location.value = { lat: coords.lat, lng: coords.lng }
  address.value = coords.address
  dialog.value = false // 팝업 닫기
}
</script>

<template>
  <!-- 🔹 Project Information -->
  <VCard
    flat
    variant="outlined"
    title="Project Information"
  >
    <VCardText>
      <VRow class="align-center no-gutters">
        <!-- Project Name -->
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="projectName"
            label="Project Name"
            density="comfortable"
          />
        </VCol>

        <!-- Asset Type -->
        <VCol
          cols="12"
          md="5"
          class="py-0 d-flex align-center"
        >
          <div class="text-body-1 text-high-emphasis me-3">
            <VIcon
              size="10"
              color="#B38CFF"
              class="me-2"
              icon="ri-circle-fill"
            />
            Asset Type :
          </div>
          <VRadioGroup
            v-model="selectedType"
            inline
            color="primary"
            class="mt-0"
          >
            <VRadio
              v-for="item in assetTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </VRadioGroup>
        </VCol>

        <!-- Create Button -->
        <VCol
          cols="12"
          md="3"
          class="text-end"
        >
          <VBtn
            color="primary"
            class="text-end py-0"
          >
            Create Project
          </VBtn>
        </VCol>

        <!-- 🔹 Location -->
        <VCol
          cols="12"
          class="mt-n2"
        >
          <div class="d-flex align-center text-body-1 text-high-emphasis mb-2">
            <VIcon
              size="18"
              color="primary"
              class="me-2"
              icon="ri-map-pin-line"
            />
            Location
          </div>

          <VRow
            class="align-center"
            no-gutters
          >
            <!-- Search Button -->
            <VCol
              cols="12"
              md="2"
            >
              <VBtn
                color="primary"
                variant="outlined"
                block
                height="46"
                @click="dialog = true"
              >
                Search
              </VBtn>
            </VCol>

            <!-- Coordinates -->
            <VCol
              cols="12"
              md="3"
              class="px-2"
            >
              <VTextField
                label="Coordinates"
                :model-value="location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ''"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <VCol
              cols="12"
              md="7"
            >
              <VTextField
                label="Address"
                :model-value="address"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </VCol>
          </VRow>

          <MapSearchDialog
            v-model="dialog"
            :init-location="location"
            :init-address="address"
            @select-location="onSelectLocation"
          />
        </VCol>
      </VRow>

      <!-- Gift wrap banner -->
      <div class="bg-var-theme-background rounded pa-5 mt-4">
        <h6 class="text-h6">
          Default values are provided, but you can modify them according to your project.
        </h6>
        <p class="my-2 text-body-1">
          By creating a project, you are deemed to have agreed to

          <a
            href="javascript:void(0)"
            class="font-weight-medium d-inline-block"
          >
            our terms of service.
          </a>
        </p>
      </div>
    </vcardtext>
  </VCard>

  <!-- 🔹 Project Details -->
  <VCard
    flat
    variant="outlined"
    class="mt-6"
    title="Asset Characteristics"
  >
    <VCardText>
      <div class="text-sm text-high-emphasis">
        <div class="d-flex justify-space-between mb-2">
          <div class="text-body-1 text-high-emphasis">
            Bag Total
          </div>
          <div class="text-body-1">
            ${{ }}.00
          </div>
        </div>

        <div class="d-flex justify-space-between mb-2">
          <div class="text-body-1 text-high-emphasis">
            Coupon Discount
          </div>
          <a
            href="javascript:void(0)"
            class="text-base d-inline-block"
          >
            Apply Coupon
          </a>
        </div>

        <div class="d-flex justify-space-between mb-2">
          <div class="text-body-1 text-high-emphasis">
            Order Total
          </div>
          <div class="text-body-1">
            ${{ }}.00
          </div>
        </div>

        <div class="d-flex justify-space-between">
          <div class="text-body-1 text-high-emphasis">
            Delivery Charges
          </div>
          <div class="d-flex gap-x-2">
            <div class="text-decoration-line-through text-body-1 text-disabled">
              $5.00
            </div>
            <VChip
              size="small"
              color="success"
            >
              Free
            </VChip>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
