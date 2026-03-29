interface Event {
  id: number
  display_title: string
  display_description: string
  event_date: string
  place: string
  source_description: string
}

interface ListEventsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<Event>
}

export type { Event, ListEventsResponse }
