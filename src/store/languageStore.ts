import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: 'zh' // zh、en、tw
  }),
  actions: {
    setLocale(newLocale: string) {
      this.locale = newLocale
    }
  }
})
