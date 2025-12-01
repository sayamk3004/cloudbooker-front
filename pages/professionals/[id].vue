<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">
    <div v-if="loading" class="text-sm text-gray-500">
      Loading profile...
    </div>
    <div v-else-if="!professional" class="text-sm text-gray-500">
      Professional not found.
    </div>
    <div v-else class="grid gap-6 md:grid-cols-3">
      <div class="md:col-span-2">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            <img
              v-if="professional.profile_photo_url"
              :src="professional.profile_photo_url"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <div class="text-xl font-semibold">
              {{ professional.name }}
            </div>
            <div class="text-sm text-gray-600">
              {{ professional.specialty || 'General' }}
            </div>
            <div class="text-xs text-gray-500">
              {{ professional.location || 'No location set' }}
            </div>
          </div>
        </div>
        <div class="text-sm mb-4">
          {{ professional.bio || 'No bio provided.' }}
        </div>
        <div class="mt-6">
          <h2 class="text-sm font-semibold mb-2">
            Reviews
          </h2>
          <div v-if="reviews.length === 0" class="text-xs text-gray-500">
            No reviews yet.
          </div>
          <div v-for="r in reviews" :key="r.id" class="border-b py-2 text-sm">
            <div class="font-semibold">
              {{ r.customer?.name || 'Anonymous' }}
            </div>
            <div class="text-xs text-yellow-500">
              Rating: {{ r.rating }}/5
            </div>
            <div class="text-xs mt-1">
              {{ r.comment }}
            </div>
          </div>
        </div>
      </div>
      <div class="md:col-span-1">
        <BookingCalendar :professional-id="Number(route.params.id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BookingCalendar from '~/components/BookingCalendar.vue'

const route = useRoute()
const professional = ref<any | null>(null)
const reviews = ref<any[]>([])
const loading = ref(false)
const { request } = useApi()

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const pro: any = await request(`/professionals/${id}`, { method: 'GET' })
    professional.value = pro
    const rev: any = await request(`/reviews/${id}`, { method: 'GET' })
    reviews.value = rev
  } catch (e) {
    professional.value = null
    reviews.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
