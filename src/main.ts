import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

const script = document.createElement('script')

script.src = `https://maps.googleapis.com/maps/api/js?key=${
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
}&libraries=places&v=weekly&language=en&region=US`
script.async = true
script.defer = true
document.head.appendChild(script)

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
