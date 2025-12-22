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
  <div class="m-textbox" :class="{ 'has-error': props.errorText && props.errorText.length > 0 }">
    <label for="textbox-id" class="m-textbox__label">{{ props.label }}</label>
    <span v-if="props.errorText" class="m-textbox__error-text">{{ props.errorText }}</span>
    <input
      type="text"
      id="textbox-id"
      class="m-textbox__input"
      :placeholder="props.placeholder ?? ''"
      :required="props.required"
      :value="props.modelValue ?? ''"
      @input="emits('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
    />
    <span v-if="props.helpText" class="m-textbox__help-text">{{ props.helpText }}</span>
  </div>
</template>
