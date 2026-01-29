import type { Entity } from '@/components/inputs/EntityTag.vue'
import { computed, toRaw } from 'vue'

interface CaseState {
  litigants: Map<string, Entity>
}

/**
 * Common methods to manage litigant entities in EditCaseView and NewCaseView.
 */
export function useLitigantEntities(state: CaseState) {
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

  const clientRole = computed((): 'plaintiff' | 'defendant' | null => {
    const roles = new Set<string>()
    state.litigants.forEach((litigant) => {
      if (litigant.data?.get('isOurClient') === 'true') {
        roles.add(litigant.data?.get('role') || '')
      }
    })

    return Array.from(roles)[0] as 'plaintiff' | 'defendant' | null
  })

  const updatePlaintiffs = (plaintiffs: Map<string, Entity>) => {
    // A plaintiff likely removed. Replace all plaintiffs.
    state.litigants.forEach((litigant, key) => {
      if (litigant.data?.get('role') === 'plaintiff') {
        state.litigants.delete(key)
      }
    })
    state.litigants = new Map([...state.litigants, ...toRaw(plaintiffs)])
  }

  const updateDefendants = (defendants: Map<string, Entity>) => {
    // A defendant likely removed. Replace all defendants.
    state.litigants.forEach((litigant, key) => {
      if (litigant.data?.get('role') === 'defendant') {
        state.litigants.delete(key)
      }
    })
    state.litigants = new Map([...state.litigants, ...toRaw(defendants)])
  }

  const updateWitnesses = (witnesses: Map<string, Entity>) => {
    // A witness likely removed. Replace all witnesses.
    state.litigants.forEach((litigant, key) => {
      if (litigant.data?.get('role') === 'witness') {
        state.litigants.delete(key)
      }
    })
    state.litigants = new Map([...state.litigants, ...toRaw(witnesses)])
  }

  return {
    plaintiffEntities,
    defendantEntities,
    witnessEntities,
    clientRole,
    updatePlaintiffs,
    updateDefendants,
    updateWitnesses,
  }
}
