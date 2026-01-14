<script setup lang="ts">
interface Props {
  searchQuery: string
  result: {
    displayText: string
    value: string
  }
  focused?: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'select', value: string): void
}>()

function highlightQuery(text: string, query: string): string {
  if (!query) return text

  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<span class="u-highlight">$1</span>')
}
</script>

<template>
  <div
    class="c-search-result"
    :class="{ 'is-focused': props.focused }"
    @click="emits('select', props.result.value)"
  >
    <span v-html="highlightQuery(props.result.displayText, props.searchQuery)"></span>
  </div>
</template>

<style lang="scss" scoped>
.c-search-result {
  padding: 6px 10px;
  border-radius: 5px;
  width: 100%;
  user-select: none;

  &:hover {
    background-color: var(--panel-bg);
  }

  &.is-focused {
    background-color: var(--panel-bg);
  }
}
</style>
