<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-semibold mb-4"> Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Email</label>
          <input type="email" v-model="email" class="w-full px-4 py-2 border rounded" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-600">Password</label>
          <input type="password" v-model="password" class="w-full px-4 py-2 border rounded" />
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div v-if="error" class="mt-3 text-red-500 text-sm">{{ error }}</div>
      </form>
            <div class="mt-4 text-sm">
        No account?
        <NuxtLink to="/auth/register" class="text-blue-600">
          Register
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/../stores/auth'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')



const login = async () => {
  loading.value = true
  error.value = ''
  try {
    const apiBase = useRuntimeConfig().public.apiBase

    const response = await $fetch(apiBase + '/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    if (response.token) {
      auth.login(response.token, response.user, response.role)
      if (response.role === 'admin') {
        navigateTo('/admin/dashboard')
      } else if (response.role === 'professional') {
         navigateTo('/dashboard/professional')
      } else {
        navigateTo('/dashboard/customer')
      }
    } else {
      error.value = 'Invalid response from server'
    }
  } catch (err) {
    console.log(err)
    error.value = 'Invalid credentials'
  } finally {
    loading.value = false
  }
}

</script>
