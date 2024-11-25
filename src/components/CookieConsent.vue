<template>
  <div 
    v-if="!hasConsent"
    class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50"
  >
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex-1">
        <p class="text-sm">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          <router-link to="/cookies" class="underline hover:text-blue-300">
            Learn more
          </router-link>
        </p>
      </div>
      <div class="flex gap-4">
        <button 
          @click="openSettings"
          class="text-sm px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900 transition"
        >
          Cookie Settings
        </button>
        <button 
          @click="acceptAll"
          class="text-sm px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Accept All
        </button>
      </div>
    </div>

    <!-- Cookie Settings Modal -->
    <div 
      v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white text-gray-900 rounded-lg max-w-2xl w-full mx-4 p-6">
        <h2 class="text-2xl font-bold mb-4">Cookie Preferences</h2>
        
        <div class="space-y-4 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Essential Cookies</h3>
              <p class="text-sm text-gray-500">Required for the website to function</p>
            </div>
            <input type="checkbox" checked disabled>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Preference Cookies</h3>
              <p class="text-sm text-gray-500">Remember your settings and preferences</p>
            </div>
            <input 
              type="checkbox" 
              v-model="preferences.preferences"
            >
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Analytics Cookies</h3>
              <p class="text-sm text-gray-500">Help us improve our website</p>
            </div>
            <input 
              type="checkbox" 
              v-model="preferences.analytics"
            >
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button 
            @click="showSettings = false"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            @click="savePreferences"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const hasConsent = ref(false)
const showSettings = ref(false)
const preferences = ref({
  preferences: true,
  analytics: true
})

onMounted(() => {
  const consent = localStorage.getItem('cookieConsent')
  if (consent) {
    hasConsent.value = true
    preferences.value = JSON.parse(consent)
  }
})

const openSettings = () => {
  showSettings.value = true
}

const acceptAll = () => {
  preferences.value = {
    preferences: true,
    analytics: true
  }
  savePreferences()
}

const savePreferences = () => {
  localStorage.setItem('cookieConsent', JSON.stringify(preferences.value))
  hasConsent.value = true
  showSettings.value = false
}
</script> 