<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <!-- Add your logo here -->
        <h1>Your Logo</h1>
      </router-link>

      <div class="nav-links">
        <router-link to="/radar">VATSIM Radar</router-link>
        <router-link to="/flight-planning">Flight Planning</router-link>
        <router-link to="/weather">Weather</router-link>
        <router-link to="/forum">Forum</router-link>
        <router-link to="/about">About</router-link>
      </div>

      <div class="auth-buttons">
        <template v-if="!isAuthenticated">
          <button @click="login" class="btn-login">Login</button>
          <button @click="register" class="btn-register">Register</button>
        </template>
        <template v-else>
          <router-link to="/profile" class="profile-link">
            <img :src="userAvatar" alt="Profile" class="avatar" />
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    },
    userAvatar() {
      return this.$store.state.auth.user?.avatar || '/default-avatar.png'
    }
  },
  methods: {
    login() {
      this.$router.push('/login')
    },
    register() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--primary);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn-login,
.btn-register {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-login {
  background-color: var(--primary);
  color: #FFFFFF;
}

.btn-login:hover {
  background-color: var(--primary-dark);
}

.btn-register {
  background-color: #FFFFFF;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-register:hover {
  background-color: var(--primary);
  color: #FFFFFF;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style> 