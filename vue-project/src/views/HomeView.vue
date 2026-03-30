<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputSearch from '@/components/inputs/InputSearch.vue'
import SearchResult from '@/components/case/SearchResult.vue'
import { searchCases } from '@/utils/case'
import type { Case, ListCasesResponse } from '@/types/list-cases-api'

const router = useRouter()

interface HomeState {
  searchQuery: string
  searchResponse: ListCasesResponse | null
  selectedResultIndex?: number
}

const state = reactive<HomeState>({
  searchQuery: '',
  searchResponse: null,
  selectedResultIndex: -1,
})

function handleKeyUp(event: KeyboardEvent) {
  if (!state.searchResponse?.results.length) return

  if (event.key === 'ArrowDown') {
    state.selectedResultIndex =
      (state.selectedResultIndex! + 1) % state.searchResponse.results.length
  } else if (event.key === 'ArrowUp') {
    state.selectedResultIndex =
      (state.selectedResultIndex! - 1 + state.searchResponse.results.length) %
      state.searchResponse.results.length
  } else if (event.key === 'Enter') {
    const selectedCase = state.searchResponse.results[state.selectedResultIndex!]
    if (selectedCase) {
      goToCase(selectedCase.uuid)
    }
  }
}

function transformCaseToSearchResult(caseItem: Case) {
  return {
    displayText: caseItem.case_number
      ? `${caseItem.case_number}&nbsp;&nbsp;&nbsp;&nbsp;${caseItem.title}`
      : caseItem.title,
    value: caseItem.uuid,
  }
}

function goToCase(caseUuid: string) {
  router.push({ name: 'CaseDetail', params: { caseUuid: caseUuid } })
}

watch(
  () => state.searchQuery,
  (newQuery) => {
    if (newQuery.trim().length < 3) {
      state.searchResponse = null
      return
    }
    searchCases(newQuery)
      .then((response) => {
        state.searchResponse = response.data
        state.selectedResultIndex = -1

        if (state.searchResponse.results.length > 0) {
          state.selectedResultIndex = 0
        }
      })
      .catch((error) => {
        console.error('Error searching cases:', error)
      })
  },
)
</script>

<template>
  <div class="v-home">
    <div class="v-home__container">
      <button
        type="button"
        class="m-btn m-btn--secondary v-home__new-case-btn"
        @click="$router.push({ name: 'NewCase' })"
        tabindex="-1"
      >
        New Case
      </button>
      <h1 class="v-home__title">Exhibit AI</h1>
      <InputSearch
        class="v-home__search-wrapper"
        placeholder="Search cases by title or case number"
        v-model:value="state.searchQuery"
        @keyup.prevent="handleKeyUp"
      />
      <div class="v-home__search-results-wrapper">
        <SearchResult
          v-for="result in state.searchResponse?.results"
          :key="result.uuid"
          :result="transformCaseToSearchResult(result)"
          :searchQuery="state.searchQuery"
          :focused="state.searchResponse?.results.indexOf(result) === state.selectedResultIndex"
          @select="goToCase"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px); // Adjust for header height

  &__container {
    position: relative;
    width: 100%;
    max-width: 610px;
    min-height: 300px;
  }

  &__new-case-btn {
    position: absolute;
    top: 0;
    right: 11px;
  }

  &__title {
    margin-block: 0 2rem;
    text-align: center;
  }

  &__search-wrapper {
    width: 100%;
  }

  &__search-results-wrapper {
    padding-block-start: 4px;
    padding-inline: 32px 18px;

    // if any sibling is hovered, remove focus background
    &:hover .c-search-result.is-focused:not(:hover) {
      background-color: transparent;
    }
  }
}
</style>
