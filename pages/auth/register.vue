<template>
  <div class="flex items-center justify-center min-h-[70vh] px-4">
    <div class="w-full max-w-md border rounded-lg p-6">
      <h1 class="text-xl font-semibold mb-4">
        Register
      </h1>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Name</label>
          <input v-model="name" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input v-model="email" type="email" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm mb-1">Role</label>
          <select v-model="role" class="w-full border rounded px-3 py-2 text-sm">
            <option value="customer">Customer</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input v-model="password" type="password" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm mb-1">Confirm Password</label>
          <input v-model="passwordConfirmation" type="password" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm"
          :disabled="loading"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <div class="mt-4 text-sm">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-600">
          Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const name = ref('')
const email = ref('')
const role = ref<'customer' | 'professional'>('customer')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    const config = useRuntimeConfig()
    await $fetch(config.public.apiBase + '/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        role: role.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value
      }
    })
    navigateTo('/auth/login')
  } catch (e: any) {
    error.value = 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
