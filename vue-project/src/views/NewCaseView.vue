<script setup lang="ts">
import InputText from '@/components/inputs/InputText.vue'
import InputTextarea from '@/components/inputs/InputTextarea.vue'
import EntitySelector from '@/components/inputs/EntitySelector.vue'
import AddLitigant from '@/components/AddLitigant.vue'
import { type Entity } from '@/components/inputs/EntityTag.vue'
import { toRaw, reactive } from 'vue'

const state = reactive<{
  plaintiffs: Entity[]
  defendants: Entity[]
  witnesses: Entity[]
  addLitigantModalOpen: 'plaintiff' | 'defendant' | 'witness' | false
}>({
  plaintiffs: [],
  defendants: [],
  witnesses: [],
  addLitigantModalOpen: false,
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

const updatePlaintiffs = (plaintiffs: Entity[]) => {
  console.log('Updating plaintiffs:', plaintiffs)
  state.plaintiffs = toRaw(plaintiffs)
}

const updateDefendants = (defendants: Entity[]) => {
  console.log('Updating defendants:', defendants)
  state.defendants = toRaw(defendants)
}

const updateWitnesses = (witnesses: Entity[]) => {
  console.log('Updating witnesses:', witnesses)
  state.witnesses = toRaw(witnesses)
}

const create = () => {
  console.log('Creating new case with the following details:')
  console.log('Plaintiffs:', state.plaintiffs)
  console.log('Defendants:', state.defendants)
  console.log('Witnesses:', state.witnesses)
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
        :entites="state.plaintiffs"
        @update:entities="updatePlaintiffs"
        >Plaintiffs</EntitySelector
      >
      <EntitySelector
        addBtnLabel="Add Defendant"
        :add-entity-callback="showDefendantModal"
        :entites="state.defendants"
        @update:entities="updateDefendants"
        >Defendants</EntitySelector
      >
      <EntitySelector
        addBtnLabel="Add Witness"
        :add-entity-callback="showWitnessModal"
        :entites="state.witnesses"
        @update:entities="updateWitnesses"
        >Witnesses</EntitySelector
      >
      <button class="v-new-case__btn m-btn m-btn--primary" @click="create">Create</button>
    </form>
    <transition name="fade-up">
      <AddLitigant
        v-if="state.addLitigantModalOpen"
        :litigant-type="state.addLitigantModalOpen"
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
