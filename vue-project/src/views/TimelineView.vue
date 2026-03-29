<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import TimelineSidebar from '@/components/timeline/TimelineSidebar.vue'
import ExhibitList from '@/components/timeline/ExhibitList.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'
import type {
  TimelineEvent as iTimelineEvent,
  ListTimelineEventsResponse,
} from '@/types/list-timeline-events-api'

interface TimelineViewState {
  case: RetrieveCaseResponse | null
  eventsResponse: ListTimelineEventsResponse | null
  events: Array<iTimelineEvent> | null
}

const route = useRoute()

const state = reactive<TimelineViewState>({
  case: null,
  eventsResponse: null,
  events: null,
})

const caseUuid = route.params.caseUuid as string
const caseTitle = computed(() => state.case?.title || 'Loading...')
const timelineId = computed(() => route.params.timelineId as string)

onMounted(async () => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
  })
})
</script>

<template>
  <div class="v-timeline">
    <CaseHeader class="v-timeline__header" :title="caseTitle" />
    <TimelineSidebar class="v-timeline__sidebar" :case-uuid="caseUuid" />
    <RouterView />
    <ExhibitList
      v-if="timelineId"
      class="v-timeline__extraction-status"
      :timeline-id="timelineId"
    />
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

  &__sidebar {
    grid-column: 1 / span 2;
    grid-row: 2;
  }

  &__extraction-status {
    grid-column: 7 / span 2;
    grid-row: 2;
    align-self: start;
  }
}
</style>
