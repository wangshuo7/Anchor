import { defineStore } from 'pinia'

export const useWindowSizeStore = defineStore('windowSize', {
  state: () => ({
    width: window.innerWidth
  }),
  actions: {
    updateWindowSize() {
      this.width = window.innerWidth
    }
  }
})
