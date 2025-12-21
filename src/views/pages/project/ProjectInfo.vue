<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { nanoid } from 'nanoid'

import InformationDrawer from './InformationDrawer.vue'
import MapSearchDialog from './MapSearchDialog.vue'
import type { AssetItem, ProjectDefaultData } from '@/types/projectDefault.types'

import { useAssetStore } from '@/stores/asset.store'
import { useProjectDefaultStore } from '@/stores/projectDefault.store'
import { useProjectStore } from '@/stores/project.store'

import type { Project } from '@/types/project.types'
import { getCategories, getGroups } from '@/utils/projectDefault.helper'
import type { CategoryCode } from '@/types/category.types'

// ------------------------
// STORE
// ------------------------
const assetStore = useAssetStore()
const projectDefaultStore = useProjectDefaultStore()
const projectStore = useProjectStore()

assetStore.load()

// ------------------------
// 기본 Project 정보
// ------------------------
const projectName = ref('')
const projectNameError = ref('')

const selectedType = ref<keyof ProjectDefaultData>('coal')

// flat model (itemCode → value)
const model = ref<Record<string, number | boolean | null>>({})

// ------------------------
// 위치 정보
// ------------------------
const location = ref<{ lat: number; lng: number } | null>(null)
const address = ref('')
const locationError = ref('')
const dialog = ref(false)

const onSelectLocation = (coords: { lat: number; lng: number; address: string }) => {
  location.value = { lat: coords.lat, lng: coords.lng }
  address.value = coords.address
  locationError.value = ''
  dialog.value = false
}

// ------------------------
// 카테고리별 아코디언 상태 (동적)
// ------------------------
const expandedMap = reactive<Record<string, boolean>>({})

// ------------------------
// Drawer
// ------------------------
const isInfoDrawer = ref(false)

const drawerCategory = ref<CategoryCode>('C1')

const openDrawer = (category: CategoryCode) => {
  drawerCategory.value = category
  isInfoDrawer.value = true
}

// ------------------------
// default 데이터 로드
// ------------------------
onMounted(async () => {
  await projectDefaultStore.ensureDefaultData()

  model.value = projectDefaultStore.buildModel(selectedType.value)

  const cats = projectDefaultStore.getDefaultsByType(selectedType.value)?.categories ?? []

  cats.forEach(cat => {
    expandedMap[cat.categoryCode] = true
  })
})

// asset 변경 시
watch(selectedType, newVal => {
  model.value = projectDefaultStore.buildModel(newVal)

  const cats = projectDefaultStore.getDefaultsByType(newVal)?.categories ?? []

  Object.keys(expandedMap).forEach(k => delete expandedMap[k])
  cats.forEach(cat => {
    expandedMap[cat.categoryCode] = true
  })
})

// 현재 assetType 전체 구조
const currentAsset = computed(() => {
  return projectDefaultStore.getDefaultsByType(selectedType.value)
})

// ------------------------
// Validation / Formatter
// ------------------------
const validateItem = (value: any, item: any) => {
  if (value === null || value === '' || value === undefined)
    return true

  const num = Number(value)
  const min = Number(item.min)
  const max = Number(item.max)

  if (Number.isNaN(num))
    return false

  return num >= min && num <= max
}

const formatNumber = (value: any) => {
  if (value === null || value === undefined || value === '')
    return ''

  return Number(value).toLocaleString('en-US')
}

const parseNumber = (value: string) => {
  if (!value)
    return null

  return Number(String(value).replace(/,/g, ''))
}

// ------------------------
// Create Project
// ------------------------
const onCreateProject = () => {
  // 에러 초기화
  projectNameError.value = ''
  locationError.value = ''

  let hasError = false

  if (!projectName.value.trim()) {
    projectNameError.value = 'Project name is required'
    hasError = true
  }

  if (!location.value) {
    locationError.value = 'Location is required'
    hasError = true
  }

  if (hasError)
    return

  const project: Project = {
    id: nanoid(),
    name: projectName.value,
    assetType: selectedType.value,

    model: { ...model.value },
    location: location.value!,
    address: address.value,
    createdAt: new Date().toISOString(),
  }

  projectStore.addProject(project)

  // 초기화 (선택)
  projectName.value = ''
  projectNameError.value = ''
  location.value = null
  address.value = ''
}

const resetToDefault = (item: AssetItem) => {
  if (item.dataType === 'boolean') {
    model.value[item.itemCode] = Boolean(item.default)
  }
  else {
    const num = Number(item.default)

    model.value[item.itemCode] = Number.isNaN(num) ? null : num
  }
}
</script>

