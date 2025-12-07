<template>
  <div class="max-w-5xl mx-auto mt-10 px-4">
    <h1 class="text-3xl font-semibold text-center text-blue-800 mb-8">My Bookings</h1>

    <div v-if="loading" class="text-lg text-gray-500 text-center">
      Loading your bookings...
    </div>
    <div v-else-if="appointments.length === 0" class="text-lg text-gray-500 text-center">
      No bookings found.
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="apt in appointments" :key="apt.id"
        class="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-semibold text-xl text-blue-700">{{ formatDate(apt.datetime) }}</div>
            <div class="text-sm text-gray-600">Status: <span :class="statusClass(apt.status)">{{ apt.status }}</span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600 mr-2">Rating:</span>
            <div class="flex items-center">
              <span v-for="n in 5" :key="n" class="star" :class="{ 'text-yellow-500': apt.rating >= n }">
                ★
              </span>
            </div>
          </div>
        </div>

        <div class="mt-4 text-gray-700">
          <p><strong>Professional:</strong> {{ apt.professional.name }}</p>
          <p><strong>Service:</strong> {{ apt.service }}</p>
          <p><strong>Price:</strong> {{ apt.professional.hourly_rate }} BDT</p>
        </div>

        <div class="mt-4 flex justify-between">
          <button v-if="isJoinMeetingAllowed(apt.datetime)" @click="joinMeeting(apt.id)"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Join Meeting
          </button>


          <!-- Countdown Button -->
          <button v-else @click="startCountdown(apt)"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            View Countdown
          </button>

          <!-- Cancel Booking Button -->
          <button v-if="apt.status !== 'CANCELED'" @click="cancelBooking(apt.id)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Cancel & Refund
          </button>

          <!-- View Booking Details -->
          <NuxtLink :to="`/booking/booking-details/` + apt.id"
            class="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/../composables/useApi'
import { useRouter } from 'vue-router'

const appointments = ref<any[]>([])
const loading = ref(false)
const { request } = useApi()
const router = useRouter()

const load = async () => {
  loading.value = true
  try {
    const res: any = await request('/appointments/professional', { method: 'GET' })
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

const statusClass = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return 'text-green-600'
    case 'CANCELED':
      return 'text-red-600'
    case 'PENDING':
      return 'text-yellow-500'
    default:
      return 'text-gray-500'
  }
}

const isJoinMeetingAllowed = (datetime: string) => {
  const appointmentTime = new Date(datetime).getTime()
  const currentTime = new Date().getTime()
  const timeDifference = Math.abs(appointmentTime - currentTime) // Absolute difference in time

  // Join is allowed only if within 30 minutes before or after the appointment
  return timeDifference <= 30 * 60 * 1000; // 30 minutes window in milliseconds
}

const startCountdown = (appointment: any) => {
  const startTime = new Date(appointment.datetime).getTime()
  const currentTime = new Date().getTime()
  const timeDiff = startTime - currentTime

  if (timeDiff <= 0) {
    return // No countdown needed if time is already passed
  }

  // Countdown logic (simplified)
  const countdownInterval = setInterval(() => {
    const diff = startTime - new Date().getTime()
    if (diff <= 0) {
      clearInterval(countdownInterval)
      // Update button or state for "Join"
    }
    // Update the countdown timer visually
  }, 1000)
}

const joinMeeting = (appointmentId: number) => {
  const appointment = appointments.value.find((apt: any) => apt.id === appointmentId)
  const meetingLink = 'https://meet.jit.si/appointment-' + appointment.id
  window.open(meetingLink, '_blank')
}

const cancelBooking = async (appointmentId: number) => {
  try {
    const response = await request(`/appointments/cancel/${appointmentId}`, { method: 'POST' })
    // Handle response (update state or show message)
  } catch (error) {
    console.error('Failed to cancel the booking', error)
  }
}

onMounted(() => {
  load()
})
</script>
