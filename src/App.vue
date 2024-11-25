<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="fixed w-full z-50 bg-gray-800/80 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Left side navigation -->
          <div class="flex space-x-4">
            <router-link to="/" class="text-white hover:text-gray-300">Home</router-link>
            <router-link to="/weather" class="text-white hover:text-gray-300">Weather</router-link>
            <router-link 
              v-if="authStore.isAuthenticated && isAdmin" 
              to="/admin-access" 
              class="text-white hover:text-gray-300"
            >
              Admin
            </router-link>
          </div>

          <!-- Right side with dropdown -->
          <div class="flex items-center">
            <template v-if="authStore.isAuthenticated">
              <div class="relative">
                <button 
                  @click="toggleDropdown" 
                  class="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none"
                >
                  <span>{{ authStore.user?.name }}</span>
                  <svg 
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isDropdownOpen }"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div 
                  v-show="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50"
                >
                  <div class="px-4 py-2 text-sm text-gray-500 border-b">
                    Signed in as<br>
                    <span class="font-medium text-gray-900">{{ authStore.user?.email }}</span>
                  </div>
                  
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isDropdownOpen = false"
                  >
                    Your Profile
                  </router-link>
                  
                  <router-link 
                    to="/settings" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isDropdownOpen = false"
                  >
                    Settings
                  </router-link>
                  
                  <div class="border-t"></div>
                  
                  <button 
                    @click="handleLogout" 
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                class="text-white hover:text-gray-300"
              >
                Login
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800/80 backdrop-blur-sm text-white py-8 relative z-10">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About SkyCars</h3>
            <p class="text-gray-300">Your trusted platform for flight planning and weather information.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><router-link to="/about" class="text-gray-300 hover:text-white">About Us</router-link></li>
              <li><router-link to="/terms" class="text-gray-300 hover:text-white">Terms of Service</router-link></li>
              <li><router-link to="/cookies" class="text-gray-300 hover:text-white">Cookies Policy</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <div class="space-y-2">
              <p class="text-gray-300">Email: support@skycars.com</p>
              <a 
                href="https://discord.gg/EkEmM79J8s" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join our Discord
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {{ new Date().getFullYear() }} SkyCars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import CookieConsent from '@/components/CookieConsent.vue'

const router = useRouter()
const authStore = useAuthStore()
const isDropdownOpen = ref(false)

const isAdmin = computed(() => {
  return ['nigroan67@gmail.com', 'seand908@gmail.com'].includes(authStore.user?.email)
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleLogout = () => {
  isDropdownOpen.value = false
  authStore.logout()
  router.push('/login')
}

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style> 