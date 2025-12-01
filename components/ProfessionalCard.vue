<template>
  <div class="border rounded-lg p-4 flex items-center justify-between">
    <div>
      <div class="font-semibold">
        {{ professional.name }}
      </div>
      <div class="text-sm text-gray-600">
        {{ professional.specialty || 'General' }}
      </div>
      <div class="text-xs text-gray-500">
        {{ professional.location || 'No location set' }}
      </div>
    </div>
    <NuxtLink
      :to="`/professionals/${professional.id}`"
      class="text-sm text-blue-600"
    >
      View profile
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ professional: any }>()
</script>
