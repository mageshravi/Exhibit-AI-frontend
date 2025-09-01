<script setup lang="ts">
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ChatThread from '@/components/chat/ChatThread.vue'
</script>

<template>
  <div class="v-chat-page">
    <header class="v-chat-page__header">
      <nav class="m-breadcrumbs">
        <span class="m-breadcrumbs__item">
          <a class="m-breadcrumbs__link" href="#cases">Cases</a>
        </span>
      </nav>
      <h1 class="v-chat-page__title">S Mahadevan vs K Gopalan</h1>
      <nav class="m-tabs">
        <a class="m-tabs__tab" href="#overview">Overview</a>
        <a class="m-tabs__tab" href="#exhibits">Exhibits</a>
        <a class="m-tabs__tab" href="#chats" aria-selected="true">Chats</a>
      </nav>
    </header>
    <ChatSidebar class="v-chat-page__sidebar" />
    <ChatThread class="v-chat-page__thread" />
  </div>
</template>

<style lang="scss">
.m-breadcrumbs {
  display: flex;
  flex-flow: row;

  &__item {
    color: var(--body-txt--secondary);

    &::after {
      margin-inline: 6px;
      content: '>';
    }
  }

  &__link {
    color: var(--body-txt--secondary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
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

  &__title {
    margin-block-start: 0;
    margin-block-end: 13px;
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
