<template>
  <div class="w-64 bg-blue-600 text-white p-6 shadow-lg">
    <h2 class="text-2xl font-semibold mb-8">Admin Panel</h2>
    <ul class="space-y-4">
      <li>
        <NuxtLink
          to="/admin/dashboard"
          class="text-lg hover:text-blue-200 transition duration-200"
        >
          Dashboard
        </NuxtLink>
      </li>
      
      <li>
        <NuxtLink
          to="/admin/categories"
          class="text-lg hover:text-blue-200 transition duration-200"
        >
          Categories
        </NuxtLink>
      </li>
      
      <li>
        <NuxtLink
          to="/admin/users"
          class="text-lg hover:text-blue-200 transition duration-200"
        >
          Users
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
  // You can add any reactive data or methods if needed
</script>

<style scoped>
/* You can add additional styling for the sidebar if necessary */
</style>
