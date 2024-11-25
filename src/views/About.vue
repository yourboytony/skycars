<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">About SkyCars</h1>

    <div class="space-y-8">
      <!-- Mission Statement -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed">
          SkyCars is dedicated to providing aviation enthusiasts and virtual pilots with comprehensive flight planning tools 
          and real-time weather information. Our platform seamlessly integrates with VATSIM to enhance your virtual flying experience.
        </p>
      </section>

      <!-- Features -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Key Features</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-medium mb-2">Flight Planning</h3>
            <p class="text-gray-600">Advanced route planning with real-world navigation data and weather integration.</p>
          </div>
          <div>
            <h3 class="text-xl font-medium mb-2">Weather Information</h3>
            <p class="text-gray-600">Real-time weather updates and forecasts for airports worldwide.</p>
          </div>
          <div>
            <h3 class="text-xl font-medium mb-2">VATSIM Integration</h3>
            <p class="text-gray-600">Seamless connection with VATSIM network for enhanced virtual flying experience.</p>
          </div>
          <div>
            <h3 class="text-xl font-medium mb-2">Community</h3>
            <p class="text-gray-600">Connect with other aviation enthusiasts and share your flying experiences.</p>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Our Team</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex items-center space-x-4">
            <!-- Person Icon for Anthony -->
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium">Anthony Nigro</h3>
              <p class="text-gray-500">Founder & Lead Developer</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Person Icon for Sean -->
            <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium">Sean Davis</h3>
              <p class="text-gray-500">Co-Founder & Technical Lead</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-gray-600">support@skycars.com</span>
          </div>
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span class="text-gray-600">Join our Discord community</span>
          </div>
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-gray-600">New York, United States</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static page
</script> 