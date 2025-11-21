<script setup lang="ts">
import type { Exhibit } from '@/types/list-exhibits-api'
import { computed } from 'vue'

const props = defineProps<Exhibit>()
const fileDisplay = computed(() => {
  const filename = props.filename || props.file.split('/').pop() || 'Unknown'
  return filename
})

const fileIconClass = computed(() => {
  const extension = fileDisplay.value.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'docx':
      return 'c-file--docx'
    case 'xlsx':
      return 'c-file--xlsx'
    case 'pptx':
      return 'c-file--pptx'
    case 'eml':
      return 'c-file--eml'
    default:
      return 'c-file'
  }
})
</script>
<template>
  <div class="c-exhibit-item">
    <span class="c-file" :class="fileIconClass"></span>
    <div class="c-exhibit-item__file-info">
      <p class="c-exhibit-item__name" :title="fileDisplay">{{ fileDisplay }}</p>
      <small class="c-exhibit-item__status">{{ props.status }}</small>
    </div>
    <div class="c-exhibit-item__file-actions">
      <a class="c-exhibit-item__action" :href="props.file" download></a>
      <span class="c-exhibit-item__action c-exhibit-item__action--info"></span>
      <span class="c-exhibit-item__action c-exhibit-item__action--edit"></span>
    </div>
  </div>
</template>

<style lang="scss">
.c-exhibit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;

  &:hover {
    background-color: var(--panel-bg);
  }

  &__name {
    margin: 0;
    white-space: nowrap;
  }

  &:hover &__name {
    max-width: 24ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__status {
    color: var(--body-txt--secondary);

    &.is-pending {
      color: var(--alert-warning);
    }

    &.is-processing {
      color: var(--alert-info);
    }
  }

  &__file-actions {
    visibility: hidden;
    display: flex;
    gap: 40px;
    margin-left: auto;
    padding-inline: 40px;
  }

  &:hover &__file-actions {
    visibility: visible;
  }

  &__action {
    cursor: pointer;
    display: inline-flex;
    padding: 10px;

    &:hover {
      background-color: white;
      border-radius: 50%;
    }

    &::after {
      --icon-size: 24px;
      --padding: 10px;

      content: '';
      display: inline-block;
      width: var(--icon-size);
      height: var(--icon-size);
      background-image: url('/sprite-exhibit-item-icons.svg');
      background-size: calc(var(--icon-size) * 3) var(--icon-size);
      background-repeat: no-repeat;
      background-position: left center;
      flex-shrink: 0;
      overflow: hidden;
    }

    &--info::after {
      background-position-x: calc(-1 * var(--icon-size));
    }

    &--edit::after {
      background-position-x: calc(-2 * var(--icon-size));
    }
  }
}
.c-file {
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
