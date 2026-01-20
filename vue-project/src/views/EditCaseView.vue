<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import CaseHeader from '@/components/CaseHeader.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import EntitySelector from '@/components/inputs/EntitySelector.vue'
import type { Entity } from '@/components/inputs/EntityTag.vue'
import { getCaseDetails_v2 } from '@/utils/case'

const route = useRoute()

interface EditCaseState {
  caseTitle: string
  caseDescription: string
  litigants: Map<string, Entity>
  caseNumber?: string
}

const state = reactive<EditCaseState>({
  caseTitle: 'Test Case Title',
  caseDescription: '',
  litigants: new Map<string, Entity>(),
  caseNumber: '',
})

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
    caseData.case_litigants?.forEach((caseLitigant) => {
      const _data = new Map<string, string>()
      _data.set('role', caseLitigant.role.handle.toLowerCase())
      _data.set('isOurClient', caseLitigant.is_our_client ? 'true' : 'false')
      state.litigants.set(caseLitigant.litigant.id.toString(), {
        label: caseLitigant.litigant.name,
        value: caseLitigant.litigant.id.toString(),
        data: _data,
      })
    })
  })
})
</script>

<template>
  <div class="v-edit-case">
    <CaseHeader class="v-edit-case__header" :title="'Edit ' + state.caseTitle" />
    <form class="v-edit-case__form">
      <InputText label="Case Title" v-model="state.caseTitle" />
      <InputTextarea label="Case Description" v-model="state.caseDescription" />
      <InputText label="Case Number" v-model="state.caseNumber" />
      <EntitySelector
        add-btn-label="Add Plaintiff"
        :entities="plaintiffEntities"
        :add-entity-callback="() => {}"
      >
        Plaintiffs
      </EntitySelector>
      <EntitySelector
        add-btn-label="Add Defendant"
        :entities="defendantEntities"
        :add-entity-callback="() => {}"
      >
        Defendants
      </EntitySelector>
      <EntitySelector
        add-btn-label="Add Witness"
        :entities="witnessEntities"
        :add-entity-callback="() => {}"
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
  min-height: 100vh;
  grid-template-columns: repeat(8, 1fr);
  column-gap: 20px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
  }

  &__form {
    grid-column: 3 / span 4;
    grid-row: 3;
    display: flex;
    flex-flow: column;
    row-gap: 20px;
  }
}
</style>
