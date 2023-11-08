import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
// 引入路由
import router from './router'
// 引入 element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入 vue-i18n
import i18n from './utils/i18n'
// 引入normalize.css
import 'normalize.css'
// 引入 pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.use(router).use(ElementPlus).use(i18n).use(pinia).mount('#app')
