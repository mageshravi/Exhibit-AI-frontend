import axios, { type AxiosResponse } from 'axios'
import type { ListEventsResponse } from '@/types/list-events-api'

function getEvents(
  caseUuid: string,
  pageNumber: number = 1,
): Promise<AxiosResponse<ListEventsResponse>> {
  const url = `/api/events/cases/${caseUuid}/?page=${pageNumber}`
  return axios.get(url)
}

export { getEvents }
