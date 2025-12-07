<template>
  <div class="max-w-5xl mx-auto mt-10 px-4">
    <h1 class="text-3xl font-semibold text-center text-blue-800 mb-8">Booking Details</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-lg text-gray-500 text-center">Loading...</div>

    <!-- Booking Information -->
    <div v-else>
      <div class="bg-white shadow-lg rounded-lg p-6">
        <!-- Booking Info -->
        <div class="font-semibold text-xl text-blue-700 mb-4">{{ booking.datetime }}</div>

        <!-- Status -->
        <div class="text-sm text-gray-600 mb-4">
          <strong>Status:</strong> <span :class="statusClass(booking.status)" class="font-semibold">{{ booking.status
            }}</span>
        </div>

        <!-- Professional Info -->
        <div class="mt-4 text-gray-700">
          <div>
            <strong>Professional:</strong>
            <span class="text-blue-600">{{ booking.professional.name }}</span>
          </div>
          <div>
            <strong>Specialty:</strong>
            <span>{{ booking.professional.specialty }}</span>
          </div>
          <div v-if="booking.professional.bio">
            <strong>Bio:</strong>
            <p class="text-sm">{{ booking.professional.bio }}</p>
          </div>
        </div>

        <!-- Service and Price -->
        <div class="mt-4 text-gray-700">
          <p><strong>Service:</strong> {{ booking.service }}</p>
          <p><strong>Price:</strong> {{ booking.professional.hourly_rate }} BDT</p>
        </div>

        <!-- Professional Availability -->
        <div class="mt-4 text-gray-700">
          <p><strong>Available from:</strong> {{ booking.professional.available_start }} to {{
            booking.professional.available_end }}</p>
        </div>

        <!-- Transaction Details (if any) -->
        <div v-if="booking.transactions.length > 0" class="mt-4">
          <h3 class="text-lg font-semibold text-gray-800">Transaction Details</h3>
          <div v-for="(transaction, index) in booking.transactions" :key="index" class="border-t pt-4">
            <div>
              <strong>Transaction ID:</strong> {{ transaction.transaction_id }}
            </div>
            <div>
              <strong>Status:</strong> {{ transaction.status }}
            </div>
            <div>
              <strong>Amount:</strong> {{ transaction.amount }} BDT
            </div>
          </div>
        </div>

        <!-- Join Meeting or Countdown -->
        <div v-if="booking.status === 'CONFIRMED'" class="mt-4 flex justify-between">
          <button v-if="isBookingTime(booking.datetime)" @click="joinMeeting"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Join Meeting</button>
          <button v-else @click="startCountdown"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">View Countdown</button>
        </div>
        <button v-if="booking.status === 'CONFIRMED'" @click="markAsCompleted(booking.id)"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Mark as Completed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/../composables/useApi'

const booking = ref<any>(null)
const loading = ref(true)
const { request } = useApi()
const route = useRoute()
const id = route.params.id

// Load booking details
const load = async () => {
  try {
    const res: any = await request(`/appointments/${id}`, { method: 'GET' })
    console.log(res)
    booking.value = res
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const isBookingTime = (datetime: string) => {
  return new Date(datetime).getTime() <= new Date().getTime()
}

const startCountdown = () => {
  // Add countdown logic here
}

const joinMeeting = () => {
  const meetingLink = 'https://meet.jit.si/appointment-' + booking.value.id
  window.open(meetingLink, '_blank')
}

const statusClass = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return 'text-green-600'
    case 'PENDING':
      return 'text-yellow-600'
    case 'CANCELED':
      return 'text-red-600'
    default:
      return 'text-gray-500'
  }
}

const markAsCompleted = async (bookingId: number) => {
  try {
    const response = await request(`/appointments/complete/${bookingId}`, { method: 'POST' })
  } catch (error) {
    console.log('Error marking appointment as completed', error)
  }
}
onMounted(() => {
  load()
})
</script>

<style scoped>
.star {
  font-size: 1.5rem;
  color: gray;
}
</style>
