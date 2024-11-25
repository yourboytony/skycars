<template>
  <div class="relative">
    <!-- Fixed Background Container -->
    <div class="fixed inset-0 z-0">
      <img 
        :src="currentImage" 
        alt="Aviation background" 
        class="w-full h-full object-cover transition-opacity duration-1000"
        @load="imageLoaded = true"
        :class="{ 'opacity-0': !imageLoaded }"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
    </div>

    <!-- Scrollable Content -->
    <div class="relative z-10 min-h-screen">
      <!-- Hero Section -->
      <div class="h-screen flex items-center">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Your Journey Begins Here
            </h1>
            <p class="text-xl text-gray-200 mb-8 animate-fade-in-delay">
              Professional flight planning and weather tracking for virtual aviation enthusiasts.
            </p>

            <!-- CTA Buttons -->
            <div class="space-x-4 animate-fade-in-delay-2">
              <router-link 
                to="/flight-planner" 
                class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Plan Flight
              </router-link>
              <router-link 
                to="/weather" 
                class="inline-block bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
              >
                Check Weather
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container mx-auto px-4 py-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-black/40 backdrop-blur-sm p-8 rounded-xl hover:bg-black/50 transition-all duration-300">
            <div class="text-blue-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <h3 class="text-white text-xl font-semibold mb-3">Route Planning</h3>
            <p class="text-gray-300">Advanced flight routing with real navigation data and optimized pathfinding.</p>
          </div>

          <div class="bg-black/40 backdrop-blur-sm p-8 rounded-xl hover:bg-black/50 transition-all duration-300">
            <div class="text-blue-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 class="text-white text-xl font-semibold mb-3">Weather Updates</h3>
            <p class="text-gray-300">Real-time METAR and TAF information with detailed weather visualization.</p>
          </div>

          <div class="bg-black/40 backdrop-blur-sm p-8 rounded-xl hover:bg-black/50 transition-all duration-300">
            <div class="text-blue-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-white text-xl font-semibold mb-3">Community</h3>
            <p class="text-gray-300 mb-4">Connect with other aviation enthusiasts and share your flying experiences.</p>
            <a 
              href="https://discord.gg/EkEmM79J8s" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join our Discord community
            </a>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="container mx-auto px-4 py-20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="bg-black/40 backdrop-blur-sm p-6 rounded-xl">
            <div class="text-4xl font-bold text-white mb-2">5000+</div>
            <div class="text-gray-300">Active Users</div>
          </div>
          <div class="bg-black/40 backdrop-blur-sm p-6 rounded-xl">
            <div class="text-4xl font-bold text-white mb-2">10K+</div>
            <div class="text-gray-300">Routes Planned</div>
          </div>
          <div class="bg-black/40 backdrop-blur-sm p-6 rounded-xl">
            <div class="text-4xl font-bold text-white mb-2">200+</div>
            <div class="text-gray-300">Airports</div>
          </div>
          <div class="bg-black/40 backdrop-blur-sm p-6 rounded-xl">
            <div class="text-4xl font-bold text-white mb-2">24/7</div>
            <div class="text-gray-300">Support</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const backgroundImages = [
  'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
  'https://images.pexels.com/photos/733254/pexels-photo-733254.jpeg',
  'https://images.pexels.com/photos/379419/pexels-photo-379419.jpeg',
  'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg',
  'https://images.pexels.com/photos/1089306/pexels-photo-1089306.jpeg'
]

const currentImage = ref(backgroundImages[0])
const imageLoaded = ref(false)
let currentIndex = 0
let intervalId = null

const rotateBackground = () => {
  imageLoaded.value = false
  currentIndex = (currentIndex + 1) % backgroundImages.length
  currentImage.value = backgroundImages[currentIndex]
}

onMounted(() => {
  // Preload images
  backgroundImages.forEach(src => {
    const img = new Image()
    img.src = src
  })
  
  intervalId = setInterval(rotateBackground, 8000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.5s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 1s ease-out 1s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 