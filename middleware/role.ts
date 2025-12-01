export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.token) {
    auth.loadFromStorage()
  }
  if (to.path.startsWith('/admin') && auth.role !== 'admin') {
    return navigateTo('/')
  }
  if (to.path.startsWith('/dashboard/professional') && auth.role !== 'professional') {
    return navigateTo('/dashboard/customer')
  }
})
