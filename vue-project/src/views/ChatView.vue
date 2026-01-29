<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatThread from '@/components/chat/ChatThread.vue'
import CaseHeader from '@/components/CaseHeader.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'

interface ChatViewState {
  case: RetrieveCaseResponse | null
}

const state = reactive(<ChatViewState>{
  case: null,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

const route = useRoute()
onMounted(() => {
  const caseUuid = route.params.caseUuid as string

  if (!caseUuid) {
    return
  }

  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
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
