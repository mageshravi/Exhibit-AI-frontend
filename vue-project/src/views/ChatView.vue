<script setup lang="ts">
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatThread from '@/components/chat/ChatThread.vue'
import CaseHeader from '@/components/CaseHeader.vue'
import { getCaseDetails } from '@/utils/case'
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import type { Case } from '@/types/chat-types'

interface ChatViewState {
  case: Case | null
}

const state = reactive(<ChatViewState>{
  case: null,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

const route = useRoute()
onMounted(() => {
  getCaseDetails(route.params.caseUuid as string).then((caseData) => {
    if (caseData === null) {
      return
    }

    state.case = caseData
  })
})
</script>

<template>
  <div class="v-chat-page">
    <CaseHeader class="v-chat-page__header" :title="caseTitle" />
    <ChatSidebar class="v-chat-page__sidebar" />
    <ChatThread class="v-chat-page__thread" />
  </div>
</template>

<style lang="scss">
.v-chat-page {
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

  &__thread {
    grid-column: 3 / span 4;
    grid-row: 2;
  }
}
</style>
