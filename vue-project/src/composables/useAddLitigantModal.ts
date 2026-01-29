import type { Entity } from '@/components/inputs/EntityTag.vue'
import type { Litigant } from '@/types/list-litigants-api'

interface CaseState {
  addLitigantModalOpen: 'plaintiff' | 'defendant' | 'witness' | false
  litigants: Map<string, Entity>
}

/**
 * Common methods to manage the Add Litigant modal in EditCaseView and NewCaseView.
 */
export function useAddLitigantModal(state: CaseState) {
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

  const handleNewLitigant = (litigant: Litigant, isOurClient: boolean) => {
    const existingEntity = state.litigants.get(litigant.id.toString())
    if (existingEntity && existingEntity.isLocked) {
      // cannot modify locked, existing entity
      alert(
        `${existingEntity.label} is currently added as a ${existingEntity.data?.get('role')} and cannot be modified.`,
      )
      hideLitigantModal()
      return
    }

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

  return {
    showPlaintiffModal,
    showDefendantModal,
    showWitnessModal,
    hideLitigantModal,
    handleNewLitigant,
  }
}
