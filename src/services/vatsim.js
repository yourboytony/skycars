import axios from 'axios'

const VATSIM_DATA_URL = 'https://data.vatsim.net/v3/vatsim-data.json'

export async function fetchVatsimData() {
  try {
    const response = await axios.get(VATSIM_DATA_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching VATSIM data:', error)
    throw error
  }
}

export async function fetchVatsimMetadata() {
  try {
    const response = await axios.get('https://data.vatsim.net/v3/meta/status.json')
    return response.data
  } catch (error) {
    console.error('Error fetching VATSIM metadata:', error)
    throw error
  }
} 