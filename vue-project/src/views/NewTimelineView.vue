<script setup lang="ts">
import { reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from '@/components/inputs/InputText.vue'
import InputRadio from '@/components/inputs/InputRadio.vue'
import { getCaseDetails_v2, getCaseExhibits_v2 } from '@/utils/case'
import type { Exhibit, ListExhibitsResponse } from '@/types/list-exhibits-api'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'
import { createTimeline as _createTimeline, type CreateTimelineRequest } from '@/utils/event'
import InputCheckbox from '@/components/inputs/InputCheckbox.vue'

interface NewTimelineViewState {
  case: RetrieveCaseResponse | null
  timelineName: string
  exhibitSelection: 'all' | 'limited'
  exhibitsResponse: ListExhibitsResponse | null
  exhibitsList: Array<Exhibit> | null
  selectedExhibits: Set<number>
  createBtnDisabled: boolean
  createTimelineMessage: string
}

const route = useRoute()
const router = useRouter()

const state = reactive<NewTimelineViewState>({
  case: null,
  timelineName: '',
  exhibitSelection: 'all',
  exhibitsResponse: null,
  exhibitsList: null,
  selectedExhibits: new Set<number>(),
  createBtnDisabled: true,
  createTimelineMessage: '',
})

const canLoadMoreExhibits = computed(() => {
  if (!state.exhibitsResponse) return false
  return state.exhibitsResponse.next !== null
})

onMounted(() => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
    document.title = `New Timeline - ${state.case.title} | Exhibit AI`
  })
})

const fetchExhibits = (caseUuid: string) => {
  getCaseExhibits_v2(caseUuid).then((response) => {
    state.exhibitsResponse = response.data
    state.exhibitsList = response.data.results
  })
}

const loadMoreExhibits = (ev: Event) => {
  ev.preventDefault()
  if (!state.exhibitsResponse || !state.exhibitsResponse.next) return
  const nextPage = parseInt(
    new URL(state.exhibitsResponse.next).searchParams.get('page') || '1',
    10,
  )
  const caseUuid = route.params.caseUuid as string
  getCaseExhibits_v2(caseUuid, nextPage).then((response) => {
    state.exhibitsResponse = response.data
    state.exhibitsList = [...(state.exhibitsList || []), ...response.data.results]
  })
}

const createTimeline = () => {
  const requestData: CreateTimelineRequest = {
    case: state.case?.uuid as string,
    name: state.timelineName,
  }

  if (state.exhibitSelection === 'limited') {
    requestData['exhibits'] = Array.from(state.selectedExhibits)
  }

  _createTimeline(requestData)
    .then((response) => {
      console.log('Timeline created:', response.data)
      alert('Timeline created successfully!')
      router.push({
        name: 'TimelineDetail',
        params: { caseUuid: state.case?.uuid, timelineId: response.data.id },
      })
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 400) {
          if ('case' in error.response.data) {
            state.createTimelineMessage = `Case error: ${error.response.data.case.join(' ')}`
          } else if ('name' in error.response.data) {
            state.createTimelineMessage = `Timeline name error: ${error.response.data.name.join(' ')}`
          } else if ('exhibits' in error.response.data) {
            state.createTimelineMessage = `Exhibits error: ${error.response.data.exhibits.join(' ')}`
          } else {
            state.createTimelineMessage = 'Invalid input. Please check your entries and try again.'
          }
          return
        } else if (error.response.status === 403) {
          state.createTimelineMessage =
            'You do not have permission to create a timeline for this case.'
          return
        }
      } else if (error.request) {
        state.createTimelineMessage =
          'No response from server. Please check your network connection and try again.'
        return
      }
      console.error('Error creating timeline:', error)
      state.createTimelineMessage =
        'An error occurred while creating the timeline. Please try again.'
    })
}

const validateForm = () => {
  if (state.timelineName.trim() === '') {
    state.createTimelineMessage = 'Timeline name is required.'
  } else if (state.exhibitSelection === 'limited' && state.selectedExhibits.size === 0) {
    state.createTimelineMessage = 'Please select at least one exhibit.'
  } else {
    state.createTimelineMessage = ''
  }

  state.createBtnDisabled = state.timelineName.trim() === ''
  state.createBtnDisabled =
    state.createBtnDisabled ||
    (state.exhibitSelection === 'limited' && state.selectedExhibits.size === 0)
}

watch(
  () => state.exhibitSelection,
  (newValue: string) => {
    const caseUuid = route.params.caseUuid as string
    if (newValue === 'limited') {
      fetchExhibits(caseUuid)
    }
  },
)

watch(() => [state.timelineName, state.exhibitSelection, state.selectedExhibits], validateForm, {
  deep: true,
})
</script>

<template>
  <div class="v-timeline__main v-timeline__main--new">
    <InputText
      label="Name"
      placeholder="E.g., Contract Negotiation Timeline"
      help-text="A short, descriptive name to help identify the sequence of events."
      required
      v-model="state.timelineName"
    />
    <div>
      <InputRadio
        label="Include all exhibits"
        name="exhibit_selection"
        value="all"
        v-model="state.exhibitSelection"
        inline
        :checked="state.exhibitSelection === 'all'"
      />
      <InputRadio
        label="Let me choose"
        name="exhibit_selection"
        value="limited"
        v-model="state.exhibitSelection"
        inline
        :checked="state.exhibitSelection === 'limited'"
      />
    </div>
    <div class="v-timeline__exhibit-list" v-if="state.exhibitSelection === 'limited'">
      <InputCheckbox
        v-for="exhibit in state.exhibitsList || []"
        :key="exhibit.id"
        :name="'exhibit_' + exhibit.id"
        :label="exhibit.filename"
        :value="exhibit.id"
        @update:model-value="
          (checked) => {
            if (checked) {
              state.selectedExhibits.add(exhibit.id)
            } else {
              state.selectedExhibits.delete(exhibit.id)
            }
          }
        "
      />
      <a href="#load-more-exhibits" v-if="canLoadMoreExhibits" @click="loadMoreExhibits"
        >Load more</a
      >
    </div>
    <em class="v-timeline__error-msg" v-if="state.createTimelineMessage">
      {{ state.createTimelineMessage }}
    </em>
    <button
      class="m-btn m-btn--primary"
      @click="createTimeline"
      :disabled="state.createBtnDisabled"
    >
      Create Timeline
    </button>
  </div>
</template>

<style lang="scss">
.v-timeline {
  &__main {
    grid-column: 3 / span 4;
    grid-row: 2;

    display: flex;
    flex-flow: column;
    row-gap: 16px;

    padding: 16px;
    border: 3px solid var(--panel-bg);
    border-radius: 8px;

    &--new {
      background: transparent;
    }

    .m-btn {
      align-self: flex-start;
    }
  }

  &__exhibit-list {
    display: flex;
    flex-flow: column;
    row-gap: 1rem;
    border: 1px solid var(--ip-border-color);
    padding: 1rem;
    background: var(--panel-bg);
    max-height: 270px;
    overflow-y: auto;
  }

  &__error-msg {
    color: var(--alert-error);
  }
}
</style>
