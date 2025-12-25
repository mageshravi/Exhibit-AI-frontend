<script setup lang="ts">
import type { Exhibit } from '@/types/list-exhibits-api'
import IconExhibit from '../icons/IconExhibit.vue'
import { computed } from 'vue'
import { deleteExhibit } from '@/utils/exhibit'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps<Exhibit>()

const emits = defineEmits<{
  (e: 'info', exhibit: Exhibit): void
  (e: 'edit', exhibit: Exhibit): void
  (e: 'refresh'): void
}>()
const fileDisplay = computed(() => {
  const filename = props.filename || props.file.split('/').pop() || 'Unknown'
  return filename
})

const deleteExhibitItem = () => {
  if (!confirm('Are you sure you want to delete this exhibit? This action cannot be undone.')) {
    return
  }

  deleteExhibit(route.params.caseUuid as string, props.id as number)
    .then(() => {
      emits('refresh')
    })
    .catch(() => {
      alert('Failed to delete exhibit.')
    })
}
</script>
<template>
  <div class="c-exhibit-item">
    <IconExhibit :filename="fileDisplay" />
    <div class="c-exhibit-item__file-info">
      <span v-if="props.exhibit_code" class="c-exhibit-item__code">{{ props.exhibit_code }}</span>
      <span class="c-exhibit-item__name" :title="fileDisplay">{{ fileDisplay }}</span>
      <small class="c-exhibit-item__status">{{ props.status }}</small>
    </div>
    <div class="c-exhibit-item__file-actions">
      <a class="c-exhibit-item__action" :href="props.file" download></a>
      <span
        class="c-exhibit-item__action c-exhibit-item__action--info"
        @click="emits('info', props)"
      ></span>
      <span
        class="c-exhibit-item__action c-exhibit-item__action--edit"
        @click="emits('edit', props)"
      ></span>
      <span
        class="c-exhibit-item__action c-exhibit-item__action--delete"
        @click="deleteExhibitItem"
      ></span>
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

  &__file-info {
    white-space: nowrap;
  }

  &:hover &__file-info {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__code {
    margin-inline-end: 10px;
    font-weight: bold;
    color: var(--oxford-blue);
  }

  &__name {
    margin: 0;
  }

  &__status {
    color: var(--body-txt--secondary);
    display: block;

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
    gap: 20px;
    margin-left: auto;
    padding-inline: 20px;
    justify-self: flex-end;
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
      background-size: calc(var(--icon-size) * 4) var(--icon-size);
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

    &--delete::after {
      background-position-x: calc(-3 * var(--icon-size));
    }
  }
}
</style>
