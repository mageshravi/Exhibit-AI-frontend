<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ filename: string }>()

const fileIconClass = computed(() => {
  const extension = props.filename.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'docx':
      return 'c-exhibit-icon--docx'
    case 'xlsx':
      return 'c-exhibit-icon--xlsx'
    case 'pptx':
      return 'c-exhibit-icon--pptx'
    case 'eml':
      return 'c-exhibit-icon--eml'
    default:
      return 'c-exhibit-icon'
  }
})
</script>

<template>
  <span class="c-exhibit-icon" :class="fileIconClass"></span>
</template>

<style lang="scss">
.c-exhibit-icon {
  --icon-size: 48px;

  display: inline-block;
  width: var(--icon-size);
  height: var(--icon-size);
  background-image: url('/sprite-file-icons.svg');
  background-size: calc(var(--icon-size) * 5) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left top;
  flex-shrink: 0;

  &--docx {
    background-position-x: calc(-1 * var(--icon-size));
  }

  &--xlsx {
    background-position-x: calc(-2 * var(--icon-size));
  }

  &--pptx {
    background-position-x: calc(-3 * var(--icon-size));
  }

  &--eml {
    background-position-x: calc(-4 * var(--icon-size));
  }
}
</style>
