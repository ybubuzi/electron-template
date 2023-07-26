import { createApp } from 'vue'
import App from './App.vue'
import pinia, { initIpcStore } from './store'


const app = createApp(App)
app.use(pinia)
app.mount('#app')
initIpcStore()

