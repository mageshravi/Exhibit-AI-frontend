<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AddLitigant from '@/components/litigant/AddLitigant.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import EntitySelector from '@/components/inputs/EntitySelector.vue'
import type { Entity } from '@/components/inputs/EntityTag.vue'
import type { CreateCasePayload } from '@/utils/case'
import { createCase } from '@/utils/case'
import { useLitigantEntities } from '@/composables/useLitigantEntities'
import { useAddLitigantModal } from '@/composables/useAddLitigantModal'

const router = useRouter()

interface APIError {
  [key: string]: string[]
}

interface NewCaseState {
  title: string
  description: string
  caseNumber: string | null
  litigants: Map<string, Entity>
  errors: APIError
  addLitigantModalOpen: 'plaintiff' | 'defendant' | 'witness' | false
}

const state = reactive<NewCaseState>({
  title: '',
  description: '',
  caseNumber: null,
  litigants: new Map<string, Entity>(),
  errors: {},
  addLitigantModalOpen: false,
})

const {
  plaintiffEntities,
  defendantEntities,
  witnessEntities,
  clientRole,
  updatePlaintiffs,
  updateDefendants,
  updateWitnesses,
} = useLitigantEntities(state)

const {
  showPlaintiffModal,
  showDefendantModal,
  showWitnessModal,
  hideLitigantModal,
  handleNewLitigant,
} = useAddLitigantModal(state)

const _validateFormInputs = (): APIError => {
  const errors: APIError = {}

  if (!state.title.trim()) {
    errors['title'] = ['This field is required.']
  }

  if (!state.description.trim()) {
    errors['description'] = ['This field is required.']
  }

  if (!plaintiffEntities.value.size) {
    errors['plaintiffs'] = ['This field is required.']
  }

  if (!defendantEntities.value.size) {
    errors['defendants'] = ['This field is required.']
  }

  return errors
}

const create = () => {
  // reset errors
  state.errors = {}

  const errors = _validateFormInputs()
  if (Object.keys(errors).length !== 0) {
    state.errors = errors
    return
  }

  const createCasePayload: CreateCasePayload = {
    title: state.title,
    description: state.description,
    case_litigants_data: Array.from(state.litigants.entries()).map(([key, litigant]) => ({
      litigant: Number(key),
      role:
        litigant.data?.get('role') === 'plaintiff'
          ? 1
          : litigant.data?.get('role') === 'defendant'
            ? 3
            : 5,
      is_our_client: litigant.data?.get('isOurClient') === 'true',
    })),
  }

  if (state.caseNumber && state.caseNumber.trim() !== '') {
    createCasePayload.case_number = state.caseNumber.trim()
  }

  createCase(createCasePayload)
    .then((response) => {
      router.push({ name: 'CaseDetail', params: { caseUuid: response.data.uuid } })
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        state.errors = error.response.data as APIError
      } else {
        console.error('An unexpected error occurred:', error)
      }
    })
}
</script>

<template>
  <div class="v-new-case">
    <header class="v-new-case__header">
      <nav class="m-breadcrumbs">
        <span class="m-breadcrumbs__item">
          <router-link class="m-breadcrumbs__link" :to="{ name: 'Home' }">Cases</router-link>
        </span>
      </nav>
      <h1 class="v-new-case__title">New Case</h1>
    </header>
    <form class="v-new-case__form" @submit.prevent="create">
      <InputText
        label="Case Title"
        placeholder='Use "Plaintiff vs Defendant" for easy recall'
        required
        v-model="state.title"
        :has-error="'title' in state.errors"
        :error-text="state.errors.title?.join(' ')"
      />
      <InputTextarea
        label="Case Description"
        placeholder="Describe the nature of the dispute and the litigants involved. Provide as much information as possible, but be precise."
        required
        v-model="state.description"
        :has-error="'description' in state.errors"
        :error-text="state.errors.description?.join(' ')"
      />
      <InputText
        label="Case Number"
        placeholder="Enter the official case number if available"
        v-model="state.caseNumber"
      />
      <EntitySelector
        addBtnLabel="Add Plaintiff"
        :add-entity-callback="showPlaintiffModal"
        :entities="plaintiffEntities"
        :error-text="state.errors.plaintiffs?.join(' ')"
        @update:entities="updatePlaintiffs"
        >Plaintiffs</EntitySelector
      >
      <EntitySelector
        addBtnLabel="Add Defendant"
        :add-entity-callback="showDefendantModal"
        :entities="defendantEntities"
        :error-text="state.errors.defendants?.join(' ')"
        @update:entities="updateDefendants"
        >Defendants</EntitySelector
      >
      <EntitySelector
        addBtnLabel="Add Witness"
        :add-entity-callback="showWitnessModal"
        :entities="witnessEntities"
        @update:entities="updateWitnesses"
        >Witnesses</EntitySelector
      >
      <button class="v-new-case__btn m-btn m-btn--primary" type="submit">Create</button>
    </form>
    <transition name="fade-up">
      <AddLitigant
        v-if="state.addLitigantModalOpen"
        :litigant-type="state.addLitigantModalOpen"
        :our-client-role="clientRole"
        @confirm="handleNewLitigant"
        @modal:close="hideLitigantModal"
        class="v-new-case__add-litigant-modal"
      />
    </transition>
  </div>
</template>

<style lang="scss">
.v-new-case {
  position: relative;
  display: grid;
  margin-inline: auto;
  padding-block-end: 2rem;
  min-height: 100vh;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: auto 1fr;
  column-gap: 20px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
    grid-row: 1;
  }

  &__title {
    margin-block: 0;
  }

  &__form {
    grid-column: 3 / span 4;
    grid-row: 2;
    display: flex;
    flex-flow: column;
    row-gap: 1rem;
  }

  &__btn {
    margin-block-start: 0.5rem;
    align-self: flex-start;
  }

  &__add-litigant-modal {
    z-index: 1000;
    position: absolute;
    inset: 0;
    background-color: white;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
