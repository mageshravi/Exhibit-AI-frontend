<script setup lang="ts">
import type { Exhibit } from '@/types/list-exhibits-api'
import IconExhibit from '../icons/IconExhibit.vue'
import { computed } from 'vue'

const props = defineProps<{ exhibit: Exhibit | null }>()
const fileDisplay = computed(() => {
  if (!props.exhibit) {
    return ''
  }
  const filename = props.exhibit.filename || props.exhibit.file.split('/').pop() || 'Unknown'
  return filename
})

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) {
    return ''
  }
  const date = new Date(dateStr)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const emits = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="c-view-exhibit">
    <div class="c-view-exhibit__overlay" @click="emits('close')"></div>
    <div class="c-view-exhibit__modal u-dialog-box-shadow">
      <div class="c-view-exhibit__title-bar">
        <IconExhibit :filename="fileDisplay" />
        <div class="c-view-exhibit__file-info">
          <span v-if="props.exhibit?.exhibit_code" class="c-view-exhibit__code">{{
            props.exhibit?.exhibit_code
          }}</span>
          <span class="c-view-exhibit__name" :title="fileDisplay">{{ fileDisplay }}</span>
          <small class="c-view-exhibit__status">{{ props.exhibit?.status }}</small>
        </div>
      </div>
      <div class="c-view-exhibit__body">
        <p v-if="props.exhibit?.created_at">
          Uploaded on <b>{{ formatDate(props.exhibit?.created_at) }}</b>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.c-view-exhibit {
  &__overlay {
    position: fixed;
    z-index: 100;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.25);
  }
  &__modal {
    position: fixed;
    z-index: 101;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: var(--panel-bg);
    width: 490px;
    border-radius: 10px;
    overflow: hidden;
  }
  &__title-bar {
    display: flex;
    flex-flow: row;
    column-gap: 12px;
    align-items: center;
    padding: 20px 26px 16px 20px;
    background-color: var(--body-bg);
  }
  &__code {
    margin-inline-end: 10px;
    font-weight: bold;
    color: var(--oxford-blue);
  }
  &__status {
    display: block;
    color: var(--body-txt--secondary);
  }
  &__body {
    display: flex;
    flex-flow: column;
    row-gap: 16px;
    padding: 16px 20px 20px 20px;
  }
}
</style>
