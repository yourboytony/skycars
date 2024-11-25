<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Admin Panel</h1>
    
    <!-- User Management Section -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">User Management</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user._id">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.isAdmin ? 'Admin' : 'User' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="toggleAdmin(user)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  {{ user.isAdmin ? 'Remove Admin' : 'Make Admin' }}
                </button>
                <button 
                  @click="deleteUser(user._id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Forum Management Section -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Forum Management</h2>
      
      <!-- Create Category Form -->
      <form @submit.prevent="createCategory" class="mb-6">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Category Name</label>
            <input 
              v-model="newCategory.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              v-model="newCategory.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <button 
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Category
            </button>
          </div>
        </div>
      </form>

      <!-- Categories List -->
      <div class="space-y-4">
        <div v-for="category in categories" :key="category._id" 
             class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 class="font-medium">{{ category.name }}</h3>
            <p class="text-sm text-gray-500">{{ category.description }}</p>
          </div>
          <button 
            @click="deleteCategory(category._id)"
            class="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Weather API Key Section -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Weather API Key Management</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">API Key</label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <input 
              type="text" 
              v-model="apiKey" 
              class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Weather API Key"
            >
            <button 
              @click="updateApiKey"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const users = ref([])
const categories = ref([])
const apiKey = ref('')
const newCategory = ref({
  name: '',
  description: ''
})

// User Management Functions
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/users', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const toggleAdmin = async (user) => {
  try {
    await axios.patch(`http://localhost:3000/api/admin/users/${user._id}/toggle-admin`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchUsers()
  } catch (error) {
    console.error('Error toggling admin status:', error)
    alert('Failed to update user role')
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}

// Forum Management Functions
const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/forum/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const createCategory = async () => {
  try {
    await axios.post('http://localhost:3000/api/forum/categories', newCategory.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    newCategory.value = { name: '', description: '' }
    await fetchCategories()
  } catch (error) {
    console.error('Error creating category:', error)
    alert('Failed to create category')
  }
}

const deleteCategory = async (categoryId) => {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    await axios.delete(`http://localhost:3000/api/forum/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Failed to delete category')
  }
}

// Weather API Key Functions
const fetchApiKey = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/weather-api-key', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    apiKey.value = response.data.apiKey
  } catch (error) {
    console.error('Error fetching API key:', error)
  }
}

const updateApiKey = async () => {
  try {
    await axios.post('http://localhost:3000/api/admin/weather-api-key', 
      { apiKey: apiKey.value },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    alert('API key updated successfully')
  } catch (error) {
    console.error('Error updating API key:', error)
    alert('Failed to update API key')
  }
}

// Initialize
onMounted(async () => {
  await fetchUsers()
  await fetchCategories()
  await fetchApiKey()
})
</script>