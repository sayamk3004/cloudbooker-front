<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-4">
      Categories
    </h1>
    <form @submit.prevent="save" class="flex flex-col md:flex-row gap-2 mb-4">
      <input
        v-model="name"
        placeholder="Category name"
        class="border rounded px-3 py-2 text-sm flex-1"
      />
      <select v-model="parentId" class="border rounded px-3 py-2 text-sm">
        <option :value="null">No parent</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
      <button class="bg-blue-600 text-white text-sm rounded px-3 py-2">
        {{ editingId ? 'Update' : 'Add' }}
      </button>
    </form>
    <div v-if="loading" class="text-sm text-gray-500">
      Loading...
    </div>
    <ul v-else class="space-y-1 text-sm">
      <li
        v-for="c in categories"
        :key="c.id"
        class="border rounded px-3 py-2 flex items-center justify-between"
      >
        <div>
          <div class="font-semibold">{{ c.name }}</div>
          <div class="text-xs text-gray-500">
            Parent: {{ parentName(c.parent_id) }}
          </div>
        </div>
        <div class="flex gap-2 text-xs">
          <button class="text-blue-600" @click="edit(c)">Edit</button>
          <button class="text-red-600" @click="remove(c.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})

const categories = ref<any[]>([])
const loading = ref(false)
const name = ref('')
const parentId = ref<number | null>(null)
const editingId = ref<number | null>(null)
const { request } = useApi()

const load = async () => {
  loading.value = true
  try {
    const res: any = await request('/admin/categories', { method: 'GET' })
    categories.value = res
  } finally {
    loading.value = false
  }
}

const save = async () => {
  const body: any = {
    name: name.value,
    parent_id: parentId.value
  }
  if (editingId.value) {
    await request(`/admin/categories/${editingId.value}`, {
      method: 'PUT',
      body
    })
  } else {
    await request('/admin/categories', {
      method: 'POST',
      body
    })
  }
  name.value = ''
  parentId.value = null
  editingId.value = null
  await load()
}

const edit = (c: any) => {
  editingId.value = c.id
  name.value = c.name
  parentId.value = c.parent_id
}

const remove = async (id: number) => {
  if (!confirm('Delete this category?')) return
  await request(`/admin/categories/${id}`, { method: 'DELETE' })
  await load()
}

const parentName = (pid: number | null) => {
  if (!pid) return 'None'
  const p = categories.value.find((c) => c.id === pid)
  return p ? p.name : 'None'
}

onMounted(() => {
  load()
})
</script>
