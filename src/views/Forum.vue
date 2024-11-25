<template>
  <div v-if="authStore.isAdmin" class="p-4 bg-gray-100">
    <p>Debug Info:</p>
    <p>Is Admin: {{ authStore.isAdmin }}</p>
    <p>Token exists: {{ !!authStore.token }}</p>
  </div>

  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Forum</h1>
        <router-link 
          v-if="authStore.isAuthenticated"
          to="/forum/new-topic"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Topic
        </router-link>
      </div>

      <!-- Categories -->
      <div class="space-y-6">
        <div v-for="category in categories" :key="category._id" class="bg-white shadow rounded-lg overflow-hidden">
          <!-- Category Header -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">{{ category.name }}</h2>
            <p class="text-sm text-gray-600">{{ category.description }}</p>
          </div>

          <!-- Topics List -->
          <div class="divide-y divide-gray-200">
            <div v-for="topic in category.topics" :key="topic._id" 
                 class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div class="flex items-center justify-between">
                <router-link 
                  :to="`/forum/topic/${topic._id}`"
                  class="flex-1"
                >
                  <div class="flex items-center space-x-3">
                    <!-- Sticky/Locked indicators -->
                    <div class="flex space-x-1">
                      <span v-if="topic.isSticky" 
                            class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Sticky
                      </span>
                      <span v-if="topic.isLocked" 
                            class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Locked
                      </span>
                    </div>
                    
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ topic.title }}</h3>
                      <p class="text-sm text-gray-500">
                        by {{ topic.author?.name }} · 
                        {{ formatDate(topic.createdAt) }}
                      </p>
                    </div>
                  </div>
                </router-link>
                
                <div class="text-sm text-gray-500 text-right">
                  <div>{{ topic.views }} views</div>
                  <div>Last post {{ formatDate(topic.lastPost || topic.createdAt) }}</div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="!category.topics?.length" class="px-6 py-4 text-gray-500 text-center">
              No topics in this category yet.
            </div>
          </div>
        </div>
      </div>

      <!-- Admin: Create Category -->
      <div v-if="authStore.isAdmin" class="mt-8">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
          <form @submit.prevent="createCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Category Name</label>
              <input 
                v-model="newCategory.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                v-model="newCategory.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Display Order</label>
              <input 
                v-model.number="newCategory.order"
                type="number"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            <div class="flex justify-end">
              <button 
                type="submit"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Creating...' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const categories = ref([])
const isLoading = ref(false)
const newCategory = ref({
  name: '',
  description: '',
  order: 0
})

const createCategory = async () => {
  if (!authStore.isAdmin) {
    console.log('Not an admin, cannot create category')
    return
  }
  
  isLoading.value = true
  try {
    console.log('Creating category with data:', newCategory.value)
    console.log('Auth token:', authStore.token)
    
    const response = await axios.post(
      'http://localhost:3000/api/forum/categories', 
      newCategory.value, 
      {
        headers: { 
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('Category created:', response.data)
    newCategory.value = { name: '', description: '', order: 0 }
    await fetchCategories()
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    alert(`Failed to create category: ${error.response?.data?.error || error.message}`)
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/forum/categories')
    categories.value = response.data
    console.log('Fetched categories:', categories.value)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  fetchCategories()
})
</script> 