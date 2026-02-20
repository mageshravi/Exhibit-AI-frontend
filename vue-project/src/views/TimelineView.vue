<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import TimelineEvent from '@/components/timeline/TimelineEvent.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import { getEvents } from '@/utils/event'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'
import type { Event, ListEventsResponse } from '@/types/list-events-api'

interface TimelineViewState {
  case: RetrieveCaseResponse | null
  eventsResponse: ListEventsResponse | null
  events: Array<Event> | null
}

const route = useRoute()

const state = reactive<TimelineViewState>({
  case: null,
  eventsResponse: null,
  events: null,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

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
    {} as Record<string, Record<string, Event[]>>,
  )
})

const nextPage = computed(() => {
  if (!state.eventsResponse?.next) return 1
  const url = new URL(state.eventsResponse.next)
  return parseInt(url.searchParams.get('page') || '1')
})

onMounted(async () => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
  })

  getEvents(caseUuid, nextPage.value).then((response) => {
    state.eventsResponse = response.data
    state.events = response.data.results
  })
})

function loadMoreEvents() {
  if (!state.eventsResponse?.next) return

  const caseUuid = route.params.caseUuid as string
  getEvents(caseUuid, nextPage.value).then((response) => {
    state.eventsResponse = response.data
    state.events = [...(state.events || []), ...response.data.results]
  })
}
</script>

<template>
  <div class="v-timeline">
    <CaseHeader class="v-timeline__header" :title="caseTitle" />
    <div class="v-timeline__main">
      <h2>Timeline</h2>
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
      <button class="m-btn" v-if="state.eventsResponse?.next" @click="loadMoreEvents">
        Load More
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.v-timeline {
  --timeline-track: #dcdcdc;
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

  &__main {
    grid-column: 3 / span 4;
    grid-row: 2;
  }

  &__year-wrapper {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -12px;
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
    background-color: var(--body-bg);

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -16px;
      width: 6px;
      height: 6px;
      border: 2px solid var(--timeline-track);
      background-color: var(--body-bg);
      border-radius: 50%;
    }
  }

  &__month-title {
    position: sticky;
    top: 30px;
    z-index: var(--zindex-month-title);
    border-block-end: 1px solid;
    padding-block: 4px;
    background-color: var(--body-bg);

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -16px;
      width: 6px;
      height: 6px;
      border: 2px solid var(--timeline-track);
      background-color: var(--body-bg);
      border-radius: 50%;
    }
  }
}
</style>
