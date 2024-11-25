<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Access</h1>
        <button 
          @click="logout" 
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <!-- Admin Panel Content -->
      <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
        <!-- User Management -->
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">User Management</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user._id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
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

        <!-- Weather API Key -->
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Weather API Key</h2>
          <div class="flex gap-4">
            <input 
              v-model="apiKey"
              type="text"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter API Key"
            >
            <button 
              @click="updateApiKey"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>

        <!-- Forum Categories -->
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Forum Categories</h2>
          
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
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

// Redirect if not admin
if (!authStore.isAdmin) {
  router.push('/')
}

const users = ref([])
const categories = ref([])
const apiKey = ref('')
const newCategory = ref({
  name: '',
  description: ''
})

// User Management
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

// Weather API Key Management
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

// Forum Management
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

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  fetchUsers()
  fetchCategories()
  fetchApiKey()
})
</script> 