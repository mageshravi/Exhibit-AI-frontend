interface Role {
  id: number
  name: string
  handle: string
  description: string
}

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

interface CaseLitigant {
  litigant: Litigant
  role: Role
  is_our_client: boolean
}

interface RetrieveCaseResponse {
  uuid: string
  title: string
  description: string
  case_number: string | null
  created_at: string
  updated_at: string
  case_litigants?: Array<CaseLitigant>
}

export type { Role, Litigant, CaseLitigant, RetrieveCaseResponse }
