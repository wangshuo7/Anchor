import { defineStore } from 'pinia'
import { getLanguage, getCategory, getPlatform } from '../api/golbal'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    language: null,
    category: null,
    platform: null
  }),
  actions: {
    async setLanguage() {
      const res: any = await getLanguage({})
      this.language = res.data.list
    },
    async setCategory() {
      const res: any = await getCategory({})
      this.category = res.data.list
    },
    async setPlatform() {
      const res: any = await getPlatform({})
      this.platform = res.data.list
    }
  }
})
