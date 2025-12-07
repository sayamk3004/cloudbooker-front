<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-6">Categories</h1>
    <form @submit.prevent="save" class="flex flex-col md:flex-row gap-4 mb-6">
      <input
        v-model="name"
        placeholder="Category name"
        class="border rounded px-4 py-2 text-sm flex-1"
      />
      <select
        v-model="parentId"
        class="border rounded px-4 py-2 text-sm"
      >
        <option :value="null">No parent</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
      <button
        class="bg-blue-600 text-white text-sm rounded px-4 py-2"
        :disabled="loading"
      >
        {{ editingId ? 'Update' : 'Add' }}
      </button>
    </form>

    <div v-if="loading" class="text-sm text-gray-500 text-center mb-6">
      <span class="loader">Loading...</span>
    </div>

    <ul v-else class="space-y-4 text-sm">
      <li
        v-for="c in categories"
        :key="c.id"
        class="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-100"
      >
        <div>
          <div class="font-semibold text-lg">{{ c.name }}</div>
          <div class="text-xs text-gray-500">Parent: {{ parentName(c.parent_id) }}</div>
        </div>
        <div class="flex gap-2 text-xs">
          <button class="text-blue-600" @click="edit(c)">Edit</button>
          <button class="text-red-600" @click="remove(c.id)">Delete</button>
        </div>
        <!-- Display Subcategories if any -->
        <ul v-if="c.subcategories && c.subcategories.length > 0" class="ml-4 mt-2 space-y-2">
          <li
            v-for="sub in c.subcategories"
            :key="sub.id"
            class="border-l-4 border-blue-500 pl-4"
          >
            <div class="font-semibold">{{ sub.name }}</div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/../composables/useApi'
import { useAuthStore } from '~/../stores/auth'

definePageMeta({
  layout: 'admin',
})

const categories = ref([])
const loading = ref(false)
const name = ref('')
const parentId = ref(null)
const editingId = ref(null)
const { request } = useApi()
const authStore = useAuthStore()
const token = authStore.token

const headers = {
  'Content-Type': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
}

const apiBase = useRuntimeConfig().public.apiBase

// Load categories and their subcategories
const load = async () => {
  loading.value = true
  try {
    const res = await $fetch(apiBase + '/admin/categories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    // Assuming response is structured with subcategories
    categories.value = res.map(category => ({
      ...category,
      subcategories: categories.value.filter(sub => sub.parent_id === category.id)
    }))
  } catch (error) {
    console.log('Error loading categories:', error)
  } finally {
    loading.value = false
  }
}

const save = async () => {
  const body = {
    name: name.value,
    parent_id: parentId.value
  }
  if (editingId.value) {
    await $fetch(apiBase + '/admin/categories/' + editingId.value, {
      method: 'PUT',
      headers: headers,
      body: body
    })
  } else {
    await $fetch(apiBase + '/admin/categories', {
      method: 'POST',
      headers: headers,
      body: body
    })
  }
  name.value = ''
  parentId.value = null
  editingId.value = null
  await load()
}

const edit = (c) => {
  editingId.value = c.id
  name.value = c.name
  parentId.value = c.parent_id
}

const remove = async (id) => {
  if (!confirm('Delete this category?')) return
  await request(`/admin/categories/${id}`, { method: 'DELETE' })
  await load()
}

const parentName = (pid) => {
  if (!pid) return 'None'
  const p = categories.value.find((c) => c.id === pid)
  return p ? p.name : 'None'
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
