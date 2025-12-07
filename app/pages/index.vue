<template>
  <div class="max-w-5xl mx-auto mt-12 px-4">
    <!-- Main Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-semibold mb-3">
        Find the right professional in seconds
      </h1>
      <p class="text-gray-600 text-sm">
        Describe your problem in your own words, and we will suggest the best matching experts based on specialty, category, and reviews.
      </p>
    </div>

    <!-- AI Match Input Section -->
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
      
      <!-- Advanced Search Filters (Initially hidden) -->
      <div v-if="advancedSearchVisible" class="mt-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Category Filter -->
          <div>
            <label class="block text-sm mb-2">Category</label>
            <select
              v-model="category_id"
              class="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              <!-- Categories will be populated dynamically -->
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Subcategory Filter -->
          <div>
            <label class="block text-sm mb-2">Subcategory</label>
            <select
              v-model="subcategory_id"
              class="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select subcategory</option>
              <!-- Subcategories will be populated dynamically -->
              <option v-for="subcategory in subcategories" :key="subcategory.id" :value="subcategory.id">
                {{ subcategory.name }}
              </option>
            </select>
          </div>

          <!-- Location Filter -->
          <div>
            <label class="block text-sm mb-2">Location</label>
            <input
              v-model="location"
              placeholder="Enter location"
              class="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <!-- Price Range Filters -->
          <div>
            <label class="block text-sm mb-2">Price Range</label>
            <div class="flex gap-3">
              <input
                v-model="min_price"
                placeholder="Min Price"
                class="w-full border rounded px-3 py-2 text-sm"
                type="number"
              />
              <input
                v-model="max_price"
                placeholder="Max Price"
                class="w-full border rounded px-3 py-2 text-sm"
                type="number"
              />
            </div>
          </div>

          <!-- Hourly Rate Filters -->
          <div>
            <label class="block text-sm mb-2">Hourly Rate</label>
            <div class="flex gap-3">
              <input
                v-model="hourly_rate_min"
                placeholder="Min Hourly Rate"
                class="w-full border rounded px-3 py-2 text-sm"
                type="number"
              />
              <input
                v-model="hourly_rate_max"
                placeholder="Max Hourly Rate"
                class="w-full border rounded px-3 py-2 text-sm"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 items-center">
        <!-- Search Button -->
        <button
          @click="runAiMatch"
          class="bg-blue-600 text-white text-sm rounded px-4 py-2"
          :disabled="loading || !prompt"
        >
          {{ loading ? 'Finding matches...' : 'Find my match' }}
        </button>
        
        <!-- Toggle Advanced Search Filters -->
        <button
          @click="toggleAdvancedSearch"
          class="text-sm text-blue-600"
        >
          Or use advanced search
        </button>
      </div>
      
      <div v-if="error" class="mt-2 text-xs text-red-600">
        {{ error }}
      </div>
    </div>

    <!-- Suggested Specialty -->
    <div v-if="specialty" class="mb-3 text-sm">
      Suggested specialty:
      <span class="font-semibold">{{ specialty }}</span>
    </div>

    <!-- AI Match Results -->
    <div v-if="results?.length > 0" class="space-y-3">
      <ProfessionalCard
        v-for="pro in results"
        :key="pro.id"
        :professional="pro"
      />
    </div>

    <!-- No Results Message -->
    <div v-else-if="ranOnce && !loading" class="text-sm text-gray-500">
      No matches found. Try describing your issue differently or go to advanced search.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfessionalCard from '~/../components/ProfessionalCard.vue'
import { useApi } from '~/../composables/useApi'

const prompt = ref('')
const loading = ref(false)
const error = ref('')
const specialty = ref<string | null>(null)
const results = ref<any[]>([])
const ranOnce = ref(false)
const q = ref('')
const location = ref('')
const category_id = ref(null)
const subcategory_id = ref(null)
const min_price = ref(null)
const max_price = ref(null)
const hourly_rate_min = ref(null)
const hourly_rate_max = ref(null)
const advancedSearchVisible = ref(false)  // Control visibility of advanced search filters
const categories = ref<any[]>([])  // Categories to be fetched from the API
const subcategories = ref<any[]>([]) // Subcategories to be fetched from the API
const { request } = useApi()

const fetchCategories = async () => {
  const config = useRuntimeConfig()
  categories.value = await $fetch(config.public.apiBase + '/admin/categories')
}

const fetchSubcategories = async () => {
  if (!category_id.value) return
  const config = useRuntimeConfig()
  subcategories.value = await $fetch(config.public.apiBase + `/admin/categories/${category_id.value}/subcategories`)
}


// Fetch categories and subcategories when the component is mounted
onMounted(() => {
  fetchCategories()
  fetchSubcategories()
})

// Function to toggle the visibility of advanced search filters
const toggleAdvancedSearch = () => {
  advancedSearchVisible.value = !advancedSearchVisible.value
}

// Function to run AI Match (based on user query)
const runAiMatch = async () => {
  if (!prompt.value) return
  loading.value = true
  error.value = ''
  specialty.value = null
  results.value = []
  try {
    const res: any = await request('/ai-match', {
      method: 'POST',
      body: { query: prompt.value, category_id: category_id.value, subcategory_id: subcategory_id.value, location: location.value, min_price: min_price.value, max_price: max_price.value, hourly_rate_min: hourly_rate_min.value, hourly_rate_max: hourly_rate_max.value }
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

// Function to search professionals based on advanced filters
const search = async () => {
  loading.value = true
  try {
    const params: any = {
      q: q.value,
      location: location.value,
      category_id: category_id.value,
      subcategory_id: subcategory_id.value,
      min_price: min_price.value,
      max_price: max_price.value,
      hourly_rate_min: hourly_rate_min.value,
      hourly_rate_max: hourly_rate_max.value,
    }
    const query = new URLSearchParams(params as any).toString()
    const res: any = await request('/professionals' + (query ? '?' + query : ''), { method: 'GET' })
    results.value = res
  } catch (e) {
    results.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optional: you can add animations for showing/hiding the advanced search form */
</style>
