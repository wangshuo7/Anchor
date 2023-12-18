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
// 引入 vue-toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { TostOptions } from './utils/toast'
// 引入 pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)
app.config.globalProperties.$axios = axios
// app.config.compilerOptions.isCustomElement = (tag) => /gc-\w*.test(tag)
app
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(Toast, TostOptions)
  .use(pinia)
  .mount('#app')
