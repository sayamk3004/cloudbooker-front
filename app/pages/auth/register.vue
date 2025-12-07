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
        <div v-if="role === 'professional'">
          <label class="block text-sm mb-1">Category</label>
          <select v-model="category" @change="fetchSubcategories" class="w-full border rounded px-3 py-2 text-sm">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- Subcategory Selection -->
        <div v-if="role === 'professional' && subcategories.length > 0">
          <label class="block text-sm mb-1">Subcategory</label>
          <select v-model="subcategory" class="w-full border rounded px-3 py-2 text-sm">
            <option v-for="sub in subcategories" :key="sub.id" :value="sub.id">{{ sub.name }}</option>
          </select>
        </div>
        <div v-if="role === 'professional'">
          <label class="block text-sm mb-1">Hourly Rate</label>
          <input v-model="hourlyRate" type="number" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="role === 'professional'">
          <label class="block text-sm mb-1">Available Hours (Start)</label>
          <input v-model="availableStart" type="time" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="role === 'professional'">
          <label class="block text-sm mb-1">Available Hours (End)</label>
          <input v-model="availableEnd" type="time" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="role === 'professional'">
          <label class="block text-sm mb-1">Describe your specialty</label>
          <input v-model="specialty" type="textarea" class="w-full border rounded px-3 py-2 text-sm" />
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
        <button type="submit" class="w-full bg-blue-600 text-white rounded py-2 text-sm" :disabled="loading">
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
const category = ref('')
const subcategory = ref('')
const loading = ref(false)
const error = ref('')
const categories = ref([]) // All categories
const subcategories = ref([])
const hourlyRate = ref('')
const availableStart = ref('')
const availableEnd = ref('')
const specialty = ref('');

const fetchCategories = async () => {
  const config = useRuntimeConfig()
  categories.value = await $fetch(config.public.apiBase + '/admin/categories')
}

const fetchSubcategories = async () => {
  if (!category.value) return
  const config = useRuntimeConfig()
  subcategories.value = await $fetch(config.public.apiBase + `/admin/categories/${category.value}/subcategories`)
}

onMounted(() => {
  fetchCategories()
})

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
        category_id: category.value,
        subcategory_id: subcategory.value,
        hourly_rate: hourlyRate.value,  // Add hourly rate
        available_start: availableStart.value,  // Available start time
        available_end: availableEnd.value,  // Available end time
        password: password.value,
        password_confirmation: passwordConfirmation.value,
        specialty: specialty.value
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
