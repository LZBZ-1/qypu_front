'use client'

import { useState, useCallback } from 'react'
import { Message } from '../types/chat'
import { chatService } from '../services/chatService'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hola 👋 Soy Qypu, tu asistente de negocio. Cuéntame qué pasó hoy: ventas, compras, consultas... lo que necesites.',
      createdAt: new Date(),
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(async (text: string, imageUrl?: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      imageUrl,
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      const response = await chatService.send({
        message: text,
        imageUrl,
        history: messages.slice(-10),
      })

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text,
        actions: response.actions,
        createdAt: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Ups, hubo un problema. Intenta de nuevo 🙏',
        createdAt: new Date(),
      }])
    } finally {
      setIsTyping(false)
    }
  }, [messages])

  return { messages, sendMessage, isTyping }
}