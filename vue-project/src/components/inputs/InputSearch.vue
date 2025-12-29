<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  placeholder?: string | undefined
  value?: string | undefined
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus,
})

const emits = defineEmits<{
  (e: 'focus:in'): void
  (e: 'focus:out'): void
  (e: 'keyup', event: KeyboardEvent): void
  (e: 'update:value', value: string): void
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
      ref="inputRef"
      :placeholder="props.placeholder"
      :value="props.value"
      @input="emits('update:value', ($event.target as HTMLInputElement)?.value ?? '')"
      @focusin="emits('focus:in')"
      @focusout="emits('focus:out')"
      @keyup.esc="exitSearch"
      @keyup="emits('keyup', $event)"
    />
  </div>
</template>
