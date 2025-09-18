import type { ChatMessage } from '@/types/chat-types'
import Cookies from 'js-cookie'

function sendMessage(
  caseUuid: string,
  threadUuid: string,
  message: string,
): Promise<ChatMessage[] | null> | undefined {
  const csrfToken = Cookies.get('csrftoken')
  if (!caseUuid || !threadUuid || !csrfToken || !message.trim()) {
    return
  }

  return fetch(`/api/poc/cases/${caseUuid}/chat-threads/${threadUuid}/messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ content: message.trim() }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    })
    .catch((error) => {
      console.error('Error sending message:', error)
      return null
    })
}

export { sendMessage }
