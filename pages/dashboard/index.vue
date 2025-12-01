<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const auth = useAuthStore()

onMounted(() => {
  if (auth.role === 'professional') {
    navigateTo('/dashboard/professional')
  } else {
    navigateTo('/dashboard/customer')
  }
})
</script>
