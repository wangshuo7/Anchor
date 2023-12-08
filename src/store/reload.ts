import { defineStore } from 'pinia'

export const useReloadStore = defineStore('reload', {
  state: () => ({
    contentKey: 0
  }),
  actions: {
    incrementContentKey() {
      this.contentKey += 1
    }
  }
})
