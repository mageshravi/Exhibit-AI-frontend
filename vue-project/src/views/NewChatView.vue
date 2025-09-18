<script setup lang="ts">
import CaseHeader from '@/components/CaseHeader.vue'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
import { onMounted, reactive } from 'vue'
import router from '@/router'
import { getCaseDetails } from '@/utils/case'
import type { Case } from '@/types/chat-types'
import { sendMessage } from '@/utils/chat'

interface NewChatState {
  case: Case | null
  threadUuid: string
  sendingMessage: boolean
  message: string
}

const route = useRoute()
const state = reactive<NewChatState>({
  case: null,
  threadUuid: '',
  sendingMessage: false,
  message: '',
})

onMounted(() => {
  const caseUuid = (route.params.caseUuid as string) ?? null
  if (!caseUuid) {
    return
  }

  getCaseDetails(caseUuid).then((caseData) => {
    if (caseData === null) {
      return
    }

    state.case = caseData
  })
})

function createNewChat() {
  const caseUuid = (route.params.caseUuid as string) ?? null
  const csrfToken = Cookies.get('csrftoken')
  let message = state.message.trim()

  if (message.length > 254) {
    message = message.slice(0, 251) + '…'
  }

  if (!caseUuid || !csrfToken || !state.case?.id || !state.message.trim()) {
    return
  }

  state.sendingMessage = true

  fetch(`/api/poc/cases/${caseUuid}/chat-threads/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ title: message, case: state.case.id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((threadData) => {
      state.threadUuid = threadData.uuid
      sendMessage(caseUuid, threadData.uuid, state.message)?.then((messageData) => {
        if (messageData === null) {
          return
        }

        state.message = ''

        router.push({
          name: 'CaseChat',
          params: { caseUuid: route.params.caseUuid, threadUuid: state.threadUuid },
        })
      })
    })
    .catch((error) => {
      console.error('Error creating new chat thread:', error)
      state.sendingMessage = false
      return null
    })
}
</script>

<template>
  <div class="v-new-chat-page">
    <CaseHeader class="v-new-chat-page__header" :title="state.case?.title || 'Loading...'" />
    <ChatSidebar class="v-new-chat-page__sidebar" />
    <main class="v-new-chat-page__main">
      <h2 class="v-new-chat-page__title">What would you like to know?</h2>
      <img
        class="v-new-chat-page__preloader"
        :class="{ 'is-visible': state.sendingMessage }"
        src="/preloader-1481.gif"
        alt="loading..."
        width="48"
        height="48"
      />
      <textarea
        class="v-new-chat-page__new-message"
        placeholder="Ask anything"
        autofocus
        v-model="state.message"
        @keyup.ctrl.enter.exact.prevent="createNewChat()"
        :disabled="state.sendingMessage"
      ></textarea>
      <em>Use Ctrl + Enter to send message.</em>
    </main>
  </div>
</template>

<style lang="scss">
.v-new-chat-page {
  display: grid;
  min-width: 1200px;
  max-width: 1440px;
  margin-inline: auto;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 20px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
  }

  &__sidebar {
    grid-column: 1 / span 2;
    grid-row: 2;
    display: flex;
    flex-flow: column;
    align-items: flex-end;
  }

  &__main {
    grid-column: 3 / span 4;
    grid-row: 2;
    background-color: var(--panel-bg);
    padding: 15px;
    height: fit-content;
    border-radius: 1rem;
  }

  &__preloader {
    display: none;
    margin-inline: auto;

    &.is-visible {
      display: block;
    }
  }

  &__new-message {
    border-width: var(--ip-border-width);
    border-color: var(--ip-border-color);
    padding: 15px;
    width: 100%;
    height: 66px;
    flex-shrink: 0;
    font-family: var(--font-body);
    border-radius: 6px;

    &:focus {
      outline: none;
      border-color: var(--ip-border-color--focused);
      border-width: var(--ip-border-width--focused);
    }
  }
}
</style>
