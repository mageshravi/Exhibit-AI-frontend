<script setup lang="ts">
import { watch, reactive, ref } from 'vue'
import type { Litigant } from '@/types/list-litigants-api'
import { searchLitigants } from '@/utils/litigant'
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import InputSearch from '@/components/inputs/InputSearch.vue'
import SearchResult from '@/components/litigant/SearchResult.vue'
import LitigantInfo from './LitigantInfo.vue'

const props = defineProps<{
  litigantType?: 'plaintiff' | 'defendant' | 'witness'
}>()

const searchInput = ref<HTMLInputElement | null>(null)

interface AddLitigantState {
  searchQuery: string
  searchFocused: boolean
  searchResults: Litigant[] | null
  focusedResultIndex: number
  selectedLitigant: Litigant | null
}

const state = reactive<AddLitigantState>({
  searchQuery: '',
  searchFocused: false,
  searchResults: null,
  focusedResultIndex: -1,
  selectedLitigant: null,
})

const emits = defineEmits<{
  (e: 'confirm', litigant: Litigant): void
  (e: 'modal:close'): void
}>()

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function enterSearchMode() {
  state.searchFocused = true
}
function exitSearchMode() {
  state.searchQuery = ''
  state.searchFocused = false
  state.searchResults = null
  state.focusedResultIndex = -1
  state.selectedLitigant = null
}

function incrementSelectedIndex() {
  if (state.searchResults && state.searchResults.length > 0) {
    state.focusedResultIndex = (state.focusedResultIndex + 1) % state.searchResults.length
  }
}
function decrementSelectedIndex() {
  if (state.focusedResultIndex === -1 && state.searchResults && state.searchResults.length > 0) {
    state.focusedResultIndex = state.searchResults.length - 1
    return
  }

  if (state.searchResults && state.searchResults.length > 0) {
    state.focusedResultIndex =
      (state.focusedResultIndex - 1 + state.searchResults.length) % state.searchResults.length
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  // handle UP key
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    decrementSelectedIndex()
    return
  }
  // handle DOWN key
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    incrementSelectedIndex()
    return
  }
  // handle ENTER key
  else if (event.key === 'Enter') {
    event.preventDefault()

    if (
      state.searchResults &&
      state.focusedResultIndex >= 0 &&
      state.focusedResultIndex < state.searchResults.length
    ) {
      state.selectedLitigant = state.searchResults[state.focusedResultIndex]
    }
    return
  }
  // handle ESC key
  else if (event.key === 'Escape') {
    exitSearchMode()
    return
  }

  // finally, perform search
  performSearch(event)
}

const performSearch = (event: KeyboardEvent) => {
  const query = (event.target as HTMLInputElement).value?.trim()

  if (!query || query.length < 3) {
    state.searchResults = []
    return
  }

  searchLitigants(query)
    ?.then((response) => {
      if (!response?.data || !response.data.results) {
        state.searchResults = []
        return
      }
      state.searchResults = response.data.results
    })
    .catch((error) => {
      console.error('Error searching litigants:', error)
    })
}

watch(
  () => state.selectedLitigant,
  (newVal: Litigant | null) => {
    if (newVal === null) {
      searchInput.value?.focus()
    }
  },
)
</script>

<template>
  <div class="c-add-litigant">
    <header class="c-add-litigant__header">
      <InputSearch
        ref="searchInput"
        placeholder="Search Litigant"
        v-model:value="state.searchQuery"
        @focus:in="enterSearchMode"
        @keyup="handleKeyUp"
      />
    </header>
    <div class="c-add-litigant__body">
      <h2>Add {{ toTitleCase(props.litigantType || 'Litigant') }}</h2>
      <InputText label="Full Name" placeholder="Santhosh Subramanian" required />
      <InputText label="Bio" placeholder="Managing Director, Sanyogi Ltd" required />
      <InputTextarea
        label="Address"
        placeholder="1234 Elm Street, Springfield, IL, 62704"
        required
      />
      <InputText label="Email" placeholder="santhoshsub@yahoomail.com" />
      <InputText
        label="Mobile"
        placeholder="+91-9500027232"
        help-text="Format: +(country-code)-(10-digit-phone-number) without spaces."
      />
      <InputTextarea
        label="Notes"
        placeholder="Any other relevant information about the litigant."
      />
      <div>
        <button type="button" class="m-btn m-btn--primary">
          Add {{ toTitleCase(props.litigantType || 'Litigant') }}
        </button>
        &nbsp;
        <button type="button" class="m-btn m-btn--secondary" @click="emits('modal:close')">
          Cancel
        </button>
      </div>
    </div>
    <div
      class="c-add-litigant__overlay"
      :class="{ 'is-hidden': !state.searchFocused }"
      @click.self="exitSearchMode"
    >
      <Transition name="fade-left">
        <LitigantInfo
          v-if="state.selectedLitigant"
          class="c-add-litigant__selected-info"
          :litigant="state.selectedLitigant"
          :type="props.litigantType || 'plaintiff'"
          @confirm="emits('confirm', $event)"
          @modal:close="state.selectedLitigant = null"
        />
      </Transition>
      <Transition name="fade-up">
        <div
          class="c-add-litigant__results-wrapper"
          v-if="!state.selectedLitigant && state.searchResults?.length"
        >
          <SearchResult
            :class="{ 'is-selected': state.focusedResultIndex === index }"
            v-for="(result, index) in state.searchResults"
            :key="result.id"
            :result="result"
            @click.stop="state.selectedLitigant = result"
          />
        </div>
      </Transition>
      <div
        class="c-add-litigant__default-msg"
        v-if="!state.selectedLitigant && !state.searchResults?.length"
      >
        <p>Start typing to see results.</p>
        <p>Press ESC to exit search mode.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.c-add-litigant {
  --zindex-header: 1001;
  --zindex-overlay: 1000;
  --zindex-search-icon: 1000;
  --zindex-overlay--hidden: -1;

  position: relative;

  &__header {
    position: relative;
    z-index: var(--zindex-header);
    padding: 10px;
    background-color: var(--panel-bg);
    height: fit-content;

    .m-searchbox {
      margin-inline: auto;
      width: 350px;
      transition: all 0.15s ease-in-out;

      &::before {
        z-index: var(--zindex-search-icon);
      }
    }

    &:has(:focus) .m-searchbox {
      width: 450px;
      background-color: var(--body-bg);
      transition: all 0.15s ease-in-out;
    }
  }

  &__body {
    display: flex;
    flex-flow: column;
    row-gap: 16px;
    margin-inline: auto;
    padding-block-end: 32px;
    max-width: 550px;
  }

  &__overlay {
    z-index: var(--zindex-overlay);
    position: absolute;
    inset: 0;
    padding-block-start: 56px;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    transition: all 0.2s ease-in-out;

    &.is-hidden {
      z-index: var(--zindex-overlay--hidden);
      opacity: 0;
      transition: all 0.2s ease-in-out;
    }
  }

  &__selected-info {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-inline: auto;
    max-width: 500px;
  }

  &__results-wrapper {
    margin-block-start: 8px;
    margin-inline: auto;
    padding: 6px;
    max-width: 450px;
    background-color: var(--body-bg);
    border-radius: 1rem;
  }

  &__default-msg {
    * {
      color: white;
    }
    p {
      text-align: center;
    }
  }
}

.fade-left-enter-active,
.fade-left-leave-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}
.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
