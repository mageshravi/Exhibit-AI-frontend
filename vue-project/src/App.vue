<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const displayName = computed(() => {
  if (userStore.user && (userStore.user.first_name || userStore.user.last_name)) {
    return `${userStore.user.first_name || ''} ${userStore.user.last_name || ''}`.trim()
  }

  return userStore.user?.username || 'Username'
})
</script>

<template>
  <header class="app-header" v-if="userStore.user">
    <nav class="app-header__dropdown m-dropdown">
      <div class="m-dropdown__item">
        <strong class="m-dropdown__trigger">{{ displayName }}</strong>
        <ul class="m-dropdown__menu">
          <li class="m-dropdown__menu-item">
            <router-link :to="{ name: 'Logout' }">Logout</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #f0f0f0;

  &__dropdown {
    margin-inline-start: auto;
  }
}

.m-dropdown {
  position: relative;
  display: inline-block;

  &__item {
    cursor: pointer;
    padding: 8px 16px;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &__menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    margin: 0;
    border: 1px solid #ccc;
    padding: 0;
    width: 100%;
    background-color: #fff;
    list-style: none;

    &-item {
      padding: 8px 16px;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }

  &__item:hover &__menu {
    display: block;
  }
}
</style>
