export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  actions?: { id: string; label: string }[]
  createdAt: Date
}

export interface ChatResponse {
  text: string
  intent: 'VENTA' | 'COMPRA' | 'CONSULTA' | 'INVENTARIO' | 'OTRO'
  data?: any
  actions?: { id: string; label: string }[]
}