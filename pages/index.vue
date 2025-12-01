<template>
  <div class="max-w-5xl mx-auto mt-12 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-semibold mb-3">
        Find the right professional in seconds
      </h1>
      <p class="text-gray-600 text-sm">
        Describe your problem in your own words, and we will suggest the best matching experts based on specialty, category, and reviews.
      </p>
    </div>

    <div class="border rounded-lg p-4 mb-6">
      <label class="block text-sm mb-2">
        Tell us what you need help with
      </label>
      <textarea
        v-model="prompt"
        rows="3"
        class="w-full border rounded px-3 py-2 text-sm mb-3"
        placeholder="Example: I have a skin rash that won't go away for 2 weeks..."
      />
      <div class="flex gap-3 items-center">
        <button
          @click="runAiMatch"
          class="bg-blue-600 text-white text-sm rounded px-4 py-2"
          :disabled="loading || !prompt"
        >
          {{ loading ? 'Finding matches...' : 'Find my match' }}
        </button>
        <NuxtLink to="/search" class="text-sm text-gray-600">
          Or use advanced search
        </NuxtLink>
      </div>
      <div v-if="error" class="mt-2 text-xs text-red-600">
        {{ error }}
      </div>
    </div>

    <div v-if="specialty" class="mb-3 text-sm">
      Suggested specialty:
      <span class="font-semibold">{{ specialty }}</span>
    </div>

    <div v-if="results.length > 0" class="space-y-3">
      <ProfessionalCard
        v-for="pro in results"
        :key="pro.id"
        :professional="pro"
      />
    </div>

    <div v-else-if="ranOnce && !loading" class="text-sm text-gray-500">
      No matches found. Try describing your issue differently or go to advanced search.
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfessionalCard from '~/components/ProfessionalCard.vue'

const prompt = ref('')
const loading = ref(false)
const error = ref('')
const specialty = ref<string | null>(null)
const results = ref<any[]>([])
const ranOnce = ref(false)
const { request } = useApi()

const runAiMatch = async () => {
  if (!prompt.value) return
  loading.value = true
  error.value = ''
  specialty.value = null
  results.value = []
  try {
    const res: any = await request('/ai-match', {
      method: 'POST',
      body: { query: prompt.value }
    })
    specialty.value = res.specialty || null
    results.value = res.results || []
  } catch (e: any) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
    ranOnce.value = true
  }
}
</script>
