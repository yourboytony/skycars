<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold mb-6">Flight Planning</h2>
        
        <!-- Flight Plan Form -->
        <form @submit.prevent="generatePlan" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Departure -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Departure Airport (ICAO)
              </label>
              <input
                v-model="flightPlan.departure"
                type="text"
                required
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="KJFK"
              >
            </div>

            <!-- Arrival -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Arrival Airport (ICAO)
              </label>
              <input
                v-model="flightPlan.arrival"
                type="text"
                required
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="KLAX"
              >
            </div>

            <!-- Aircraft -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Aircraft Type
              </label>
              <select
                v-model="flightPlan.aircraft"
                required
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Aircraft</option>
                <option value="B738">Boeing 737-800</option>
                <option value="A320">Airbus A320</option>
                <option value="B777">Boeing 777-300ER</option>
                <!-- Add more aircraft options -->
              </select>
            </div>

            <!-- Route Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Route Type
              </label>
              <select
                v-model="flightPlan.routeType"
                required
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="HIGH">High Airways</option>
                <option value="LOW">Low Airways</option>
                <option value="DIRECT">Direct</option>
              </select>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                v-model="flightPlan.includeWeather"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              >
              <label class="ml-2 text-sm text-gray-700">
                Include weather briefing
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="flightPlan.includeNotams"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              >
              <label class="ml-2 text-sm text-gray-700">
                Include NOTAMs
              </label>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              :disabled="loading"
            >
              {{ loading ? 'Generating...' : 'Generate Flight Plan' }}
            </button>
            <button
              type="button"
              @click="exportToSimBrief"
              class="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
              :disabled="!hasFlightPlan || loading"
            >
              Export to SimBrief
            </button>
          </div>
        </form>

        <!-- Flight Plan Result -->
        <div v-if="generatedPlan" class="mt-8 border-t pt-8">
          <h3 class="text-xl font-semibold mb-4">Generated Flight Plan</h3>
          <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded">
                <span class="block text-sm text-gray-600">Route</span>
                <span class="font-medium">{{ generatedPlan.route }}</span>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <span class="block text-sm text-gray-600">Distance</span>
                <span class="font-medium">{{ generatedPlan.distance }} nm</span>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <span class="block text-sm text-gray-600">Estimated Time</span>
                <span class="font-medium">{{ generatedPlan.time }}</span>
              </div>
              <div class="p-4 bg-gray-50 rounded">
                <span class="block text-sm text-gray-600">Fuel Required</span>
                <span class="font-medium">{{ generatedPlan.fuel }} lbs</span>
              </div>
            </div>

            <!-- Waypoints Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waypoint</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Altitude</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="waypoint in generatedPlan.waypoints" :key="waypoint.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ waypoint.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ waypoint.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ waypoint.altitude }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ waypoint.distance }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'FlightPlanner',
  setup() {
    const flightPlan = ref({
      departure: '',
      arrival: '',
      aircraft: '',
      routeType: 'HIGH',
      includeWeather: true,
      includeNotams: true
    })

    const loading = ref(false)
    const generatedPlan = ref(null)

    const hasFlightPlan = computed(() => !!generatedPlan.value)

    const generatePlan = async () => {
      loading.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        generatedPlan.value = {
          route: `${flightPlan.value.departure} DCT WPT1 J123 WPT2 DCT ${flightPlan.value.arrival}`,
          distance: '2,345',
          time: '5:30',
          fuel: '25,000',
          waypoints: [
            { id: 1, name: flightPlan.value.departure, type: 'AIRPORT', altitude: 'GND', distance: '0' },
            { id: 2, name: 'WPT1', type: 'FIX', altitude: 'FL330', distance: '250' },
            { id: 3, name: 'WPT2', type: 'FIX', altitude: 'FL330', distance: '500' },
            { id: 4, name: flightPlan.value.arrival, type: 'AIRPORT', altitude: 'GND', distance: '750' },
          ]
        }
      } catch (error) {
        console.error('Error generating flight plan:', error)
      } finally {
        loading.value = false
      }
    }

    const exportToSimBrief = () => {
      // Add SimBrief export logic here
      window.open('https://www.simbrief.com/system/dispatch.php', '_blank')
    }

    return {
      flightPlan,
      loading,
      generatedPlan,
      hasFlightPlan,
      generatePlan,
      exportToSimBrief
    }
  }
}
</script> 