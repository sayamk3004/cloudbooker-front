<template>
  <div class="max-w-5xl mx-auto mt-8 px-4">
    <h1 class="text-2xl font-semibold mb-4">
      Support tickets
    </h1>
    <div v-if="loading" class="text-sm text-gray-500">
      Loading...
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="t in tickets"
        :key="t.id"
        class="border rounded p-3 text-sm"
      >
        <div class="flex items-center justify-between mb-1">
          <div class="font-semibold">
            #{{ t.id }} {{ t.subject }}
          </div>
          <div class="text-xs text-gray-500">
            Status: {{ t.status }}
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-2">
          From: {{ t.user?.name }} ({{ t.user?.email }})
        </div>
        <div class="space-y-1 mb-2">
          <div
            v-for="r in t.replies"
            :key="r.id"
            class="text-xs"
          >
            <span class="font-semibold">{{ r.user?.name }}:</span>
            <span> {{ r.message }}</span>
          </div>
        </div>
        <form @submit.prevent="reply(t.id)" class="flex gap-2 mt-2">
          <input
            v-model="replyMessage[t.id]"
            placeholder="Reply..."
            class="flex-1 border rounded px-2 py-1 text-xs"
          />
          <button class="text-xs bg-blue-600 text-white rounded px-3 py-1">
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useApi } from '~/../composables/useApi'



const tickets = ref<any[]>([])
const loading = ref(false)
const replyMessage = reactive<{ [key: number]: string }>({})
const { request } = useApi()

const load = async () => {
  loading.value = true
  try {
    const res: any = await request('/tickets', { method: 'GET' })
    tickets.value = res
  } finally {
    loading.value = false
  }
}

const reply = async (id: number) => {
  const msg = replyMessage[id]
  if (!msg) return
  await request(`/tickets/${id}/reply`, {
    method: 'POST',
    body: { message: msg }
  })
  replyMessage[id] = ''
  await load()
}

onMounted(() => {
  load()
})
</script>
