<template>
  <div class="max-w-5xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-4">
      Users
    </h1>
    <div v-if="loading" class="text-sm text-gray-500">
      Loading...
    </div>
    <table v-else class="w-full text-sm border">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-3 py-2 border">ID</th>
          <th class="px-3 py-2 border">Name</th>
          <th class="px-3 py-2 border">Email</th>
          <th class="px-3 py-2 border">Role</th>
          <th class="px-3 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td class="px-3 py-2 border">{{ u.id }}</td>
          <td class="px-3 py-2 border">{{ u.name }}</td>
          <td class="px-3 py-2 border">{{ u.email }}</td>
          <td class="px-3 py-2 border">{{ u.role }}</td>
          <td class="px-3 py-2 border">
            <button
              class="text-xs text-red-600"
              @click="ban(u.id)"
            >
              Deactivate
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})

const users = ref<any[]>([])
const loading = ref(false)
const { request } = useApi()

const load = async () => {
  loading.value = true
  try {
    const res: any = await request('/admin/users', { method: 'GET' })
    users.value = res
  } finally {
    loading.value = false
  }
}

const ban = async (id: number) => {
  if (!confirm('Deactivate this user?')) return
  await request(`/admin/users/${id}/ban`, { method: 'POST' })
  await load()
}

onMounted(() => {
  load()
})
</script>
