<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import type { ListTimelinesResponse, Timeline } from '@/types/list-timelines-api'
import NewTimelineButton from './NewTimelineButton.vue'
import { getTimelines } from '@/utils/event'

interface TimelineSidebarState {
  timelinesResponse: ListTimelinesResponse | null
  timelines: Array<Timeline> | null
}

const props = defineProps<{
  caseUuid: string
}>()

const state = reactive<TimelineSidebarState>({
  timelinesResponse: null,
  timelines: null,
})

onMounted(() => {
  getTimelines(props.caseUuid).then((response) => {
    state.timelinesResponse = response.data
    state.timelines = response.data.results
  })
})

watch(
  () => props.caseUuid,
  (newCaseUuid) => {
    getTimelines(newCaseUuid).then((response) => {
      state.timelinesResponse = response.data
      state.timelines = response.data.results
    })
  },
)
</script>

<template>
  <aside class="c-timeline-sidebar">
    <NewTimelineButton class="c-timeline-sidebar__create-btn" />
    <h4 class="c-timeline-sidebar__title">Your Timelines</h4>
    <nav class="c-timeline-sidebar__nav">
      <template v-if="state.timelines && state.timelines.length > 0">
        <router-link
          v-for="timeline in state.timelines"
          :key="timeline.id"
          :to="{
            name: 'TimelineDetail',
            params: { caseUuid: props.caseUuid, timelineId: timeline.id },
          }"
          class="c-timeline-sidebar__link"
          >{{ timeline.name }}</router-link
        >
      </template>
      <em v-else class="c-timeline-sidebar__empty">No timelines available.</em>
    </nav>
  </aside>
</template>

<style lang="scss">
.c-timeline-sidebar {
  display: flex;
  flex-direction: column;
  text-align: end;

  &__title {
    padding-inline: 12px;
  }

  &__create-btn {
    align-self: flex-end;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    max-width: 100%;
  }

  &__link {
    padding: 6px 12px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: var(--body-txt--secondary);
    border-radius: 6px;

    &:hover {
      background-color: var(--panel-bg);
    }

    &[aria-selected='true'],
    &.router-link-exact-active {
      color: white;
      background-color: var(--theme-tint);
    }
  }

  &__empty {
    font-style: italic;
    color: var(--body-txt--secondary);
  }
}
</style>
