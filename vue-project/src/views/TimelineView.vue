<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import TimelineEvent from '@/components/timeline/TimelineEvent.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'

interface TimelineViewState {
  case: RetrieveCaseResponse | null
}

const route = useRoute()

const state = reactive<TimelineViewState>({
  case: null,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

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
    <div class="v-timeline__main">
      <h2>Timeline</h2>
      <div class="v-timeline__year-wrapper">
        <h3 class="v-timeline__year-title">2023</h3>
        <div class="v-timeline__month-wrapper">
          <h4 class="v-timeline__month-title">March</h4>
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
        </div>
        <div class="v-timeline__month-wrapper">
          <h4 class="v-timeline__month-title">April</h4>
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
        </div>
        <div class="v-timeline__month-wrapper">
          <h4 class="v-timeline__month-title">May</h4>
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
        </div>
        <div class="v-timeline__month-wrapper">
          <h4 class="v-timeline__month-title">June</h4>
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
          <TimelineEvent class="v-timeline__event" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-timeline {
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
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -12px;
      width: 2px;
      height: 100%;
      background-color: var(--body-txt--secondary);
    }

    position: relative;
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
      border: 2px solid;
      background-color: var(--body-bg);
      border-radius: 50%;
    }
  }

  &__month-title {
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -16px;
      width: 6px;
      height: 6px;
      border: 2px solid;
      background-color: var(--body-bg);
      border-radius: 50%;
    }

    position: sticky;
    top: 30px;
    z-index: var(--zindex-month-title);
    border-block-end: 1px solid;
    padding-block: 4px;
    background-color: var(--body-bg);
  }
}
</style>
