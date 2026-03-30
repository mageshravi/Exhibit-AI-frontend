<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive, computed, onMounted, watch } from 'vue'

import TimelineEvent from '@/components/timeline/TimelineEvent.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import { getTimelineEvents, getTimelineDetails } from '@/utils/event'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'
import type {
  TimelineEvent as iTimelineEvent,
  ListTimelineEventsResponse,
} from '@/types/list-timeline-events-api'
import type { Timeline } from '@/types/retrieve-timeline-api'

interface TimelineDetailViewState {
  case: RetrieveCaseResponse | null
  timeline: Timeline | null
  timelineEventsResponse: ListTimelineEventsResponse | null
  events: Array<iTimelineEvent> | null
}

const route = useRoute()

const state = reactive<TimelineDetailViewState>({
  case: null,
  timeline: null,
  timelineEventsResponse: null,
  events: null,
})

const groupedEvents = computed(() => {
  if (!state.events) return {}

  return state.events.reduce(
    (groups, event) => {
      const date = new Date(event.event_date)
      const year = date.getFullYear()
      const month = date.toLocaleString('en-US', { month: 'short' })

      if (!groups[year]) {
        groups[year] = {}
      }
      if (!groups[year][month]) {
        groups[year][month] = []
      }
      groups[year][month].push(event)

      return groups
    },
    {} as Record<string, Record<string, iTimelineEvent[]>>,
  )
})

const activeTimeline = computed(() => {
  return state.timeline?.name || 'Loading Timeline...'
})

const nextPage = computed(() => {
  if (!state.timelineEventsResponse?.next) return 1
  const url = new URL(state.timelineEventsResponse.next)
  return parseInt(url.searchParams.get('page') || '1')
})

onMounted(() => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
    document.title = `Timelines - ${state.case.title} | Exhibit AI`
  })

  loadTimeline()
})

function loadTimeline(loadEvents = true) {
  const timelineId = parseInt(route.params.timelineId as string, 10)

  getTimelineDetails(timelineId).then((response) => {
    state.timeline = response.data
    document.title = `${state.timeline.name} - ${state.case?.title} | Exhibit AI`

    if (!loadEvents) return

    if (state.timeline.event_extraction_status === 'completed') {
      getTimelineEvents(timelineId).then((response) => {
        state.timelineEventsResponse = response.data
        state.events = response.data.results.reverse()
      })
    }
  })
}

function loadMoreEvents() {
  if (!state.timelineEventsResponse?.next) return

  const timelineId = parseInt(route.params.timelineId as string, 10)
  getTimelineEvents(timelineId, nextPage.value).then((response) => {
    state.timelineEventsResponse = response.data
    state.events = [...(state.events || []), ...response.data.results.reverse()]
  })
}

watch(
  () => route.params.timelineId,
  () => {
    state.timeline = null
    state.timelineEventsResponse = null
    state.events = null
    loadTimeline()
  },
)
</script>

<template>
  <div class="v-timeline__main v-timeline__main--detail">
    <h2 class="v-timeline__timeline-title">{{ activeTimeline || 'Timeline' }}</h2>
    <div v-if="state.timeline?.event_extraction_status === 'pending'">
      <h4>Timeline generation is queued.</h4>
      <p class="v-timeline__status-desc">
        <em>Your request is in line and will begin shortly.</em>
      </p>
      <p class="v-timeline__status-desc">
        <em
          >You can continue using the application. The timeline will start processing
          automatically.</em
        >
      </p>
    </div>
    <div v-if="state.timeline?.event_extraction_status === 'processing'">
      <h4>Your timeline is being generated.</h4>
      <p class="v-timeline__status-desc">
        <em>This may take up to 10 minutes, depending on the number and size of exhibits.</em>
      </p>
      <p class="v-timeline__status-desc">
        <em
          >You don't need to stay on this page. Feel free to continue using other parts of the
          application.</em
        >
      </p>
      <p class="v-timeline__status-desc">
        <em>You can return here later to view the completed timeline.</em>
      </p>
    </div>
    <div v-if="state.timeline?.event_extraction_status === 'completed'">
      <div class="v-timeline__year-wrapper" v-for="(months, year) in groupedEvents" :key="year">
        <h3 class="v-timeline__year-title">{{ year }}</h3>
        <div class="v-timeline__month-wrapper" v-for="(events, month) in months" :key="month">
          <h4 class="v-timeline__month-title">{{ month }}</h4>
          <TimelineEvent
            class="v-timeline__event"
            v-for="event in events"
            :key="event.id"
            :event="event"
          />
        </div>
      </div>
      <button class="m-btn" v-if="state.timelineEventsResponse?.next" @click="loadMoreEvents">
        Load More
      </button>
    </div>
    <div v-if="state.timeline?.event_extraction_status === 'failed'">
      <h4>Timeline generation failed.</h4>
      <p class="v-timeline__status-desc">
        <em>Please retry the process.</em>
      </p>
      <p class="v-timeline__status-desc">
        <em>If the problem persists, check the selected exhibits or reach out to support.</em>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.v-timeline {
  --timeline-track: #dcdcdc;
  --title-bg: var(--panel-bg);
  --zindex-year-title: 2;
  --zindex-month-title: 1;

  display: grid;
  margin-inline: auto;
  padding-block-end: 2rem;
  min-width: 1200px;
  max-width: 1440px;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 20px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
    grid-row: 1;
  }

  &__sidebar {
    grid-column: 1 / span 2;
    grid-row: 2;
  }

  &__main {
    grid-column: 3 / span 4;
    grid-row: 2;
    padding: 18px;
    border-radius: 1rem;

    &--detail {
      background: var(--panel-bg);
    }
  }

  &__status-desc {
    color: var(--body-txt--secondary);
  }

  &__timeline-title {
    margin-block-start: 0;
  }

  &__year-wrapper {
    position: relative;
    padding-inline-start: 18px;

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 6px; // calc(-12px+18px);
      width: 2px;
      height: 100%;
      background-color: var(--timeline-track);
    }
  }

  &__year-title {
    position: sticky;
    top: 0;
    z-index: var(--zindex-year-title);
    border-block-end: 1px solid;
    padding-block: 4px;
    background-color: var(--title-bg);

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -16px;
      width: 6px;
      height: 6px;
      border: 2px solid var(--timeline-track);
      background-color: var(--title-bg);
      border-radius: 50%;
    }
  }

  &__month-title {
    position: sticky;
    top: 30px;
    z-index: var(--zindex-month-title);
    border-block-end: 1px solid;
    padding-block: 4px;
    background-color: var(--title-bg);

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -16px;
      width: 6px;
      height: 6px;
      border: 2px solid var(--timeline-track);
      background-color: var(--title-bg);
      border-radius: 50%;
    }
  }
}
</style>
