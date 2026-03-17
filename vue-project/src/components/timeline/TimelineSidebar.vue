<script setup lang="ts">
import NewTimelineButton from './NewTimelineButton.vue'
</script>

<template>
  <aside class="c-timeline-sidebar">
    <NewTimelineButton />
    <h4 class="c-timeline-sidebar__title">Timelines</h4>
    <nav>
      <em class="c-timeline-sidebar__empty">No timelines available.</em>
    </nav>
  </aside>
</template>

<style lang="scss">
.c-timeline-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &__empty {
    font-style: italic;
    color: var(--body-txt--secondary);
  }
}
</style>
