<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>
<template>
  <header class="c-case-header">
    <nav class="m-breadcrumbs">
      <span class="m-breadcrumbs__item">
        <a class="m-breadcrumbs__link" href="#cases">Cases</a>
      </span>
    </nav>
    <h1 class="c-case-header__title">{{ props.title }}</h1>
    <nav class="m-tabs">
      <a class="m-tabs__tab" href="#overview">Overview</a>
      <a class="m-tabs__tab" href="#exhibits">Exhibits</a>
      <a class="m-tabs__tab" href="#chats" aria-selected="true">Chats</a>
    </nav>
  </header>
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

.c-case-header {
  &__title {
    margin-block-start: 0;
    margin-block-end: 13px;
  }
}
</style>
