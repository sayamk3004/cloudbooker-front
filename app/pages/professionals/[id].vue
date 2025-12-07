<template>
  <div class="max-w-5xl mx-auto mt-8 px-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-sm text-gray-500 text-center">
      Loading profile...
    </div>
    <!-- No Professional Found -->
    <div v-else-if="!professional" class="text-sm text-gray-500 text-center">
      Professional not found.
    </div>
    <!-- Profile Content -->
    <div v-else class="grid gap-6 md:grid-cols-3">
      <div class="md:col-span-2">
        <!-- Professional Card -->
        <div :class="selectedProfessionalClass" class="bg-white shadow-lg rounded-lg p-6">
          <!-- Profile Header -->
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
              <img
                v-if="professional.profile_photo_url"
                :src="professional.profile_photo_url"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <div class="text-2xl font-semibold text-blue-800">
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

          <!-- Professional Bio -->
          <div class="text-sm mb-4 text-gray-700">
            <p v-if="professional.bio">{{ professional.bio }}</p>
            <p v-else>No bio provided.</p>
          </div>

          <!-- Reviews Section -->
          <div class="mt-6">
            <h2 class="text-lg font-semibold text-blue-800 mb-4">
              Reviews
            </h2>
            <div v-if="reviews.length === 0" class="text-xs text-gray-500">
              No reviews yet.
            </div>
            <div v-for="r in reviews" :key="r.id" class="border-b py-2 text-sm">
              <div class="font-semibold text-blue-600">
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
      </div>

      <!-- Booking Calendar -->
      <div class="md:col-span-1">
        <BookingCalendar 
          :professional-id="Number(route.params.id)" 
          :booked-slots="professional.booked_slots" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useApi } from '~/../composables/useApi'
  import BookingCalendar from '~/../components/BookingCalendar.vue'

  const route = useRoute()
  const professional = ref<any | null>(null)
  const reviews = ref<any[]>([])
  const loading = ref(false)
  const selectedProfessionalClass = ref('')

  const { request } = useApi()

  const loadData = async () => {
    loading.value = true
    try {
      const id = route.params.id
      const pro: any = await request(`/professionals/${id}`, { method: 'GET' })
      professional.value = pro

      // Highlight the professional if already booked
      if (pro.is_booked) {
        selectedProfessionalClass.value = 'bg-green-100 border-2 border-green-600'
      } else {
        selectedProfessionalClass.value = 'bg-white'
      }

      const rev: any = await request(`/reviews/${id}`, { method: 'GET' })
      reviews.value = rev
    } catch (e) {
      console.error('Error loading data', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadData()
  })
</script>
