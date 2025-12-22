<script setup lang="ts">
import { reactive } from 'vue'
// make props with default values for InputText component
const props = defineProps<{
  label: string
  placeholder?: string | null
  value?: string | null
  required?: boolean
  helpText?: string | null
  errorText?: string | null
  hasError?: boolean
}>()

interface InputTextState {
  label: string
  placeholder: string | null
  value: string | null
  required: boolean
  helpText: string | null
  errorText: string | null
}

const state = reactive<InputTextState>({
  label: props.label || 'Input Label',
  placeholder: props.placeholder || '',
  value: props.value || '',
  required: props.required || false,
  helpText: props.helpText || null,
  errorText: props.errorText || null,
})
</script>

<template>
  <div class="m-textbox" :class="{ 'has-error': state.errorText && state.errorText.length > 0 }">
    <label for="textbox-id" class="m-textbox__label">{{ state.label }}</label>
    <span class="m-textbox__error-text">{{ state.errorText }}</span>
    <input
      type="text"
      id="textbox-id"
      class="m-textbox__input"
      :placeholder="state.placeholder ?? ''"
      :required="state.required"
      :value="state.value ?? ''"
    />
    <span class="m-textbox__help-text">{{ state.helpText }}</span>
  </div>
</template>
