import { useAuthStore } from '~/../stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (isAuthenticated() === false) {
    return navigateTo('/auth/login')
  }
  const auth = useAuthStore()
  
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (to.path.startsWith('/admin') && auth.userRole !== 'admin') {
    return navigateTo('/auth/login') 
  }

  if (to.path.startsWith('/dashboard/customer') && auth.userRole !== 'customer') {
    return navigateTo('/auth/login')  // If user is not a customer, redirect to login
  }
});

