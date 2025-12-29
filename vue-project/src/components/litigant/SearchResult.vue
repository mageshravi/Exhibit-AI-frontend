<script setup lang="ts">
export interface SearchResult {
  name: string
  bio: string
  email: string
  phone: string
  address: string
}

const props = defineProps<{
  result: SearchResult
}>()
</script>

<template>
  <div class="c-search-result">
    <strong class="c-search-result__name">{{ props.result.name }}</strong>
    <span class="c-search-result__bio">{{ props.result.bio }}</span>
    <span class="c-search-result__email">{{ props.result.email }}</span>
    <span class="c-search-result__phone">{{ props.result.phone }}</span>
    <div class="c-search-result__address">
      {{ props.result.address }}
    </div>
  </div>
</template>

<style lang="scss">
.c-search-result {
  position: relative;
  padding: 8px 16px 8px 34px;
  border-radius: 10px;
  user-select: none;

  &__name {
    display: block;
    font-weight: bold;
    color: var(--oxford-blue);
  }

  &__bio {
    display: block;
    color: var(--body-txt);
  }

  &__email,
  &__phone,
  &__address {
    display: block;
    color: var(--body-txt--secondary);
  }

  &.is-selected,
  &:hover {
    background-color: var(--panel-bg);

    &::before {
      --icon-size: 20px;
      content: '';
      position: absolute;
      left: 8px;
      top: 10px;
      width: var(--icon-size);
      height: var(--icon-size);
      background-image: url('/icon-check-circle.svg');
    }
  }
}
</style>
