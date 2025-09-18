<script setup lang="ts">
import NewChatButton from '@/components/chat/NewChatButton.vue'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

interface Case {
  id: number
  title: string
  uuid: string
  case: number
  created_at: string
  updated_at: string
}

const route = useRoute()

const state = reactive<{ chats: Case[] }>({
  chats: [],
})

onMounted(() => {
  fetch(`/api/poc/cases/${route.params.caseUuid}/chat-threads/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      state.chats = data.results
    })
})
</script>

<template>
  <aside class="c-chat-sidebar">
    <NewChatButton />
    <h4 class="c-chat-sidebar__title">Chats</h4>
    <nav class="m-chats-list">
      <router-link
        v-for="chat in state.chats"
        :key="chat.id"
        :to="{
          name: 'CaseChat',
          params: { caseUuid: route.params.caseUuid, threadUuid: chat.uuid },
        }"
        class="m-chats-list__link"
        >{{ chat.title }}</router-link
      >
    </nav>
  </aside>
</template>
<style lang="scss">
.m-chats-list {
  display: flex;
  flex-flow: column;
  row-gap: 4px;
  max-width: 100%;

  &__link {
    padding: 6px 12px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: var(--body-txt--secondary);
    border-radius: 0 6px 6px 0;

    &:hover {
      background-color: var(--panel-bg);
    }

    &[aria-selected='true'],
    &.router-link-exact-active {
      color: white;
      background-color: var(--theme-tint);
    }
  }
}
.c-chat-sidebar {
  &__title {
    padding-inline: 15px;
  }
}
</style>
