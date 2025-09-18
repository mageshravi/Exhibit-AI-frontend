<script setup lang="ts">
import CaseHeader from '@/components/CaseHeader.vue'
import { getCaseDetails } from '@/utils/case'
import type { Case } from '@/types/chat-types'
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface CaseViewState {
  case: Case | null
  descriptionExpanded: boolean
}

const route = useRoute()

const state = reactive(<CaseViewState>{
  case: null,
  descriptionExpanded: false,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

const descBtnLabel = computed(() => (state.descriptionExpanded ? 'Show less' : 'Show more'))

onMounted(() => {
  const caseUuid = route.params.caseUuid as string
  getCaseDetails(caseUuid).then((caseData) => {
    if (!caseData) {
      return
    }

    state.case = caseData
  })
})

function toggleDescription() {
  state.descriptionExpanded = !state.descriptionExpanded
}
</script>

<template>
  <div class="v-case-page">
    <CaseHeader class="v-case-page__header" :title="caseTitle" />
    <div class="v-case-page__overview">
      <div>
        <h3>Case number</h3>
        <div v-if="state.case?.case_number">{{ state.case.case_number }}</div>
        <em v-else>Not set</em>
      </div>
      <h3>Description</h3>
      <div
        v-if="state.case"
        class="v-case-page__description"
        :class="{ 'is-expanded': state.descriptionExpanded }"
      >
        {{ state.case.description }}
      </div>
      <div v-else>Loading...</div>
      <button
        v-if="state.case"
        class="m-btn m-btn--secondary v-case-page__desc-btn"
        @click="toggleDescription()"
      >
        {{ descBtnLabel }}
      </button>
    </div>
    <div class="v-case-page__exhibits">
      <h3>Documents / Exhibits</h3>
      <div class="v-case-page__dropzone">
        <div class="v-case-page__dropzone-help">
          <img src="/CloudUploadOutline.png" alt="Upload icon" />
          <p>Drag and drop files here to upload</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-case-page {
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
  }

  &__overview {
    grid-column: 3 / span 4;
    grid-row: 2;
  }

  &__description {
    margin-bottom: 8px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;

    &.is-expanded {
      -webkit-line-clamp: unset;
      line-clamp: unset;
    }
  }

  &__desc-btn {
    padding-block: 0.5rem;
  }

  &__exhibits {
    grid-column: 3 / span 4;
    grid-row: 3;
  }

  &__dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4eef9;
    height: 220px;
    border-radius: 1rem;
  }

  &__dropzone-help {
    text-align: center;
    color: #7e5c9b;

    p {
      margin-block: 10px;
      color: #7e5c9b;
    }
  }
}
</style>
