// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as any,
    userRole: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,  // Check if user is authenticated
    role: (state) => state.userRole,  // Get user role (admin or customer)
  },

  actions: {
    login(token: string, user: any, role: string) {
      this.token = token
      this.user = user
      this.userRole = role 

      if (process.client) {
        localStorage.setItem('token', token) 
        localStorage.setItem('user', JSON.stringify(user)) 
        localStorage.setItem('role', role) 
      }
    },

    loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        const role = localStorage.getItem('role')
        this.token = token
        this.user = user ? JSON.parse(user) : null
        this.userRole = role || null  // Load role from localStorage
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.userRole = null

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
      }
    },
  },
})
