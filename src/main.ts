import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// ✅ Google Maps API 로드
// const script = document.createElement('script')

// script.src = `https://maps.googleapis.com/maps/api/js?key=${
//   import.meta.env.VITE_GOOGLE_MAPS_API_KEY
// }&libraries=places&v=weekly&language=en&region=US`
// script.async = true
// script.defer = true
// document.head.appendChild(script)

// ✅ 앱 생성
const app = createApp(App)

// ✅ Materio 플러그인 등록
registerPlugins(app)

// ✅ 앱 마운트
app.mount('#app')
