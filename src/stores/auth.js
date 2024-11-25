import { defineStore } from 'pinia'
import axios from 'axios'

const ADMIN_EMAILS = ['nigroan67@gmail.com', 'seand908@gmail.com']

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => ADMIN_EMAILS.includes(state.user?.email)
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
      } catch (error) {
        throw error.response?.data?.error || 'Login failed'
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}) 