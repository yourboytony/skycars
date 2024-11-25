<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold mb-6">Admin Dashboard</h2>

        <!-- User Management -->
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">User Management</h3>
            <span class="text-sm text-gray-500">Total Users: {{ users.length }}</span>
          </div>

          <!-- Users Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user._id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ new Date(user.createdAt).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button 
                      @click="viewUserDetails(user._id)"
                      class="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- User Details Modal -->
        <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-semibold mb-4">User Details</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <p class="mt-1">{{ selectedUser.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1">{{ selectedUser.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Password Hash</label>
                <p class="mt-1 font-mono text-sm">{{ selectedUser.password }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Created At</label>
                <p class="mt-1">{{ new Date(selectedUser.createdAt).toLocaleString() }}</p>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button 
                @click="selectedUser = null"
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const users = ref([])
const selectedUser = ref(null)

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    users.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const viewUserDetails = async (userId) => {
  try {
    const response = await axios.get(`/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    selectedUser.value = response.data
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script> 