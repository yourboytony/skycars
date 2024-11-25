<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Profile section -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img 
                :src="user?.photoURL || 'https://via.placeholder.com/40'" 
                alt="Profile"
                class="h-12 w-12 rounded-full"
              >
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ user?.displayName }}</h2>
              <p class="text-gray-500">{{ user?.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <router-link 
          v-for="action in quickActions" 
          :key="action.name"
          :to="action.path"
          class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="text-lg font-medium text-gray-900">
              {{ action.name }}
            </div>
            <div class="mt-1 text-sm text-gray-500">
              {{ action.description }}
            </div>
          </div>
        </router-link>
      </div>

      <!-- Recent activity -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
          <div class="mt-4 space-y-4">
            <div v-if="activities.length === 0" class="text-gray-500">
              No recent activity
            </div>
            <div 
              v-for="activity in activities" 
              :key="activity.id"
              class="flex items-center space-x-3 text-sm"
            >
              <span class="text-gray-500">{{ activity.date }}</span>
              <span>{{ activity.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const activities = ref([])

    const quickActions = [
      {
        name: 'Flight Planning',
        path: '/flight-planning',
        description: 'Plan your next flight'
      },
      {
        name: 'Community Chat',
        path: '/chat',
        description: 'Connect with other pilots'
      },
      {
        name: 'Forum',
        path: '/forum',
        description: 'Join the discussion'
      }
    ]

    onMounted(() => {
      // Here you would typically fetch user activities
      activities.value = []
    })

    return {
      user: authStore.user,
      quickActions,
      activities
    }
  }
}
</script> 