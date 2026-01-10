<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  name: string
  label: string
  checked?: boolean
  inline?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', checked: boolean): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const htmlId = computed(() => {
  return props.name.replace(/_/g, '-').toLowerCase()
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits('update:modelValue', target.checked)
}
</script>

<template>
  <div :class="['m-checkbox', { 'm-checkbox--inline': props.inline }]">
    <input
      type="checkbox"
      class="m-checkbox__input"
      ref="inputRef"
      :name="props.name"
      :id="htmlId"
      :checked="props.checked"
      @change="handleChange"
    />
    <label :for="htmlId" class="m-checkbox__label">{{ props.label }}</label>
  </div>
</template>
