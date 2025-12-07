<template>
  <nav class="w-full flex items-center justify-between px-6 py-4 border-b">
    <NuxtLink to="/" class="font-semibold text-lg">
      CloudAppointments
    </NuxtLink>
    <div class="flex items-center gap-4">
      <NuxtLink to="/search" class="text-sm">
        Find Professionals
      </NuxtLink>

      <!-- Conditional rendering based on authentication and user role -->
      <NuxtLink v-if="isAuthenticated && role === 'customer'" to="/dashboard/customer" class="text-sm">
        Dashboard
      </NuxtLink>
      <NuxtLink v-if="isAuthenticated && role === 'professional'" to="/dashboard/professional" class="text-sm">
        My Appointments
      </NuxtLink>
      <NuxtLink v-if="isAuthenticated && role === 'admin'" to="/admin" class="text-sm">
        Admin
      </NuxtLink>

      <!-- Login link for guests -->
      <NuxtLink v-if="!isAuthenticated" to="/auth/login" class="text-sm">
        Login
      </NuxtLink>

      <!-- Logout button for authenticated users -->
      <button
        v-if="isAuthenticated"
        @click="handleLogout"
        class="px-3 py-1 rounded text-sm border"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/../stores/auth'

const auth = useAuthStore()
console.log( auth);
const isAuthenticated = computed(() => auth.isAuthenticated)
const role = computed(() => auth.role)

const handleLogout = () => {
  auth.logout() 
  navigateTo('/')  
}
</script>
