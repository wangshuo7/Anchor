import { PluginOptions } from 'vue-toastification'

export const TostOptions: PluginOptions = {
  transition: 'Vue-Toastification__fade', // 动画 'Vue-Toastification__bounce' | 'Vue-Toastification__fade' | 'Vue-Toastification__slideBlurred' | 'my-custom-fade'
  maxToasts: 2, // 最多显示多少条toast [1,30]
  newestOnTop: true, // 最新的toast在上面
  hideProgressBar: true
}
