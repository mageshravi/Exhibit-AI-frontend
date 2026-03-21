interface Timeline {
  id: number
  name: string
  event_extraction_status: string
  is_active: boolean
  created_by: number
  created_at: string
  updated_at: string
}

interface ListTimelinesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<Timeline>
}

export type { Timeline, ListTimelinesResponse }
