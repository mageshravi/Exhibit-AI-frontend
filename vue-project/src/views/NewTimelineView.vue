<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import TimelineSidebar from '@/components/timeline/TimelineSidebar.vue'
import { getCaseDetails_v2 } from '@/utils/case'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'

interface NewTimelineViewState {
  case: RetrieveCaseResponse | null
}

const route = useRoute()

const state = reactive<NewTimelineViewState>({
  case: null,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

onMounted(() => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails_v2(caseUuid).then((response) => {
    state.case = response.data
  })
})
</script>

<template>
  <div class="v-new-timeline">
    <CaseHeader class="v-new-timeline__header" :title="caseTitle" />
    <TimelineSidebar class="v-new-timeline__sidebar" />
    <div class="v-new-timeline__main">New Timeline</div>
  </div>
</template>

<style lang="scss">
.v-new-timeline {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: auto 1fr;
  gap: 16px;

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
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }
}
</style>
