import type { Case } from '@/types/chat-types'
import type { ListExhibitsResponse } from '@/types/list-exhibits-api'

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

function getCaseExhibits(
  caseUuid: string,
  pageNumber: number = 1,
): Promise<ListExhibitsResponse | null> {
  const url = `/api/poc/cases/${caseUuid}/exhibits/?page=${pageNumber}`
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .catch((error) => {
      console.error('Error fetching case exhibits:', error)
      return null
    })
}

export { getCaseDetails, getCaseExhibits }
