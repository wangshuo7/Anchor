import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    remember: false,
    username: '',
    password: ''
  }),
  actions: {
    setRemember(value: boolean) {
      this.remember = value
    },
    setUsername(username: string) {
      this.username = username
    },
    setPassword(password: string) {
      this.password = password
    }
  }
})
