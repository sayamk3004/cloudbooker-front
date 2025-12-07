<template>
  <div></div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '~/../stores/auth'


const auth = useAuthStore()

onMounted(() => {
  if (auth.role === 'professional') {
    navigateTo('/dashboard/professional')
  } else {
    navigateTo('/dashboard/customer')
  }
})
</script>
