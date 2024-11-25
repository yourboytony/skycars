import { createRouter, createWebHistory } from 'vue-router'

// Main views
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Weather from '@/views/Weather.vue'
import AdminAccess from '@/views/AdminAccess.vue'
import Profile from '@/views/Profile.vue'
import Settings from '@/views/Settings.vue'
import FlightPlanner from '@/views/FlightPlanner.vue'
import About from '@/views/About.vue'
import Terms from '@/views/Terms.vue'
import Cookies from '@/views/Cookies.vue'

import { useAuthStore } from '@/stores/auth'

const ADMIN_EMAILS = ['nigroan67@gmail.com', 'seand908@gmail.com']

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/weather',
    component: Weather,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin-access',
    component: AdminAccess,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!ADMIN_EMAILS.includes(authStore.user?.email)) {
        next('/')
        return
      }
      next()
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/flight-planner',
    component: FlightPlanner,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/terms',
    component: Terms
  },
  {
    path: '/cookies',
    component: Cookies
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  next()
})

export default router
