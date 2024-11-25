<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Topic Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center space-x-2 mb-2">
                <router-link 
                  to="/forum"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Forums
                </router-link>
                <span class="text-gray-500">›</span>
                <span class="text-gray-500 text-sm">{{ topic.category?.name }}</span>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">{{ topic.title }}</h1>
              <div class="flex items-center space-x-2 mt-1">
                <span v-if="topic.isSticky" 
                      class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Sticky
                </span>
                <span v-if="topic.isLocked" 
                      class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  Locked
                </span>
              </div>
            </div>
            <div v-if="authStore.isAdmin" class="space-x-2">
              <button 
                @click="toggleSticky"
                class="px-3 py-1 text-sm rounded-md"
                :class="topic.isSticky ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ topic.isSticky ? 'Unsticky' : 'Sticky' }}
              </button>
              <button 
                @click="toggleLock"
                class="px-3 py-1 text-sm rounded-md"
                :class="topic.isLocked ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ topic.isLocked ? 'Unlock' : 'Lock' }}
              </button>
            </div>
          </div>
        </div>
        <div class="px-6 py-4">
          <!-- Original Post -->
          <div class="flex items-start space-x-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ topic.author?.name }}</span>
                  <span class="text-sm text-gray-500">{{ formatDate(topic.createdAt) }}</span>
                </div>
                <div class="text-sm text-gray-500">
                  {{ topic.views }} views
                </div>
              </div>
              <div class="prose max-w-none">
                {{ topic.content }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Replies -->
      <div class="space-y-6">
        <div v-for="post in posts" :key="post._id" class="bg-white shadow rounded-lg">
          <div class="px-6 py-4">
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">{{ post.author?.name }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
                  </div>
                  <div v-if="canModifyPost(post)" class="space-x-2">
                    <button 
                      @click="editPost(post)"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deletePost(post._id)"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div class="prose max-w-none" v-if="editingPost?._id !== post._id">
                  {{ post.content }}
                </div>
                <div v-else class="space-y-4">
                  <textarea 
                    v-model="editingPost.content"
                    rows="4"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                  <div class="flex justify-end space-x-2">
                    <button 
                      @click="cancelEdit"
                      class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="saveEdit"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reply Form -->
      <div v-if="authStore.isAuthenticated && !topic.isLocked" class="mt-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Post Reply</h3>
          <form @submit.prevent="submitReply" class="space-y-4">
            <div>
              <textarea 
                v-model="newReply"
                rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="Write your reply..."
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Posting...' : 'Post Reply' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Locked Topic Message -->
      <div v-else-if="topic.isLocked" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800 text-center">This topic is locked. New replies are not allowed.</p>
      </div>

      <!-- Login to Reply Message -->
      <div v-else class="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-gray-700 text-center">
          Please 
          <router-link to="/login" class="text-blue-600 hover:text-blue-800">login</router-link>
          to post a reply.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const topic = ref({})
const posts = ref([])
const newReply = ref('')
const isLoading = ref(false)
const editingPost = ref(null)

const fetchTopic = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/forum/topics/${route.params.id}`)
    topic.value = response.data.topic
    posts.value = response.data.posts
  } catch (error) {
    console.error('Error fetching topic:', error)
    router.push('/forum')
  }
}

const submitReply = async () => {
  if (!authStore.isAuthenticated || topic.value.isLocked) return

  isLoading.value = true
  try {
    await axios.post(`http://localhost:3000/api/forum/topics/${route.params.id}/posts`, {
      content: newReply.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    newReply.value = ''
    await fetchTopic()
  } catch (error) {
    console.error('Error posting reply:', error)
    alert('Failed to post reply')
  } finally {
    isLoading.value = false
  }
}

const toggleSticky = async () => {
  if (!authStore.isAdmin) return

  try {
    await axios.patch(`http://localhost:3000/api/forum/topics/${route.params.id}/sticky`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    topic.value.isSticky = !topic.value.isSticky
  } catch (error) {
    console.error('Error toggling sticky:', error)
    alert('Failed to update topic')
  }
}

const toggleLock = async () => {
  if (!authStore.isAdmin) return

  try {
    await axios.patch(`http://localhost:3000/api/forum/topics/${route.params.id}/lock`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    topic.value.isLocked = !topic.value.isLocked
  } catch (error) {
    console.error('Error toggling lock:', error)
    alert('Failed to update topic')
  }
}

const editPost = (post) => {
  editingPost.value = { ...post }
}

const cancelEdit = () => {
  editingPost.value = null
}

const saveEdit = async () => {
  try {
    await axios.patch(`http://localhost:3000/api/forum/posts/${editingPost.value._id}`, {
      content: editingPost.value.content
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchTopic()
    editingPost.value = null
  } catch (error) {
    console.error('Error updating post:', error)
    alert('Failed to update post')
  }
}

const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) return

  try {
    await axios.delete(`http://localhost:3000/api/forum/posts/${postId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchTopic()
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('Failed to delete post')
  }
}

const canModifyPost = (post) => {
  return authStore.isAdmin || post.author?._id === authStore.user?.id
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  fetchTopic()
})
</script> 