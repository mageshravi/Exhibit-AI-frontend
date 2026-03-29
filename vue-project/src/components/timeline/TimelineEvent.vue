<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineEvent } from '@/types/list-timeline-events-api'
const props = defineProps<{
  event: TimelineEvent
}>()

const formattedDate = computed(() => {
  const date = new Date(props.event.event_date)
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="c-timeline-event">
    <span class="c-timeline-event__date">{{ formattedDate }}</span>
    <p class="c-timeline-event__title">
      <strong>{{ props.event.title }}</strong>
    </p>
    <p class="c-timeline-event__description">
      {{ props.event.description }}
    </p>
  </div>
</template>

<style lang="scss">
.c-timeline-event {
  margin-block-end: 48px;
  padding-inline: 12px;

  &__date {
    color: var(--body-txt--secondary);
    font-size: 14px;
  }

  &__title {
    position: relative;
    margin-block: 4px;
    color: var(--heading-txt);

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: -28px;
      width: 6px;
      height: 6px;
      border: 2px solid var(--timeline-track);
      background-color: var(--body-bg);
      transform: rotate(45deg);
    }
  }
  &__description {
    margin-block-start: 0;
  }
}
</style>
