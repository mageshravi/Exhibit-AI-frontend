<script lang="ts" setup>
import { reactive, computed, onMounted, watch } from 'vue'
import TimelineExhibit from './TimelineExhibit.vue'
import { getTimelineDetails, getTimelineExhibits } from '@/utils/event'
import type {
  ListTimelineExhibitsResponse,
  TimlineExhibit,
} from '@/types/list-timline-exhibits-api'
import type { Timeline } from '@/types/retrieve-timeline-api'

const props = defineProps<{
  timelineId: string
}>()

interface ExhibitListState {
  timeline: Timeline | null
  listExhibitsResponse: ListTimelineExhibitsResponse | null
  exhibits: Array<TimlineExhibit> | null
}

const state = reactive<ExhibitListState>({
  timeline: null,
  listExhibitsResponse: null,
  exhibits: null,
})

const timelineCreatedMessage = computed(() => {
  if (!state.listExhibitsResponse || state.listExhibitsResponse.count === 0) {
    return 'Created timeline'
  }

  return `Created timeline with ${state.listExhibitsResponse.count} exhibit${
    state.listExhibitsResponse.count > 1 ? 's' : ''
  }`
})

const timelineCreatedTimestamp = computed(() => {
  if (!state.timeline) return ''

  const date = new Date(state.timeline.created_at)
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

const fetchTimelineDetails = (timelineId: number) => {
  getTimelineDetails(timelineId).then((response) => {
    state.timeline = response.data

    if (state.timeline.event_extraction_status !== 'completed') {
      fetchTimelineExhibits(timelineId)
    }
  })
}

const fetchTimelineExhibits = (timelineId: number, pageNumber: number = 1) => {
  getTimelineExhibits(timelineId, pageNumber).then((response) => {
    state.listExhibitsResponse = response.data
    state.exhibits = [...(state.exhibits || []), ...response.data.results]
  })
}

const loadMoreExhibits = () => {
  if (state.listExhibitsResponse?.next) {
    const url = new URL(state.listExhibitsResponse.next)
    const pageNumber = url.searchParams.get('page') || '1'
    fetchTimelineExhibits(Number(props.timelineId), Number(pageNumber))
  }
}

onMounted(() => {
  fetchTimelineDetails(Number(props.timelineId))
})

watch(
  () => props.timelineId,
  (newTimelineId) => {
    state.timeline = null
    state.listExhibitsResponse = null
    state.exhibits = null
    fetchTimelineDetails(Number(newTimelineId))
  },
)
</script>

<template>
  <div class="c-timeline-exhibits-list">
    <div
      class="c-timeline-exhibits-list__timeline-info"
      v-if="state.timeline && state.timeline.event_extraction_status !== 'completed'"
    >
      <span class="c-timeline-exhibits-list__icon m-alert-icon"></span>
      <p class="c-timeline-exhibits-list__timeline-message">
        {{ timelineCreatedMessage }}
        <span class="c-timeline-exhibits-list__timeline-timestamp">{{
          timelineCreatedTimestamp
        }}</span>
      </p>
    </div>
    <TimelineExhibit
      v-for="exhibit in state.exhibits"
      :key="exhibit.id"
      :extraction-status="exhibit.event_extraction_status"
      :filename="exhibit.filename"
      :timestamp="exhibit.updated_at"
    />
    <button
      v-if="state.listExhibitsResponse?.next"
      class="m-btn m-btn--secondary"
      @click="loadMoreExhibits"
    >
      Load More
    </button>
  </div>
</template>

<style lang="scss">
.c-timeline-exhibits-list {
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  &__timeline-info {
    display: flex;
    column-gap: 12px;
  }

  &__timeline-message {
    margin-block: 0;
  }

  &__timeline-timestamp {
    display: block;
    color: var(--body-txt--secondary);
    font-size: 0.875rem;
  }
}
</style>
