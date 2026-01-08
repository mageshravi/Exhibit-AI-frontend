import axios, { type AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import type { ListLitigantsResponse } from '@/types/list-litigants-api'

function searchLitigants(
  query: string,
): Promise<AxiosResponse<ListLitigantsResponse> | null> | undefined {
  return axios.get(`/api/poc/litigants/?search=${encodeURIComponent(query)}`)
}

interface CreateLitigantPayload {
  name: string
  bio: string
  address: string
  email?: string
  phone?: string
  notes?: string
}

function createLitigant(payload: CreateLitigantPayload) {
  return axios.post('/api/poc/litigants/', payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })
}

export { searchLitigants, createLitigant, type CreateLitigantPayload }
