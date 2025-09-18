interface Case {
  id: number
  title: string
  description: string
  uuid: string
  case_number: string
  created_at: string
  updated_at: string
}

interface ChatThread {
  id: number
  title: string
  uuid: string
  case: number
  created_at: string
  updated_at: string
}

interface ChatMessage {
  id: number
  role: string
  content: string
  thread: number
  created_at: string
  updated_at: string
}

export type { Case, ChatThread, ChatMessage }
