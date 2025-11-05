// src/plugins/vuetify.ts
import { deepMerge } from '@antfu/utils'
import type { App } from 'vue'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { staticPrimaryColor, staticPrimaryDarkenColor, themes } from './theme'
import { themeConfig } from '@themeConfig'

// Styles
import { cookieRef } from '@/@layouts/stores/config'
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app: App) {
  // ✅ 쿠키 기반 테마 구성
  const cookieThemeValues = {
    defaultTheme: resolveVuetifyTheme(themeConfig.app.theme),
    themes: {
      light: {
        colors: {
          'primary': cookieRef('lightThemePrimaryColor', staticPrimaryColor).value,
          'primary-darken-1': cookieRef('lightThemePrimaryDarkenColor', staticPrimaryDarkenColor).value,
        },
      },
      dark: {
        colors: {
          'primary': cookieRef('darkThemePrimaryColor', staticPrimaryColor).value,
          'primary-darken-1': cookieRef('darkThemePrimaryDarkenColor', staticPrimaryDarkenColor).value,
        },
      },
    },
  }

  const optionTheme = deepMerge({ themes }, cookieThemeValues)

  // ✅ Vuetify 인스턴스 생성
  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults, // Materio 기본값 유지
    icons,
    theme: optionTheme,

    // ✅ 핵심 설정: 모든 overlay를 body로 teleport
    display: {
      mobileBreakpoint: 'sm',
      thresholds: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    },

    // 👇 Vuetify 내부 설정 override
    blueprint: {
      defaults: {
        global: {
          attach: 'body',
        },
      },
    },
  })

  app.use(vuetify)
}
