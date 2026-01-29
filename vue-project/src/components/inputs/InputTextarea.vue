<script setup lang="ts">
import { computed } from 'vue'

// make props with default values for InputText component
const props = defineProps<{
  label: string
  placeholder?: string | null
  modelValue?: string | null
  required?: boolean
  helpText?: string | null
  errorText?: string | null
  hasError?: boolean
}>()

const htmlId = computed(() => {
  return props.label.toLowerCase().replace(/\s+/g, '-') + '-id'
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="m-textarea" :class="{ 'has-error': props.errorText && props.errorText.length > 0 }">
    <label :for="htmlId" class="m-textarea__label">{{ props.label }}</label>
    <span v-if="props.errorText" class="m-textarea__error-text">{{ props.errorText }}</span>
    <textarea
      class="m-textarea__input"
      :id="htmlId"
      :placeholder="props.placeholder ?? ''"
      :required="props.required"
      :value="props.modelValue ?? ''"
      @input="emits('update:modelValue', ($event.target as HTMLTextAreaElement)?.value ?? '')"
    ></textarea>
    <span v-if="props.helpText" class="m-textarea__help-text">{{ props.helpText }}</span>
  </div>
</template>
