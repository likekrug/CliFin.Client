<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useAssetStore } from '@/stores/asset.store'
import { useProjectDefaultStore } from '@/stores/projectDefault.store'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

const assetStore = useAssetStore()
const projectDefaultStore = useProjectDefaultStore()

onMounted(async () => {
  // 1) 자산 타입 불러오기
  await assetStore.load()

  // 2) 프로젝트 기본값 불러오기
  await projectDefaultStore.loadDefaultData()
})
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
