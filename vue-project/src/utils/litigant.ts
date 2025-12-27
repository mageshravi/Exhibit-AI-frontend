import axios, { type AxiosResponse } from 'axios'
import type { ListLitigantsResponse } from '@/types/list-litigants-api'

function searchLitigants(
  query: string,
): Promise<AxiosResponse<ListLitigantsResponse> | null> | undefined {
  return axios.get(`/api/poc/litigants/?search=${encodeURIComponent(query)}`)
}

export { searchLitigants }
