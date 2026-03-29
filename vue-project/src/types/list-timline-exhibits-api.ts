interface TimlineExhibit {
  id: number
  filename: string
  file: string
  exhibit_code: string
  event_extraction_status: string
  created_at: string
  updated_at: string
}

interface ListTimelineExhibitsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<TimlineExhibit>
}

export type { TimlineExhibit, ListTimelineExhibitsResponse }
