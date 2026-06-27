import { Message, ChatResponse } from '../types/chat'

interface SendMessageParams {
  message: string
  imageUrl?: string
  history: Message[]
}

export const chatService = {
  async send(params: SendMessageParams): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Error al enviar mensaje')
    }

    return response.json()
  }
}