<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import EntitySelector from '@/components/inputs/EntitySelector.vue'
import type { Entity } from '@/components/inputs/EntityTag.vue'
import type { CaseLitigant } from '@/types/retrieve-case-api'
import { getCaseDetails_v2, type EditCasePayload, updateCase } from '@/utils/case'

const route = useRoute()

interface EditCaseState {
  caseTitle: string
  caseDescription: string
  litigants: Map<string, Entity>
  caseNumber?: string
}

const state = reactive<EditCaseState>({
  caseTitle: '',
  caseDescription: '',
  litigants: new Map<string, Entity>(),
  caseNumber: '',
})

const fetchedValues = {
  caseTitle: '',
  caseDescription: '',
  litigants: new Map<string, Entity>(),
  caseNumber: '',
}

const plaintiffEntities = computed(() => {
  return new Map(
    Array.from(state.litigants).filter(([, entity]) => entity.data?.get('role') === 'plaintiff'),
  )
})

const defendantEntities = computed(() => {
  return new Map(
    Array.from(state.litigants).filter(([, entity]) => entity.data?.get('role') === 'defendant'),
  )
})

const witnessEntities = computed(() => {
  return new Map(
    Array.from(state.litigants).filter(([, entity]) => entity.data?.get('role') === 'witness'),
  )
})

const restrictDeletion = (entity: Entity) => {
  alert(`Cannot remove ${entity.label}.\n\nLitigants cannot be removed once added to a case.`)
}

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
      updateFetchedValues()
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
        :add-entity-callback="() => {}"
        :remove-entity-callback="restrictDeletion"
      >
        Plaintiffs
      </EntitySelector>
      <EntitySelector
        add-btn-label="Add Defendant"
        :entities="defendantEntities"
        :add-entity-callback="() => {}"
        :remove-entity-callback="restrictDeletion"
      >
        Defendants
      </EntitySelector>
      <EntitySelector
        add-btn-label="Add Witness"
        :entities="witnessEntities"
        :add-entity-callback="() => {}"
        :remove-entity-callback="restrictDeletion"
      >
        Witnesses
      </EntitySelector>
      <div>
        <button type="submit" class="m-btn m-btn--primary">Save Changes</button>
      </div>
    </form>
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
}
</style>
