<template>
  <div class="flex min-h-screen bg-gray-100 w-100">
    <!-- Sidebar -->
    <div class="w-64 bg-blue-600 text-white p-6 shadow-lg">
      <h2 class="text-2xl font-semibold mb-8">Admin Panel</h2>
      <ul class="space-y-4">
        <li>
          <NuxtLink to="/admin/dashboard" class="text-lg hover:text-blue-200 transition duration-200">Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/categories" class="text-lg hover:text-blue-200 transition duration-200">Categories
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/users" class="text-lg hover:text-blue-200 transition duration-200">Users</NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-3xl font-semibold text-gray-900">Dashboard</h2>
        <div>
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Add New Data
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Total Users</h3>
          <p class="text-3xl font-semibold text-blue-600">{{ totalUsers }}</p>
          <p class="text-sm text-gray-500 mt-2">Total number of users registered</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Total Appointments</h3>
          <p class="text-3xl font-semibold text-green-600">{{ totalAppointments }}</p>
          <p class="text-sm text-gray-500 mt-2">Total number of appointments booked</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h3 class="text-lg font-medium text-gray-700 mb-2">Total Revenue</h3>
          <p class="text-3xl font-semibold text-yellow-600">${{ totalRevenue }}</p>
          <p class="text-sm text-gray-500 mt-2">Total revenue generated from appointments</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup >

import { ref, onMounted } from 'vue'

const totalUsers = ref(0)
const totalAppointments = ref(0)
const totalRevenue = ref(0)

const fetchDashboardData = async () => {
  const apiBase = useRuntimeConfig().public.apiBase;

  const response = await $fetch(apiBase + '/admin/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  totalUsers.value = response.total_users
  totalAppointments.value = response.total_appointments
  totalRevenue.value = response.total_revenue
}

onMounted(() => {
  fetchDashboardData()
})
</script>
