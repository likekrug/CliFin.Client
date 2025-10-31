import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports, getPascalCaseRouteName } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite' // ✅ loadEnv 추가
import MetaLayouts from 'vite-plugin-vue-meta-layouts'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // ✅ .env 파일 읽기
  const env = loadEnv(mode, process.cwd(), '')

  // ✅ 반드시 return 해야 함!
  return {
    plugins: [
      VueRouter({
        getRouteName: routeNode => {
          // Convert pascal case to kebab case
          return getPascalCaseRouteName(routeNode)
            .replace(/([a-z\d])([A-Z])/g, '$1-$2')
            .toLowerCase()
        },
      }),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag =>
              tag === 'swiper-container'
              || tag === 'swiper-slide',
          },
        },
      }),
      vueJsx(),
      vuetify({
        styles: {
          configFile: 'src/assets/styles/variables/_vuetify.scss',
        },
      }),
      MetaLayouts({
        target: './src/layouts',
        defaultLayout: 'default',
      }),
      Components({
        dirs: ['src/@core/components', 'src/views/demos', 'src/components'],
        dts: true,
        resolvers: [
          componentName => {
            if (componentName === 'VueApexCharts')
              return { name: 'default', from: 'vue3-apexcharts', as: 'VueApexCharts' }
          },
        ],
      }),
      AutoImport({
        imports: ['vue', VueRouterAutoImports, '@vueuse/core', '@vueuse/math', 'vue-i18n', 'pinia'],
        dirs: [
          './src/@core/utils',
          './src/@core/composable/',
          './src/composables/',
          './src/utils/',
          './src/plugins/*/composables/*',
        ],
        vueTemplate: true,
        ignore: ['useCookies', 'useStorage'],
      }),
      svgLoader(),
    ],

    define: {
      'process.env': {},

      // ✅ .env 값 define에 주입
      'VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@themeConfig': fileURLToPath(new URL('./themeConfig.ts', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/assets/styles/', import.meta.url)),
        '@configured-variables': fileURLToPath(
          new URL('./src/assets/styles/variables/_template.scss', import.meta.url),
        ),
        '@db': fileURLToPath(new URL('./src/plugins/fake-api/handlers/', import.meta.url)),
        '@api-utils': fileURLToPath(new URL('./src/plugins/fake-api/utils/', import.meta.url)),
      },
    },

    build: {
      chunkSizeWarningLimit: 5000,
    },

    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue'],
    },
  }
})
