<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="text-white font-bold text-xl">SkyCars</router-link>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link 
                to="/" 
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'bg-gray-900 text-white': $route.path === '/' }"
              >
                Home
              </router-link>
              
              <router-link 
                to="/weather" 
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'bg-gray-900 text-white': $route.path === '/weather' }"
              >
                Weather
              </router-link>

              <router-link 
                v-if="authStore.isAdmin" 
                to="/admin" 
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'bg-gray-900 text-white': $route.path === '/admin' }"
              >
                Admin
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <template v-if="authStore.isAuthenticated">
              <!-- Profile dropdown -->
              <div class="ml-3 relative">
                <div>
                  <button 
                    @click="isProfileOpen = !isProfileOpen"
                    class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span class="text-gray-300 px-3 py-2">{{ authStore.user?.name }}</span>
                  </button>
                </div>
                <!-- Dropdown menu -->
                <div 
                  v-show="isProfileOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <router-link 
                    to="/forum"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isProfileOpen = false"
                  >
                    Forum
                  </router-link>
                  <router-link 
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isProfileOpen = false"
                  >
                    Your Profile
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-4"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="-mr-2 flex md:hidden">
          <button
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="md:hidden" :class="{ 'block': isOpen, 'hidden': !isOpen }">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'bg-gray-900 text-white': $route.path === '/' }"
        >
          Home
        </router-link>

        <router-link
          to="/weather"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'bg-gray-900 text-white': $route.path === '/weather' }"
        >
          Weather
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/admin"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'bg-gray-900 text-white': $route.path === '/admin' }"
        >
          Admin
        </router-link>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="px-2 space-y-1">
          <template v-if="authStore.isAuthenticated">
            <div class="px-3 py-2 text-gray-300">
              Welcome, {{ authStore.user?.name }}
            </div>
            <router-link
              to="/forum"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="isOpen = false"
            >
              Forum
            </router-link>
            <router-link
              to="/profile"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="isOpen = false"
            >
              Your Profile
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Register
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)
const isProfileOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  isProfileOpen.value = false
  isOpen.value = false
  router.push('/login')
}

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (isProfileOpen.value) {
    isProfileOpen.value = false
  }
}

// Add click outside listener
window.addEventListener('click', closeDropdown)
</script> 