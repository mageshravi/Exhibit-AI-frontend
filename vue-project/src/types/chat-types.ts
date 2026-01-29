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

export type { ChatThread, ChatMessage }
