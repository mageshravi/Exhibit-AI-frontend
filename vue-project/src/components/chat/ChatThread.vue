<script setup lang="ts">
import { onMounted, reactive, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import showdown from 'showdown'
import type { ChatMessage } from '@/types/chat-types'
import { sendMessage } from '@/utils/chat'

interface ChatThreadState {
  tmpMessage: string
  userMessage: string
  messages: ChatMessage[]
  fetchingMessages: boolean
  sendingMessage: boolean
}

const route = useRoute()

const state = reactive<ChatThreadState>({
  tmpMessage: '',
  userMessage: '',
  messages: [],
  fetchingMessages: true,
  sendingMessage: false,
})

const messagesContainer = ref<HTMLElement | null>(null)

const converter = new showdown.Converter()

const getHtmlMessage = (text: string, role: string) => {
  if (role == 'user') {
    text = `### ${text}` // convert to h3
  }
  return converter.makeHtml(text)
}

onMounted(() => {
  fetchMessages()
})

watch(
  () => route.params.threadUuid,
  () => {
    state.messages = []
    fetchMessages()
  },
)

watch(
  () => state.sendingMessage,
  (value) => {
    if (!value) {
      return
    }

    nextTick(() => {
      scrollToBottom()
    })
  },
)

watch(
  () => state.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true },
)

function fetchMessages() {
  const caseUuid = route.params.caseUuid ?? null
  const threadUuid = route.params.threadUuid ?? null
  if (!caseUuid || !threadUuid) {
    return
  }

  state.fetchingMessages = true

  fetch(`/api/poc/cases/${caseUuid}/chat-threads/${threadUuid}/messages/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      const reversedApiMessages = data.results.slice().reverse()
      state.messages.unshift(...reversedApiMessages)
    })
    .finally(() => {
      state.fetchingMessages = false
    })
}

function sendMessageHandler() {
  const caseUuid = (route.params.caseUuid as string) ?? null
  const threadUuid = (route.params.threadUuid as string) ?? null
  if (!caseUuid || !threadUuid || !state.userMessage.trim()) {
    return
  }

  state.tmpMessage = state.userMessage
  state.userMessage = ''
  state.sendingMessage = true

  sendMessage(caseUuid, threadUuid, state.tmpMessage)
    ?.then((messages) => {
      if (messages === null) {
        return
      }
      state.messages.push(...messages)
      state.tmpMessage = ''
    })
    .finally(() => {
      state.sendingMessage = false
    })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>
<template>
  <div class="c-chat-thread">
    <div class="c-chat-thread__messages" ref="messagesContainer">
      <img
        class="c-chat-thread__preloader"
        :class="{ 'is-visible': state.fetchingMessages }"
        src="/preloader-1488.gif"
        alt="loading..."
        width="48"
        height="48"
      />
      <div
        v-for="message in state.messages"
        :key="message.id"
        :class="{
          'c-chat-thread__human-message': message.role == 'user',
          'c-chat-thread__ai-message': message.role == 'ai',
        }"
        v-html="getHtmlMessage(message.content, message.role)"
      ></div>
      <div
        v-if="state.sendingMessage"
        class="c-chat-thread__human-message"
        v-html="getHtmlMessage(state.tmpMessage, 'user')"
      ></div>
      <img
        class="c-chat-thread__preloader"
        :class="{ 'is-visible': state.sendingMessage }"
        src="/preloader-1481.gif"
        alt="loading..."
        width="48"
        height="48"
      />
    </div>
    <textarea
      class="c-chat-thread__new-message"
      placeholder="Ask anything"
      autofocus
      v-model="state.userMessage"
      @keyup.ctrl.enter.exact.prevent="sendMessageHandler()"
      :disabled="state.sendingMessage"
    ></textarea>
    <em>Use Ctrl + Enter to send message.</em>
  </div>
</template>
<style lang="scss">
.c-chat-thread {
  display: flex;
  flex-flow: column;
  row-gap: 1rem;
  padding: 15px;
  background-color: var(--panel-bg);
  border-radius: 1rem;
  height: calc(100vh - 165px - 44px);

  &__messages {
    display: flex;
    flex-flow: column;
    row-gap: 1rem;
    flex-grow: 1;
    overflow-y: auto;
  }

  &__preloader {
    display: none;
    margin-inline: auto;

    &.is-visible {
      display: block;
    }
  }

  &__human-message {
    font-family: var(--font-heading);
    font-size: 1.16875rem; /* same as h3 */
    line-height: 120%;
    color: black;
  }

  &__human-message,
  &__ai-message {
    *:first-child {
      margin-block-start: 0;
    }

    *:last-child {
      margin-block-end: 0;
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
      padding: 14px;
      border-width: var(--ip-border-width--focused);
      border-color: var(--ip-border-color--focused);
    }
  }
}
</style>
