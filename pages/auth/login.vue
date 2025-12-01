<template>
  <div class="flex items-center justify-center min-h-[70vh] px-4">
    <div class="w-full max-w-md border rounded-lg p-6">
      <h1 class="text-xl font-semibold mb-4">
        Login
      </h1>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="email" type="email" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input v-model="password" type="password" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
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

<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    if (auth.role === 'admin') {
      navigateTo('/admin')
    } else if (auth.role === 'professional') {
      navigateTo('/dashboard/professional')
    } else {
      navigateTo('/dashboard/customer')
    }
  } catch (e: any) {
    error.value = 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>
