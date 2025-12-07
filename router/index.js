// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/booking/booking-details/:id',
    name: 'booking-details', // Named route for easier reference
    component: () => import('~/pages/booking/booking-details/_id.vue'), // Lazy load the component
  },
  // Add other routes here as needed
]

const router = createRouter({
  history: createWebHistory(), // Use history mode for cleaner URLs
  routes, // Use the defined routes
})

export default router
