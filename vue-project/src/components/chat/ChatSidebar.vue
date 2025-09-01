<script setup lang="ts">
import NewChatButton from '@/components/chat/NewChatButton.vue'
</script>

<template>
  <aside class="c-chat-sidebar">
    <NewChatButton />
    <h4 class="c-chat-sidebar__title">Chats</h4>
    <nav class="m-chats-list">
      <a class="m-chats-list__link" href="#" aria-selected="true"
        >When was the house plan shared?</a
      >
      <a class="m-chats-list__link" href="#"
        >Give me the delivery milestones and payment milestones in chronological order</a
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

    &[aria-selected='true'] {
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
