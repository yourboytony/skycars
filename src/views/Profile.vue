<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Your Profile</h1>

    <!-- Profile Card -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <div class="flex items-start">
        <!-- Profile Picture -->
        <div class="mr-6">
          <div class="relative">
            <img 
              :src="profilePicture || 'https://via.placeholder.com/150'" 
              alt="Profile picture"
              class="w-32 h-32 rounded-full object-cover"
            >
            <label class="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700">
              <input 
                type="file" 
                accept="image/*" 
                class="hidden"
                @change="handleImageUpload"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                v-model="profile.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                v-model="profile.email"
                type="email"
                disabled
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">VATSIM ID</label>
              <input 
                v-model="profile.vatsimId"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Discord Username</label>
              <input 
                v-model="profile.discord"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700">Bio</label>
            <textarea 
              v-model="profile.bio"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-6 flex justify-end">
        <button 
          @click="saveProfile"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <!-- Flight History -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Flight History</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="flight in flightHistory" :key="flight.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ flight.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ flight.route }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ flight.aircraft }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ flight.duration }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const isSaving = ref(false)
const profilePicture = ref(null)

const profile = ref({
  name: '',
  email: '',
  vatsimId: '',
  discord: '',
  bio: ''
})

const flightHistory = ref([
  {
    id: 1,
    date: '2024-03-15',
    route: 'KJFK - EGLL',
    aircraft: 'B777',
    duration: '6h 45m'
  },
  // Add more flight history as needed
])

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // Here you would typically upload to your server/cloud storage
    // For now, we'll just create a local URL
    profilePicture.value = URL.createObjectURL(file)
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Failed to upload image')
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    await axios.put('http://localhost:3000/api/profile', profile.value, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    alert('Profile updated successfully')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Failed to save profile')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    profile.value = response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
})
</script> 