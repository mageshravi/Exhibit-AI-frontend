<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  label: string
  value: string
  modelValue?: string
  checked?: boolean
  inline?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const htmlId = computed(() => {
  return `${props.name}-${props.value}`.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
})

const isChecked = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue === props.value
  }

  return Boolean(props.checked)
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits('update:modelValue', target.value)
}
</script>

<template>
  <div :class="['m-radio', { 'm-radio--inline': props.inline }]">
    <input
      type="radio"
      class="m-radio__input"
      :name="props.name"
      :id="htmlId"
      :checked="isChecked"
      @change="handleChange"
      :value="props.value"
    />
    <label :for="htmlId" class="m-radio__label">{{ props.label }}</label>
  </div>
</template>
