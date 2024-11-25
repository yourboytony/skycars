<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold mb-6">Admin Setup</h2>
        <button 
          @click="setupAdmin" 
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? 'Setting up...' : 'Setup Admin Account' }}
        </button>
        <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const loading = ref(false)
const message = ref('')
const error = ref('')

const setupAdmin = async () => {
  loading.value = true
  error.value = ''
  message.value = ''
  
  try {
    const response = await axios.post('/api/admin/setup')
    message.value = 'Admin setup complete! The account nigroan67@gmail.com now has admin privileges.'
  } catch (err) {
    error.value = 'Failed to setup admin account: ' + (err.response?.data?.error || err.message)
  } finally {
    loading.value = false
  }
}
</script> 