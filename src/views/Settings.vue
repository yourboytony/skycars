<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>

    <!-- Settings Sections -->
    <div class="space-y-8">
      <!-- Account Settings -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-6">Account Settings</h2>
        
        <!-- Password Change -->
        <div class="max-w-md">
          <h3 class="text-lg font-medium mb-4">Change Password</h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                v-model="passwords.current"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                v-model="passwords.new"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                v-model="passwords.confirm"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
            </div>
            <button 
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="isChangingPassword"
            >
              {{ isChangingPassword ? 'Changing Password...' : 'Change Password' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-6">Notification Settings</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Email Notifications</h3>
              <p class="text-sm text-gray-500">Receive email updates about your flights</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="notifications.email"
                class="sr-only peer"
                @change="saveNotificationSettings"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Weather Alerts</h3>
              <p class="text-sm text-gray-500">Get notified about weather changes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="notifications.weather"
                class="sr-only peer"
                @change="saveNotificationSettings"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">VATSIM Updates</h3>
              <p class="text-sm text-gray-500">Receive VATSIM-related notifications</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="notifications.vatsim"
                class="sr-only peer"
                @change="saveNotificationSettings"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Display Settings -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-6">Display Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Theme</label>
            <select 
              v-model="display.theme"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              @change="saveDisplaySettings"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Units</label>
            <select 
              v-model="display.units"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              @change="saveDisplaySettings"
            >
              <option value="imperial">Imperial (ft, nm, kts)</option>
              <option value="metric">Metric (m, km, km/h)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-6 text-red-600">Danger Zone</h2>
        <div class="space-y-4">
          <button 
            @click="deleteAccount"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Account
          </button>
          <p class="text-sm text-gray-500">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const isChangingPassword = ref(false)

const passwords = ref({
  current: '',
  new: '',
  confirm: ''
})

const notifications = ref({
  email: true,
  weather: true,
  vatsim: true
})

const display = ref({
  theme: 'light',
  units: 'imperial'
})

// Load settings on mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/settings', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    notifications.value = response.data.notifications
    display.value = response.data.display
  } catch (error) {
    console.error('Error loading settings:', error)
  }
})

const changePassword = async () => {
  if (passwords.value.new !== passwords.value.confirm) {
    alert('New passwords do not match')
    return
  }

  isChangingPassword.value = true
  try {
    await axios.put('http://localhost:3000/api/settings/password', {
      currentPassword: passwords.value.current,
      newPassword: passwords.value.new
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    alert('Password changed successfully')
    passwords.value = { current: '', new: '', confirm: '' }
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to change password')
  } finally {
    isChangingPassword.value = false
  }
}

const saveNotificationSettings = async () => {
  try {
    await axios.put('http://localhost:3000/api/settings/notifications', 
      notifications.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
  } catch (error) {
    console.error('Error saving notification settings:', error)
    alert('Failed to save notification settings')
  }
}

const saveDisplaySettings = async () => {
  try {
    await axios.put('http://localhost:3000/api/settings/display', 
      display.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
  } catch (error) {
    console.error('Error saving display settings:', error)
    alert('Failed to save display settings')
  }
}

const deleteAccount = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return
  }

  try {
    await axios.delete('http://localhost:3000/api/settings/account', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Error deleting account:', error)
    alert('Failed to delete account')
  }
}
</script> 