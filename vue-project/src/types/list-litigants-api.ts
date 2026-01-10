interface Litigant {
  id: number
  name: string
  bio: string
  address: string
  email: string
  phone: string
  notes: string
  created_at: string
  updated_at: string
}

interface ListLitigantsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<Litigant>
}

export type { Litigant, ListLitigantsResponse }