<template>
  <!-- 1) Project Info -->
  <VCard
    flat
    variant="outlined"
    class="mt-0"
  >
    <VCardItem class="py-4">
      <VCardTitle>Project Information</VCardTitle>
    </VCardItem>
    <VDivider />

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
            :error="!!projectNameError"
            :error-messages="projectNameError"
            @update:model-value="projectNameError = ''"
          />
        </VCol>

        <!-- Asset Type -->
        <VCol
          cols="12"
          md="5"
          class="py-0 d-flex align-center"
        >
          <div class="text-body-1 text-high-emphasis me-3">
            Asset Type :
          </div>
          <VRadioGroup
            v-model="selectedType"
            inline
            color="primary"
            class="mt-0"
          >
            <VRadio
              v-for="item in assetStore.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              class="me-4"
            />
          </VRadioGroup>
        </VCol>

        <!-- Create -->
        <VCol
          cols="12"
          md="3"
          class="text-end"
        >
          <VBtn
            color="primary"
            class="text-end py-0"
            @click="onCreateProject"
          >
            Create Project
          </VBtn>
        </VCol>

        <!-- Location -->
        <VCol
          cols="12"
          class="mt-n2"
        >
          <div class="d-flex align-center text-body-1 text-high-emphasis mb-2">
            <VIcon
              size="18"
              color="rgba(var(--v-theme-on-surface), 0.6)"
              class="me-2"
              icon="ri-map-pin-line"
            />
            Location
          </div>

          <VRow class="align-start">
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

            <VCol
              cols="12"
              md="3"
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
                :error="!!locationError"
                :error-messages="locationError"
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
    </VCardText>
  </VCard>

  <!-- 2) Category별 개별 아코디언 카드 -->
  <template
    v-for="cat in getCategories(currentAsset)"
    :key="cat.categoryCode"
  >
    <VCard
      flat
      variant="outlined"
      class="mt-3"
    >
      <VCardItem class="py-3">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <VCardTitle>
              {{ cat.categoryName }}
            </VCardTitle>

            <VAvatar
              color="warning"
              variant="tonal"
              size="28"
              class="cursor-pointer"
              @click="openDrawer(cat.categoryCode)"
            >
              <VIcon
                icon="ri-question-line"
                size="16"
              />
            </VAvatar>
          </div>

          <IconBtn
            :color="expandedMap[cat.categoryCode] ? 'primary' : 'default'"
            @click="expandedMap[cat.categoryCode] = !expandedMap[cat.categoryCode]"
          >
            <VIcon
              size="20"
              :icon="expandedMap[cat.categoryCode] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
            />
          </IconBtn>
        </div>
      </VCardItem>

      <VExpandTransition>
        <div v-show="expandedMap[cat.categoryCode]">
          <VDivider />
          <VCardText>
            <!-- 그룹 반복 -->
            <template
              v-for="grp in getGroups(cat)"
              :key="grp.groupCode"
            >
              <div class="mb-4">
                <div class="d-flex align-center text-body-1 mb-3">
                  <div class="vertical-bar me-2" /> {{ grp.groupName }}
                </div>

                <VRow>
                  <VCol
                    v-for="item in grp.items"
                    :key="item.itemCode"
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      :label="item.itemName"
                      :suffix="item.unit !== 'NaN' ? item.unit : ''"
                      :model-value="formatNumber(model[item.itemCode])"
                      :error="!validateItem(model[item.itemCode], item)"

                      :error-messages="
                        !validateItem(model[item.itemCode], item)
                          ? `${formatNumber(item.min)} ~ ${formatNumber(item.max)} ${
                            item.unit !== 'NaN' ? item.unit : ''
                          }`
                          : ''
                      "
                      hide-details="auto"
                      autocomplete="off"
                      @update:model-value="val => model[item.itemCode] = parseNumber(val)"
                    >
                      <!-- X 버튼: default 값으로 리셋 -->
                      <template #append-inner>
                        <VIcon
                          v-if="model[item.itemCode] !== item.default"
                          icon="ri-close-circle-line"
                          class="cursor-pointer"
                          size="18"
                          color="grey"
                          @click.stop="resetToDefault(item)"
                        />
                      </template>
                    </VTextField>
                  </VCol>
                </VRow>
              </div>
            </template>
          </VCardText>
        </div>
      </VExpandTransition>
    </VCard>
  </template>

  <!-- Drawer -->
  <InformationDrawer
    v-model="isInfoDrawer"
    :category="drawerCategory"
    :asset-type="selectedType"
  />
</template>
