interface Timeline {
  id: number
  name: string
  event_extraction_status: string
  is_active: boolean
  case: number
  created_by: number
  created_at: string
  updated_at: string
}

export type { Timeline }
