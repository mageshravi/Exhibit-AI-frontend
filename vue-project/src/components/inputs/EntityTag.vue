<script setup lang="ts">
export interface Entity {
  label: string
  value: string
}

const props = defineProps<Entity>()

const emits = defineEmits<{
  (e: 'remove', value: string): void
}>()
</script>
<template>
  <span class="m-entity-tag" :data-value="props.value">
    {{ props.label }}
    <span class="m-entity-tag__icon-x" @click="emits('remove', props.value)"></span>
  </span>
</template>
