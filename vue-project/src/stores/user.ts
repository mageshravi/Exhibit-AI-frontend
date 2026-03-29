import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Token {
  expiry: string
  token: string
}

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<Token | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function setUser(userData: User) {
    user.value = userData
  }

  function setToken(tokenData: Token) {
    token.value = tokenData
  }

  function logout() {
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
  }
})
