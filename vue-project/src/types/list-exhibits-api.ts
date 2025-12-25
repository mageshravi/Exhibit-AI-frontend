interface Exhibit {
  id: number
  filename: string
  file: string
  status: string
  error_message: string
  case: string
  exhibit_code: string | null
  created_at: string
  updated_at: string
}

interface ListExhibitsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<Exhibit>
}

export type { Exhibit, ListExhibitsResponse }
