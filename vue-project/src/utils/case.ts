import axios, { type AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import type { Case } from '@/types/chat-types'
import type { ListExhibitsResponse } from '@/types/list-exhibits-api'
import type { ListCasesResponse } from '@/types/list-cases-api'
import type { RetrieveCaseResponse } from '@/types/retrieve-case-api'

function getCaseDetails(caseUuid: string): Promise<RetrieveCaseResponse | null> {
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

function getCaseDetails_v2(
  caseUuid: string,
  compact: boolean = true,
): Promise<AxiosResponse<RetrieveCaseResponse>> {
  if (compact) {
    return axios.get(`/api/poc/cases/${caseUuid}/?compact=true`)
  }

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

function searchCases(query: string): Promise<AxiosResponse<ListCasesResponse>> {
  const url = `/api/poc/cases/?search=${encodeURIComponent(query)}`
  return axios.get(url)
}

interface EditCasePayload {
  title?: string
  description?: string
  case_number?: string
  case_litigants_data?: CaseLitigant[]
}

function updateCase(payload: EditCasePayload, caseUuid: string): Promise<AxiosResponse<Case>> {
  return axios.patch(`/api/poc/cases/${caseUuid}/`, payload, {
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
  searchCases,
  type EditCasePayload,
  updateCase,
}
