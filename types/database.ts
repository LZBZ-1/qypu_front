export interface Negocio {
  id: string
  user_id: string
  nombre: string
  tipo: string
  created_at: string
}

export interface CajaMovimiento {
  id: string
  negocio_id: string
  tipo: 'ingreso' | 'egreso'
  monto: number
  concepto: string
  referencia_id?: string
  created_at: string
}