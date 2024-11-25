import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token')
  }),

  getters: {
    userInitials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
    isAdmin: (state) => state.user?.isAdmin || false
  },

  actions: {
    setUser(userData) {
      this.user = userData
      this.token = userData.token
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', userData.token)
    },

    logout() {
      this.user = null
      this.token = null
      this.isLoggedIn = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
}) 