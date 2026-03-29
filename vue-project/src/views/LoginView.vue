<script lang="ts" setup>
import Cookie from 'js-cookie'
import axios from 'axios'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputText from '@/components/inputs/InputText.vue'
import InputPassword from '@/components/inputs/InputPassword.vue'
import { useUserStore } from '@/stores/user'

interface LoginState {
  username: string
  password: string
}

const state = reactive<LoginState>({
  username: '',
  password: '',
})

const userStore = useUserStore()
const router = useRouter()

function handleLogin() {
  const csrfToken = Cookie.get('csrftoken')
  if (!csrfToken) {
    console.error('CSRF token not found')
    return
  }

  axios
    .post(
      '/api/core/login/',
      {
        username: state.username,
        password: state.password,
      },
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      },
    )
    .then(async (response) => {
      userStore.setUser(response.data)
      await router.push({ name: 'Home' })
    })
    .catch((error) => {
      // Handle login error, e.g., show error message
      console.error('Login failed:', error)
    })
}
</script>

<template>
  <div class="v-login">
    <h1>Login</h1>
    <form class="v-login__form" @submit.prevent="handleLogin">
      <InputText label="Username" id="username" v-model="state.username" required />
      <InputPassword label="Password" id="password" v-model="state.password" required />
      <button type="submit" class="m-btn m-btn--primary">Login</button>
    </form>
  </div>
</template>

<style lang="scss">
.v-login {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;

  &__form {
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;
  }
}
</style>
