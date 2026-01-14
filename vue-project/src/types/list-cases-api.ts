interface Case {
  uuid: string
  title: string
  description: string
  case_number: string | null
  created_at: string
  updated_at: string
}

interface ListCasesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<Case>
}

export type { Case, ListCasesResponse }
