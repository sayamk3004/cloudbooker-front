<template>
  <div>
    <NuxtRouteAnnouncer />
    <Navbar />
    <div class="flex-1 p-6">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
<script setup>
import Navbar from '~/../components/Navbar.vue'
import { onBeforeMount } from 'vue'
import { useAuthStore } from '~/../stores/auth'
const authStore = useAuthStore()
authStore.loadFromStorage()


</script>