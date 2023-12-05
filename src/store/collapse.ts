import { defineStore } from 'pinia'

export const useCollapseStore = defineStore('collapse', {
  state: () => ({
    collapse: false
  }),
  actions: {
    setLocale(newLocale: boolean) {
      this.collapse = newLocale
    }
  }
})
