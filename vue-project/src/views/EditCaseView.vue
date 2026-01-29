<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import EntitySelector from '@/components/inputs/EntitySelector.vue'
import type { Entity } from '@/components/inputs/EntityTag.vue'
import AddLitigant from '@/components/litigant/AddLitigant.vue'
import type { CaseLitigant } from '@/types/retrieve-case-api'
import { getCaseDetails_v2, type EditCasePayload, updateCase } from '@/utils/case'
import { useLitigantEntities } from '@/composables/useLitigantEntities'
import { useAddLitigantModal } from '@/composables/useAddLitigantModal'

const route = useRoute()
const router = useRouter()

interface EditCaseState {
  caseTitle: string
  caseDescription: string
  caseNumber: string | null
  litigants: Map<string, Entity>
  addLitigantModalOpen: 'plaintiff' | 'defendant' | 'witness' | false
}

const state = reactive<EditCaseState>({
  caseTitle: '',
  caseDescription: '',
  litigants: new Map<string, Entity>(),
  caseNumber: null,
  addLitigantModalOpen: false,
})

const fetchedValues = {
  caseTitle: '',
  caseDescription: '',
  litigants: new Map<string, Entity>(),
  caseNumber: '',
}

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

/**
 * Maintains a copy of fetched values to compare against on submit.
 */
const updateFetchedValues = () => {
  fetchedValues.caseTitle = state.caseTitle
  fetchedValues.caseDescription = state.caseDescription
  fetchedValues.caseNumber = state.caseNumber || ''
  fetchedValues.litigants = new Map(state.litigants)
}

const areMapsEqual = (map1: Map<string, Entity>, map2: Map<string, Entity>): boolean => {
  if (map1.size !== map2.size) {
    return false
  }

  for (const [key, value] of map1) {
    const otherValue = map2.get(key)
    if (!otherValue || otherValue.label !== value.label) {
      return false
    }
  }

  return true
}

function submitForm() {
  const payload = {} as EditCasePayload

  if (fetchedValues.caseTitle !== state.caseTitle) {
    Object.assign(payload, { title: state.caseTitle })
  }

  if (fetchedValues.caseDescription !== state.caseDescription) {
    Object.assign(payload, { description: state.caseDescription })
  }

  if (fetchedValues.caseNumber !== state.caseNumber && state.caseNumber?.trim() !== '') {
    Object.assign(payload, { case_number: state.caseNumber })
  }

  if (!areMapsEqual(fetchedValues.litigants, state.litigants)) {
    Object.assign(payload, {
      case_litigants_data: Array.from(state.litigants.values()).map((entity) => ({
        litigant: parseInt(entity.value),
        role:
          entity.data?.get('role') === 'plaintiff'
            ? 1
            : entity.data?.get('role') === 'defendant'
              ? 3
              : 5, // assuming 1: plaintiff, 3: defendant, 5: witness
        is_our_client: entity.data?.get('isOurClient') === 'true',
      })),
    })
  }

  if (Object.keys(payload).length === 0) {
    alert('No changes detected to save.')
    return
  }

  const caseUuid = route.params.caseUuid as string

  updateCase(payload, caseUuid)
    .then(() => {
      alert('Case updated successfully.')
      router.push({ name: 'CaseDetail', params: { caseUuid } })
    })
    .catch((error) => {
      alert('Error updating case. Please try again later.')
      console.error('Error updating case:', error)
    })
}

onMounted(() => {
  const uuid = route.params.caseUuid as string

  if (!uuid) {
    return
  }

  getCaseDetails_v2(uuid, false).then((response) => {
    const caseData = response.data
    state.caseTitle = caseData.title
    state.caseDescription = caseData.description
    state.caseNumber = caseData.case_number || ''
    state.litigants.clear()
    caseData.case_litigants?.forEach((caseLitigant: CaseLitigant) => {
      const _data = new Map<string, string>()
      _data.set('role', caseLitigant.role.handle.toLowerCase())
      _data.set('isOurClient', caseLitigant.is_our_client ? 'true' : 'false')
      state.litigants.set(caseLitigant.litigant.id.toString(), {
        label: caseLitigant.litigant.name,
        value: caseLitigant.litigant.id.toString(),
        data: _data,
        isLocked: true,
      })
    })

    updateFetchedValues()
  })
})
</script>

<template>
  <div class="v-edit-case">
    <CaseHeader class="v-edit-case__header" :title="fetchedValues.caseTitle" edit-mode />
    <form class="v-edit-case__form" @submit.prevent="submitForm">
      <InputText label="Title" v-model="state.caseTitle" />
      <InputTextarea label="Description" v-model="state.caseDescription" />
      <InputText label="Case Number" v-model="state.caseNumber" />
      <EntitySelector
        add-btn-label="Add Plaintiff"
        :entities="plaintiffEntities"
        :add-entity-callback="showPlaintiffModal"
        @update:entities="updatePlaintiffs"
      >
        Plaintiffs
      </EntitySelector>
      <EntitySelector
        add-btn-label="Add Defendant"
        :entities="defendantEntities"
        :add-entity-callback="showDefendantModal"
        @update:entities="updateDefendants"
      >
        Defendants
      </EntitySelector>
      <EntitySelector
        add-btn-label="Add Witness"
        :entities="witnessEntities"
        :add-entity-callback="showWitnessModal"
        @update:entities="updateWitnesses"
      >
        Witnesses
      </EntitySelector>
      <div>
        <button type="submit" class="m-btn m-btn--primary">Save Changes</button>
      </div>
    </form>
    <transition name="fade-up">
      <AddLitigant
        v-if="state.addLitigantModalOpen"
        :litigant-type="state.addLitigantModalOpen"
        :our-client-role="clientRole"
        @confirm="handleNewLitigant"
        @modal:close="hideLitigantModal"
        class="v-edit-case__add-litigant-modal"
      />
    </transition>
  </div>
</template>

<style lang="scss">
.v-edit-case {
  display: grid;
  margin-inline: auto;
  padding-block-end: 2rem;
  min-width: 1200px;
  max-width: 1440px;
  min-height: 100vh;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: auto 1fr;
  column-gap: 20px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
    grid-row: 1;
  }

  &__form {
    grid-column: 3 / span 4;
    grid-row: 2;
    display: flex;
    flex-flow: column;
    row-gap: 20px;
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
