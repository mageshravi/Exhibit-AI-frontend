<script setup lang="ts">
import InputText from './inputs/InputText.vue'
import InputTextarea from './inputs/InputTextarea.vue'
import InputSearch from './inputs/InputSearch.vue'
import type { Litigant } from '@/types/list-litigants-api'
import { searchLitigants } from '@/utils/litigant'
import SearchResult from './litigant/SearchResult.vue'
import { reactive } from 'vue'

const props = defineProps<{
  litigantType?: 'plaintiff' | 'defendant' | 'witness'
}>()

const state = reactive<{
  searchFocused: boolean
  searchResults: Litigant[] | null
}>({
  searchFocused: false,
  searchResults: null,
})

const emits = defineEmits<{
  (e: 'modal:close'): void
}>()

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
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
</script>

<template>
  <div class="c-add-litigant">
    <header class="c-add-litigant__header">
      <InputSearch
        placeholder="Search Litigant"
        @focus:in="
          () => {
            state.searchFocused = true
          }
        "
        @focus:out="
          () => {
            state.searchFocused = false
          }
        "
        @keyup="performSearch"
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
    <div class="c-add-litigant__overlay" :class="{ 'is-hidden': !state.searchFocused }">
      <div class="c-add-litigant__results-wrapper" v-if="state.searchResults?.length">
        <SearchResult v-for="result in state.searchResults" :key="result.id" :result="result" />
      </div>
      <div class="c-add-litigant__default-msg" v-else>
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
</style>
