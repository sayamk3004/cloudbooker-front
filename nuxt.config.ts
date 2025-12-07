import ViteTsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  nitro: {
    compatibilityDate: '2025-12-06',
  },
  
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api'
    }
  },
  vite: {
    plugins: [ViteTsconfigPaths()] // This ensures that Vite resolves paths based on tsconfig
  }
})
