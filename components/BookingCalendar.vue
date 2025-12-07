<template>
  <div>
    <div class="text-sm font-semibold mb-2">
      Available slots (next 7 days)
    </div>
    <div v-if="loading" class="text-sm text-gray-500 mb-2">
      Loading slots...
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      <button
        v-for="slot in slots"
        :key="slot"
        class="border rounded px-3 py-2 text-xs text-left hover:bg-blue-50"
        @click="selectSlot(slot)"
      >
        {{ formatSlot(slot) }}
      </button>
    </div>
    <div v-if="selected" class="mt-4 text-sm">
      Selected: <span class="font-semibold">{{ formatSlot(selected) }}</span>
    </div>
    <button
      v-if="selected"
      class="mt-3 bg-blue-600 text-white text-sm rounded px-4 py-2"
      @click="book"
      :disabled="booking"
    >
      {{ booking ? 'Booking...' : 'Book and pay' }}
    </button>
    <div v-if="message" class="mt-3 text-sm">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useApi } from '~/../composables/useApi'

  import { useAuthStore } from '~/../stores/auth'

const props = defineProps<{ professionalId: number }>()
const slots = ref<string[]>([])
const selected = ref<string | null>(null)
const loading = ref(false)
const booking = ref(false)
const message = ref('')
const { request } = useApi()
const auth = useAuthStore()

const loadSlots = async () => {
  loading.value = true
  try {
    const res: any = await request(`/appointments/availability/${props.professionalId}`, { method: 'GET' })
    slots.value = res.available_slots || []
  } catch (e) {
    slots.value = []
  } finally {
    loading.value = false
  }
}

const formatSlot = (slot: string) => {
  const d = new Date(slot)
  return d.toLocaleString()
}

const selectSlot = (slot: string) => {
  selected.value = slot
}

const book = async () => {
  if (!selected.value) return
  booking.value = true
  message.value = ''
  try {
    const res = await request('/appointments/book', {
      method: 'POST',
      body: {
        professional_id: props.professionalId,
        datetime: selected.value.replace('T', ' ').slice(0, 19)
      }
    })

    message.value = res.message || 'Appointment booked. Proceed to payment.'

    window.location.href = res.payment_url // Redirect to SSLCommerz payment URL
  } catch (e) {
    message.value = 'Unable to book this slot'
  } finally {
    booking.value = false
  }
}


onMounted(() => {
  loadSlots()
})
</script>
