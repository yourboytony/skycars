<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Create New Topic</h1>
        </div>

        <form @submit.prevent="createTopic" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select 
              v-model="newTopic.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              v-model="newTopic.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Content</label>
            <textarea 
              v-model="newTopic.content"
              rows="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <router-link 
              to="/forum"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </router-link>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Creating...' : 'Create Topic' }}
            </button>
          </div>
        </form>
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
const categories = ref([])
const isLoading = ref(false)

const newTopic = ref({
  category: '',
  title: '',
  content: ''
})

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/forum/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const createTopic = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  isLoading.value = true
  try {
    await axios.post('http://localhost:3000/api/forum/topics', newTopic.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    router.push('/forum')
  } catch (error) {
    console.error('Error creating topic:', error)
    alert('Failed to create topic')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  fetchCategories()
})
</script> 