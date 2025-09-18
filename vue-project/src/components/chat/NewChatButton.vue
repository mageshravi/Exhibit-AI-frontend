<script setup lang="ts">
import PencilIcon from '@/components/icons/IconPencil.vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()

function goToNewChat() {
  router.push({
    name: 'NewChat',
    params: { caseUuid: route.params.caseUuid },
  })
}
</script>
<template>
  <div class="c-new-chat-btn" @click="goToNewChat()">
    <PencilIcon />
    New Chat
  </div>
</template>
<style lang="scss">
.c-new-chat-btn {
  display: inline-flex;
  flex-flow: row;
  column-gap: 6px;
  padding: 10px 12px;
  color: var(--body-txt--secondary);
  border-radius: 8px;
  user-select: none;

  &:hover {
    background-color: var(--panel-bg);
  }

  &:active {
    box-shadow: inset 0 3px 3px rgba(0, 0, 0, 0.25);
  }
}
</style>
