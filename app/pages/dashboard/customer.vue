<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-4">
      My appointments
    </h1>
    <div v-if="loading" class="text-sm text-gray-500">
      Loading...
    </div>
    <div v-else-if="appointments.length === 0" class="text-sm text-gray-500">
      No appointments yet.
    </div>
    <div class="grid gap-3">
      <div
        v-for="apt in appointments"
        :key="apt.id"
        class="border rounded p-3 text-sm flex items-center justify-between"
      >
        <div>
          <div>
            Date: {{ formatDate(apt.datetime) }}
          </div>
          <div class="text-xs text-gray-500">
            Status: {{ apt.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useApi } from '~/../composables/useApi'



const appointments = ref<any[]>([])
const loading = ref(false)
const { request } = useApi()

const load = async () => {
  loading.value = true
  try {
    const res: any = await request('/appointments/my', { method: 'GET' })
    appointments.value = res
  } catch (e) {
    appointments.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (d: string) => {
  return new Date(d).toLocaleString()
}

onMounted(() => {
  load()
})
</script>
