<template>
  <div class="max-w-5xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-4">
      Find a professional
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <input
        v-model="q"
        placeholder="Describe your problem or search"
        class="border rounded px-3 py-2 text-sm md:col-span-2"
      />
      <input
        v-model="location"
        placeholder="Location"
        class="border rounded px-3 py-2 text-sm"
      />
      <button
        @click="search"
        class="bg-blue-600 text-white text-sm rounded px-4 py-2"
      >
        Search
      </button>
    </div>
    <div v-if="loading" class="text-sm text-gray-500">
      Searching...
    </div>
    <div v-if="!loading && professionals.length === 0" class="text-sm text-gray-500">
      No professionals found.
    </div>
    <div class="grid gap-4">
      <ProfessionalCard
        v-for="p in professionals"
        :key="p.id"
        :professional="p"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfessionalCard from '~/../components/ProfessionalCard.vue'
import { useApi } from '~/../composables/useApi'

const q = ref('')
const location = ref('')
const professionals = ref<any[]>([])
const loading = ref(false)
const { request } = useApi()

const search = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (q.value) params.q = q.value
    if (location.value) params.location = location.value
    const query = new URLSearchParams(params as any).toString()
    const res: any = await request('/professionals' + (query ? '?' + query : ''), { method: 'GET' })
    professionals.value = res
  } catch (e) {
    professionals.value = []
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  search()
})
</script>
