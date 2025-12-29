<script setup lang="ts">
import { toRaw, reactive, computed } from 'vue'
import AddLitigant from '@/components/litigant/AddLitigant.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import EntitySelector from '@/components/inputs/EntitySelector.vue'
import type { Litigant } from '@/types/list-litigants-api'
import type { Entity } from '@/components/inputs/EntityTag.vue'

interface NewCaseState {
  litigants: Map<string, Entity>
  addLitigantModalOpen: 'plaintiff' | 'defendant' | 'witness' | false
}

const state = reactive<NewCaseState>({
  litigants: new Map<string, Entity>(),
  addLitigantModalOpen: false,
})

const clientRole = computed((): 'plaintiff' | 'defendant' | null => {
  const roles = new Set<string>()
  state.litigants.forEach((litigant) => {
    if (litigant.data?.get('isOurClient') === 'true') {
      roles.add(litigant.data?.get('role') || '')
    }
  })

  return Array.from(roles)[0] as 'plaintiff' | 'defendant' | null
})

const showPlaintiffModal = () => {
  state.addLitigantModalOpen = 'plaintiff'
}

const showDefendantModal = () => {
  state.addLitigantModalOpen = 'defendant'
}

const showWitnessModal = () => {
  state.addLitigantModalOpen = 'witness'
}

const hideLitigantModal = () => {
  state.addLitigantModalOpen = false
}

const updatePlaintiffs = (plaintiffs: Map<string, Entity>) => {
  /* replace all plaintiffs */
  state.litigants.forEach((litigant, key) => {
    if (litigant.data?.get('role') === 'plaintiff') {
      state.litigants.delete(key)
    }
  })
  state.litigants = new Map([...state.litigants, ...toRaw(plaintiffs)])
}

const updateDefendants = (defendants: Map<string, Entity>) => {
  /* replace all defendants */
  state.litigants.forEach((litigant, key) => {
    if (litigant.data?.get('role') === 'defendant') {
      state.litigants.delete(key)
    }
  })
  state.litigants = new Map([...state.litigants, ...toRaw(defendants)])
}

const updateWitnesses = (witnesses: Map<string, Entity>) => {
  /* replace all witnesses */
  state.litigants.forEach((litigant, key) => {
    if (litigant.data?.get('role') === 'witness') {
      state.litigants.delete(key)
    }
  })
  state.litigants = new Map([...state.litigants, ...toRaw(witnesses)])
}

const handleNewLitigant = (litigant: Litigant, isOurClient: boolean) => {
  const litigantEntity: Entity = {
    value: litigant.id.toString(),
    label: litigant.name,
  }

  const _data = new Map<string, string>()
  _data.set('isOurClient', isOurClient.toString())

  if (state.addLitigantModalOpen === 'plaintiff') {
    _data.set('role', 'plaintiff')
    litigantEntity.data = _data
    state.litigants.set(litigant.id.toString(), litigantEntity)
  } else if (state.addLitigantModalOpen === 'defendant') {
    _data.set('role', 'defendant')
    litigantEntity.data = _data
    state.litigants.set(litigant.id.toString(), litigantEntity)
  } else if (state.addLitigantModalOpen === 'witness') {
    _data.set('role', 'witness')
    litigantEntity.data = _data
    state.litigants.set(litigant.id.toString(), litigantEntity)
  }
  hideLitigantModal()
}

const plaintiffEntities = computed(() => {
  /* get all litigants with role 'plaintiff' */
  return new Map(
    Array.from(state.litigants.entries()).filter(
      ([, litigant]) => litigant.data?.get('role') === 'plaintiff',
    ),
  )
})

const defendantEntities = computed(() => {
  /* get all litigants with role 'defendant' */
  return new Map(
    Array.from(state.litigants.entries()).filter(
      ([, litigant]) => litigant.data?.get('role') === 'defendant',
    ),
  )
})

const witnessEntities = computed(() => {
  /* get all litigants with role 'witness' */
  return new Map(
    Array.from(state.litigants.entries()).filter(
      ([, litigant]) => litigant.data?.get('role') === 'witness',
    ),
  )
})

const create = () => {
  console.log('Creating new case with the following details:')
  console.log('Plaintiffs:', plaintiffEntities.value)
  console.log('Defendants:', defendantEntities.value)
  console.log('Witnesses:', witnessEntities.value)
}
</script>

<template>
  <div class="v-new-case">
    <header class="v-new-case__header">
      <h1>New Case</h1>
    </header>
    <form class="v-new-case__form">
      <InputText
        label="Case Title"
        placeholder='Use "Plaintiff vs Defendant" for easy recall'
        required
      />
      <InputTextarea
        label="Case Description"
        placeholder="Describe the nature of the dispute and the litigants involved. Provide as much information as possible, but be precise."
        required
      />
      <InputText label="Case Number" placeholder="Enter the official case number if available" />
      <EntitySelector
        addBtnLabel="Add Plaintiff"
        :add-entity-callback="showPlaintiffModal"
        :entities="plaintiffEntities"
        @update:entities="updatePlaintiffs"
        >Plaintiffs</EntitySelector
      >
      <EntitySelector
        addBtnLabel="Add Defendant"
        :add-entity-callback="showDefendantModal"
        :entities="defendantEntities"
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
      <button class="v-new-case__btn m-btn m-btn--primary" @click="create">Create</button>
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
  column-gap: 20px;

  &__header {
    padding-block: 32px 21px;
    grid-column: 3 / span 4;
  }

  &__form {
    grid-column: 3 / span 4;
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
