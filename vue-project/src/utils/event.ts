import axios, { type AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import type { Timeline } from '@/types/retrieve-timeline-api'
import type { ListTimelinesResponse } from '@/types/list-timelines-api'
import type { ListTimelineEventsResponse } from '@/types/list-timeline-events-api'

function getTimelines(caseUuid: string): Promise<AxiosResponse<ListTimelinesResponse>> {
  const url = `/api/events/timelines/?case=${caseUuid}`
  return axios.get(url)
}

function getTimelineDetails(timelineId: number): Promise<AxiosResponse<Timeline>> {
  const url = `/api/events/timelines/${timelineId}/`
  return axios.get(url)
}

interface CreateTimelineRequest {
  case: string
  name: string
  exhibits?: Array<number>
}

function createTimeline(requestData: CreateTimelineRequest): Promise<AxiosResponse<Timeline>> {
  const url = `/api/events/timelines/`
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  }
  return axios.post(url, requestData, { headers })
}

function getTimelineEvents(
  timelineId: number,
  pageNumber: number = 1,
): Promise<AxiosResponse<ListTimelineEventsResponse>> {
  const url = `/api/events/timelines/${timelineId}/events/?page=${pageNumber}`
  return axios.get(url)
}

export {
  type CreateTimelineRequest,
  getTimelines,
  getTimelineDetails,
  getTimelineEvents,
  createTimeline,
}
