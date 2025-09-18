import type { Case } from '@/types/chat-types'

function getCaseDetails(caseUuid: string): Promise<Case | null> {
  return fetch(`/api/poc/cases/${caseUuid}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .catch((error) => {
      console.error('Error fetching case details:', error)
      return null
    })
}

export { getCaseDetails }
