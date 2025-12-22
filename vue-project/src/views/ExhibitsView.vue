<script setup lang="ts">
import CaseHeader from '@/components/CaseHeader.vue'
import UploadFiles from '@/components/exhibits/UploadFiles.vue'
import ExhibitItem from '@/components/exhibits/ExhibitItem.vue'
import EditExhibitModal from '@/components/exhibits/EditExhibitModal.vue'
import ThePagination from '@/components/ThePagination.vue'
import { reactive, computed, onMounted, watch } from 'vue'
import type { Case } from '@/types/chat-types'
import type { Exhibit, ListExhibitsResponse } from '@/types/list-exhibits-api'
import { getCaseDetails, getCaseExhibits } from '@/utils/case'
import { useRoute } from 'vue-router'

interface ExhibitsState {
  case: Case | null
  page: number
  listExhibitsResponse: ListExhibitsResponse | null
  editExhibit: Exhibit | null
}

const route = useRoute()

let page = 1
if (route.query.page) {
  page = parseInt(route.query.page?.toString()) || 1
}

const pageSize = 20

const state = reactive<ExhibitsState>({
  case: null,
  page: page,
  listExhibitsResponse: null,
  editExhibit: null,
})

const totalPages = computed(() => {
  if (!state.listExhibitsResponse) {
    return 1
  }

  return Math.ceil(state.listExhibitsResponse.count / pageSize)
})

const fetchExhibits = () => {
  const caseUuid = route.params.caseUuid as string

  getCaseExhibits(caseUuid, state.page).then((apiResponse) => {
    state.listExhibitsResponse = apiResponse
  })
}

onMounted(() => {
  const caseUuid = route.params.caseUuid as string

  getCaseDetails(caseUuid).then((caseData) => {
    if (!caseData) {
      return
    }

    state.case = caseData
  })

  fetchExhibits()
})

watch(
  () => route.query.page,
  (newPage) => {
    let pageNumber = 1
    if (newPage) {
      pageNumber = parseInt(newPage?.toString()) || 1
    }
    state.page = pageNumber

    fetchExhibits()
  },
)
</script>

<template>
  <div class="v-exhibits-page">
    <case-header class="v-exhibits-page__header" :title="state.case?.title || 'Loading...'" />
    <upload-files class="v-exhibits-page__upload" compact />
    <div class="v-exhibits-page__exhibit-list">
      <exhibit-item
        v-for="exhibit in state.listExhibitsResponse?.results"
        :key="exhibit.id"
        v-bind="exhibit"
        @edit="
          (exhibit) => {
            state.editExhibit = exhibit
          }
        "
      />
      <the-pagination :current="state.page" :total="totalPages"></the-pagination>
    </div>
    <edit-exhibit-modal
      v-if="state.editExhibit"
      :exhibit="state.editExhibit"
      @update-exhibit="fetchExhibits"
      @close="state.editExhibit = null"
    />
  </div>
</template>

<style lang="scss">
.v-exhibits-page {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 20px;
  margin-inline: auto;
  min-width: 1200px;
  max-width: 1440px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
  }

  &__upload {
    grid-column: 3 / span 4;
    grid-row: 2;
  }

  &__exhibit-list {
    grid-column: 3 / span 4;
    grid-row: 3;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-block-start: 16px;
  }
}
</style>
