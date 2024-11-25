<template>
  <div class="min-h-screen pt-16 bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <!-- Weather Search -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold mb-4">Weather Information</h2>
          <form @submit.prevent="getWeather" class="space-y-4">
            <div>
              <label for="icao" class="block text-sm font-medium text-gray-700">Airport ICAO Code</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="icao"
                  v-model="icao"
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter ICAO code (e.g., KJFK)"
                  maxlength="4"
                  @input="handleInput"
                >
              </div>
            </div>
            <button
              type="submit"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="loading || !icao"
            >
              {{ loading ? 'Loading...' : 'Get Weather' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="max-w-4xl mx-auto text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="max-w-4xl mx-auto mb-8">
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {{ error }}
        </div>
      </div>

      <!-- Weather Results -->
      <div v-if="weatherData" class="max-w-4xl mx-auto space-y-6">
        <!-- METAR Data -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">METAR</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <p class="font-mono break-words">{{ weatherData.metar?.raw }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-3 bg-gray-50 rounded">
              <h4 class="font-medium text-gray-700">Temperature</h4>
              <p>{{ weatherData.metar?.temperature?.celsius }}°C / {{ weatherData.metar?.temperature?.fahrenheit }}°F</p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded">
              <h4 class="font-medium text-gray-700">Wind</h4>
              <p>{{ formatWind(weatherData.metar?.wind) }}</p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded">
              <h4 class="font-medium text-gray-700">Visibility</h4>
              <p>{{ formatVisibility(weatherData.metar?.visibility) }}</p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded">
              <h4 class="font-medium text-gray-700">Clouds</h4>
              <p>{{ formatClouds(weatherData.metar?.clouds) }}</p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded">
              <h4 class="font-medium text-gray-700">Humidity</h4>
              <p>{{ weatherData.metar?.humidity?.percent }}%</p>
            </div>
            
            <div class="p-3 bg-gray-50 rounded">
              <h4 class="font-medium text-gray-700">Pressure</h4>
              <p>{{ formatPressure(weatherData.metar?.barometer) }}</p>
            </div>
          </div>
        </div>

        <!-- TAF Data -->
        <div v-if="weatherData.taf" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">TAF</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-mono break-words">{{ weatherData.taf?.raw }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_KEY = '769330e7548b49dda87c211300'
const icao = ref('')
const weatherData = ref(null)
const loading = ref(false)
const error = ref(null)

onMounted(() => {
  window.scrollTo(0, 0)
})

const handleInput = (event) => {
  event.target.value = event.target.value.toUpperCase()
}

const formatWind = (wind) => {
  if (!wind) return 'No wind data'
  return `${wind.degrees}° at ${wind.speed_kts} knots`
}

const formatVisibility = (visibility) => {
  if (!visibility) return 'No visibility data'
  if (visibility.meters) return `${visibility.meters} meters`
  if (visibility.miles) return `${visibility.miles} miles`
  return 'No visibility data'
}

const formatClouds = (clouds) => {
  if (!clouds || clouds.length === 0) return 'No clouds reported'
  return clouds.map(cloud => `${cloud.code} at ${cloud.feet} feet`).join(', ')
}

const formatPressure = (barometer) => {
  if (!barometer) return 'No pressure data'
  return `${barometer.hpa} hPa / ${barometer.hg} inHg`
}

const getWeather = async () => {
  if (!icao.value) return
  
  loading.value = true
  error.value = null
  weatherData.value = null

  try {
    // Fetch METAR data
    const metarResponse = await axios.get(`https://api.checkwx.com/metar/${icao.value}/decoded`, {
      headers: {
        'X-API-Key': API_KEY
      }
    })

    if (metarResponse.data.results > 0) {
      weatherData.value = {
        metar: metarResponse.data.data[0]
      }

      // Fetch TAF data
      try {
        const tafResponse = await axios.get(`https://api.checkwx.com/taf/${icao.value}/decoded`, {
          headers: {
            'X-API-Key': API_KEY
          }
        })
        if (tafResponse.data.results > 0) {
          weatherData.value.taf = tafResponse.data.data[0]
        }
      } catch (tafError) {
        console.warn('TAF fetch error:', tafError)
        // Don't show error for TAF as it's optional
      }
    } else {
      error.value = 'No weather data found for this airport'
    }
  } catch (err) {
    console.error('Weather fetch error:', err)
    error.value = 'Error fetching weather data. Please check the ICAO code and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.font-mono {
  font-family: monospace;
}
</style> 