import { defineStore } from 'pinia'

export const usePageCacheStore = defineStore('page', {
  state: () => ({
    pageCache: ['']
  }),
  actions: {
    addCachedPage(page: string) {
      if (!this.pageCache.includes(page)) {
        this.pageCache.push(page)
      }
    },
    removeCachedPage(page: string) {
      const index = this.pageCache.indexOf(page)
      if (index !== -1) {
        this.pageCache.splice(index, 1)
      }
    }
  },
  getters: {
    getCachedPages():any {
      const transformedArray = this.pageCache.map((item) => {
        if (item.startsWith('/')) {
          return item.charAt(1).toUpperCase() + item.slice(2)
        } else {
          return item.charAt(0).toUpperCase() + item.slice(1)
        }
      })
      return transformedArray
    }
  }
})
