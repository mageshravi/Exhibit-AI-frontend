<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCaseDetails_v2 } from '@/utils/case'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'
import CaseHeader from '@/components/CaseHeader.vue'
import UploadFiles from '@/components/exhibits/UploadFiles.vue'
import LitigantSection from '@/components/case/LitigantSection.vue'

interface CaseViewState {
  case: RetrieveCaseResponse | null
  descriptionExpanded: boolean
  showUploadFiles: boolean
}

const route = useRoute()

const state = reactive(<CaseViewState>{
  case: null,
  descriptionExpanded: false,
  showUploadFiles: false,
})

const caseTitle = computed(() => state.case?.title || 'Loading...')

const descBtnLabel = computed(() => (state.descriptionExpanded ? 'Show less' : 'Show more'))

const plaintiffs = computed(() => {
  return (
    state.case?.case_litigants?.filter((litigant) => litigant.role.handle === 'PLAINTIFF') || []
  )
})

const thirdPartyPlaintiffs = computed(() => {
  return (
    state.case?.case_litigants?.filter(
      (litigant) => litigant.role.handle === 'THIRD_PARTY_PLAINTIFF',
    ) || []
  )
})

const defendants = computed(() => {
  return (
    state.case?.case_litigants?.filter((litigant) => litigant.role.handle === 'DEFENDANT') || []
  )
})

const thirdPartyDefendants = computed(() => {
  return (
    state.case?.case_litigants?.filter(
      (litigant) => litigant.role.handle === 'THIRD_PARTY_DEFENDANT',
    ) || []
  )
})

const witnesses = computed(() => {
  return state.case?.case_litigants?.filter((litigant) => litigant.role.handle === 'WITNESS') || []
})

onMounted(() => {
  const caseUuid = route.params.caseUuid as string

  getCaseDetails_v2(caseUuid, false).then((response) => {
    state.case = response.data
  })
})

function toggleDescription() {
  state.descriptionExpanded = !state.descriptionExpanded
}

function handleExhibitCountChange(count: number) {
  state.showUploadFiles = !count
}

function handleUploadComplete() {
  const result = confirm('Files uploaded successfully. Do you want to refresh the page?')
  if (result) {
    window.location.reload()
  }
}
</script>

<template>
  <div class="v-case-page">
    <CaseHeader
      class="v-case-page__header"
      :title="caseTitle"
      @exhibits:count-updated="handleExhibitCountChange"
    />
    <div class="v-case-page__overview">
      <div>
        <router-link
          :to="{ name: 'EditCase', params: { caseUuid: route.params.caseUuid } }"
          class="m-btn m-btn--secondary m-btn--compact m-btn--link"
          >Edit Case</router-link
        >
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
    <UploadFiles
      v-if="state.showUploadFiles"
      class="v-case-page__exhibits"
      :case-uuid="route.params.caseUuid as string"
      @upload:complete="handleUploadComplete"
    />
    <div class="v-case-page__litigants">
      <LitigantSection
        v-if="plaintiffs.length"
        :type="plaintiffs.length > 1 ? 'plaintiffs' : 'plaintiff'"
        v-bind:litigants="plaintiffs"
      />
      <LitigantSection
        v-if="thirdPartyPlaintiffs.length"
        :type="thirdPartyPlaintiffs.length > 1 ? 'third party plaintiffs' : 'third party plaintiff'"
        v-bind:litigants="thirdPartyPlaintiffs"
      />
      <LitigantSection
        v-if="defendants.length"
        :type="defendants.length > 1 ? 'defendants' : 'defendant'"
        v-bind:litigants="defendants"
      />
      <LitigantSection
        v-if="thirdPartyDefendants.length"
        :type="thirdPartyDefendants.length > 1 ? 'third party defendants' : 'third party defendant'"
        v-bind:litigants="thirdPartyDefendants"
      />
      <LitigantSection
        v-if="witnesses.length"
        :type="witnesses.length > 1 ? 'witnesses' : 'witness'"
        v-bind:litigants="witnesses"
      />
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
    grid-row: 1;
  }

  &__overview {
    grid-column: 3 / span 4;
    grid-row: 2;
  }

  &__description {
    margin-bottom: 8px;
    display: -webkit-box;
    overflow: hidden;
    white-space: pre-line; /* converts newline characters to line breaks */
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

  &__litigants {
    grid-column: 3 / span 4;
    grid-row: 4;
  }
}
</style>
