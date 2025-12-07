import { useAuthStore } from '~/../stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const request = async (url: string, options: any = {}) => {
    const base = config.public.apiBase
    const headers: any = options.headers || {}
    
    if (auth.token) {
      headers.Authorization = 'Bearer ' + auth.token
      return await $fetch(base + url, { ...options, headers })
    } else {
      return await $fetch(base + url, { ...options });
    }

  }

  return { request }
}
