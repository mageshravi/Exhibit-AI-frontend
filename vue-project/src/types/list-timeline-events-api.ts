interface TimelineEvent {
  id: number
  title: string
  description: string
  event_date: string
  place: string
  created_at: string
  updated_at: string
}

interface ListTimelineEventsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<TimelineEvent>
}

export type { TimelineEvent, ListTimelineEventsResponse }
