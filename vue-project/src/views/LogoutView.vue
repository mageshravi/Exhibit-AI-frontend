<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'

const userStore = useUserStore()
const router = useRouter()

function logout() {
  axios
    .post(
      '/api/core/logout/',
      {},
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken') || '',
        },
      },
    )
    .then(() => {
      console.log('Logged out successfully')
    })
    .catch((error) => {
      console.error('Logout failed:', error)
    })
    .finally(() => {
      userStore.logout()
      router.push({ name: 'Login' })
    })
}

onMounted(() => {
  logout()
})
</script>

<template>
  <div class="v-logout">
    <h1>Logging out...</h1>
  </div>
</template>

<style lang="scss" scoped>
.v-logout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  h1 {
    font-size: 24px;
    color: #333;
  }
}
</style>
