<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  filename: string
  extractionStatus: string
  timestamp: string
}>()

const getCssClass = (status: string) => {
  return {
    'm-alert-icon': true,
    'm-alert-icon--warning': status === 'pending',
    'm-alert-icon--info': status === 'processing',
    'm-alert-icon--success': status === 'completed',
    'm-alert-icon--error': status === 'failed',
  }
}

const formattedStatus = computed(() => {
  switch (props.extractionStatus) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'completed':
      return 'Processed'
    case 'failed':
      return 'Error processing'
    default:
      return props.extractionStatus
  }
})

const formattedTimestamp = computed(() => {
  const date = new Date(props.timestamp)
  return date
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace(/:(\d{2})\s/, ':$1 ')
})
</script>

<template>
  <div class="c-timeline-exhibit">
    <span class="c-timeline-exhibit__icon" :class="getCssClass(props.extractionStatus)"></span>
    <p class="c-timeline-exhibit__info">
      {{ formattedStatus }}
      <span class="c-timeline-exhibit__filename">{{ props.filename }}</span
      ><br />
      <span class="c-timeline-exhibit__timestamp">{{ formattedTimestamp }}</span>
    </p>
  </div>
</template>

<style lang="scss">
.c-timeline-exhibit {
  display: flex;
  flex-direction: row;
  column-gap: 12px;

  &__icon {
    flex-shrink: 0;
  }

  &__info {
    margin-block: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__timestamp {
    color: var(--body-txt--secondary);
    font-size: 0.875rem;
  }
}
</style>
