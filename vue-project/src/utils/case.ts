import axios, { type AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
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

function getCaseDetails_v2(caseUuid: string): Promise<AxiosResponse<Case>> {
  return axios.get(`/api/poc/cases/${caseUuid}/`)
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

function getCaseExhibits_v2(
  caseUuid: string,
  pageNumber: number = 1,
): Promise<AxiosResponse<ListExhibitsResponse>> {
  const url = `/api/poc/cases/${caseUuid}/exhibits/?page=${pageNumber}`
  return axios.get(url)
}

interface CaseLitigant {
  litigant: number
  role: number
  is_our_client: boolean
}

interface CreateCasePayload {
  title: string
  description: string
  case_number?: string
  case_litigants_data: CaseLitigant[]
}

function createCase(payload: CreateCasePayload): Promise<AxiosResponse<Case>> {
  return axios.post('/api/poc/cases/', payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })
}

export {
  getCaseDetails,
  getCaseDetails_v2,
  getCaseExhibits,
  getCaseExhibits_v2,
  type CaseLitigant,
  type CreateCasePayload,
  createCase,
}
