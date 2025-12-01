import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as any
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role || null
  },
  actions: {
    async login(email: string, password: string) {
      const apiBase = useRuntimeConfig().public.apiBase
      const res: any = await $fetch(apiBase + '/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      this.token = res.token
      this.user = res.user
      if (process.client) {
        localStorage.setItem('token', this.token as string)
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    loadFromStorage() {
      if (process.client) {
        const t = localStorage.getItem('token')
        const u = localStorage.getItem('user')
        this.token = t
        this.user = u ? JSON.parse(u) : null
      }
    },
    logout() {
      this.token = null
      this.user = null
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
})
