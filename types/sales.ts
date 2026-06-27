export interface SaleItem {
  nombre: string
  qty: number
  precio: number
  subtotal: number
}

export interface Sale {
  id: string
  negocio_id: string
  total: number
  items: SaleItem[]
  origen: 'chat' | 'telegram' | 'manual'
  created_at: string
}