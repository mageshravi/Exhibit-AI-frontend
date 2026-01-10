<script setup lang="ts">
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

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="m-textarea" :class="{ 'has-error': props.errorText && props.errorText.length > 0 }">
    <label for="textbox-id" class="m-textarea__label">{{ props.label }}</label>
    <span v-if="props.errorText" class="m-textarea__error-text">{{ props.errorText }}</span>
    <textarea
      class="m-textarea__input"
      :placeholder="props.placeholder ?? ''"
      :required="props.required"
      :value="props.modelValue ?? ''"
      @input="emits('update:modelValue', ($event.target as HTMLTextAreaElement)?.value ?? '')"
    ></textarea>
    <span v-if="props.helpText" class="m-textarea__help-text">{{ props.helpText }}</span>
  </div>
</template>
