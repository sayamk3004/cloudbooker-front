<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-4">
      Admin dashboard
    </h1>
    <div v-if="loading" class="text-sm text-gray-500">
      Loading...
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="border rounded p-3 text-sm">
        <div class="text-xs text-gray-500">Total users</div>
        <div class="text-xl font-semibold">{{ stats.total_users }}</div>
      </div>
      <div class="border rounded p-3 text-sm">
        <div class="text-xs text-gray-500">Professionals</div>
        <div class="text-xl font-semibold">{{ stats.total_professionals }}</div>
      </div>
      <div class="border rounded p-3 text-sm">
        <div class="text-xs text-gray-500">Customers</div>
        <div class="text-xl font-semibold">{{ stats.total_customers }}</div>
      </div>
      <div class="border rounded p-3 text-sm">
        <div class="text-xs text-gray-500">Appointments</div>
        <div class="text-xl font-semibold">{{ stats.total_appointments }}</div>
      </div>
      <div class="border rounded p-3 text-sm">
        <div class="text-xs text-gray-500">Revenue</div>
        <div class="text-xl font-semibold">{{ stats.total_revenue }}</div>
      </div>
    </div>
    <div class="mt-6 flex gap-4 text-sm">
      <NuxtLink to="/admin/users" class="text-blue-600">Manage users</NuxtLink>
      <NuxtLink to="/admin/categories" class="text-blue-600">Manage categories</NuxtLink>
      <NuxtLink to="/admin/tickets" class="text-blue-600">Support tickets</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})

const loading = ref(false)
const stats = ref<any>({
  total_users: 0,
  total_professionals: 0,
  total_customers: 0,
  total_appointments: 0,
  total_revenue: 0
})
const { request } = useApi()

const load = async () => {
  loading.value = true
  try {
    const res: any = await request('/admin/dashboard', { method: 'GET' })
    stats.value = res
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})
</script>
