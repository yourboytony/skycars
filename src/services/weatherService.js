import axios from 'axios';

const CHECKWX_API_KEY = '769330e7548b49dda87c211300';
const BASE_URL = 'https://api.checkwx.com';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': CHECKWX_API_KEY
  }
});

export default {
  async getMetar(icao) {
    try {
      const response = await weatherApi.get(`/metar/decoded/${icao}`);
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching METAR:', error);
      throw error;
    }
  },

  async getTaf(icao) {
    try {
      const response = await weatherApi.get(`/taf/decoded/${icao}`);
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching TAF:', error);
      throw error;
    }
  }
}; 