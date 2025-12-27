<script setup lang="ts">
const props = defineProps<{
  placeholder?: string | undefined
}>()

const emits = defineEmits<{
  (e: 'focus:in'): void
  (e: 'focus:out'): void
  (e: 'keyup', event: KeyboardEvent): void
}>()

const exitSearch = (event: KeyboardEvent) => {
  ;(event.target as HTMLElement).blur()
  emits('focus:out')
}
</script>

<template>
  <div class="m-searchbox">
    <input
      type="search"
      class="m-searchbox__input"
      :placeholder="props.placeholder"
      @focusin="emits('focus:in')"
      @focusout="emits('focus:out')"
      @keyup.esc="exitSearch"
      @keyup="emits('keyup', $event)"
    />
  </div>
</template>
