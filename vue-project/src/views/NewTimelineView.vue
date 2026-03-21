<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import InputText from '@/components/inputs/InputText.vue'
import InputRadio from '@/components/inputs/InputRadio.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'

interface NewTimelineViewState {
  case: RetrieveCaseResponse | null
  timelineName: string
  exhibitSelection: 'all' | 'limited'
}

const route = useRoute()

const state = reactive<NewTimelineViewState>({
  case: null,
  timelineName: '',
  exhibitSelection: 'all',
})

onMounted(() => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
  })
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
    <button class="m-btn m-btn--primary">Create Timeline</button>
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
}
</style>
