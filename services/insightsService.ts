import { supabase } from '@/lib/supabaseClient'
import { formatCurrency } from '@/lib/formatters'

export const insightsService = {
  async getTodaySales(negocioId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('ventas')
      .select('total, items, created_at')
      .eq('negocio_id', negocioId)
      .gte('created_at', today.toISOString())

    if (error) throw error

    const total = data?.reduce((sum, v) => sum + v.total, 0) ?? 0
    return { total, count: data?.length ?? 0, raw: data ?? [] }
  },

  async getTopProducts(negocioId: string, limit = 5) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('ventas')
      .select('items')
      .eq('negocio_id', negocioId)
      .gte('created_at', today.toISOString())

    // Aplanar y agrupar items
    const counts: Record<string, number> = {}
    data?.forEach((venta) => {
      venta.items?.forEach((item: any) => {
        counts[item.nombre] = (counts[item.nombre] ?? 0) + item.qty
      })
    })

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([nombre, qty], i) => ({ id: String(i), name: nombre, qty }))
  },

  async getStockAlerts(negocioId: string) {
    const { data } = await supabase
      .from('inventario')
      .select('id, nombre, cantidad, stock_minimo')
      .eq('negocio_id', negocioId)
      .filter('cantidad', 'lte', 'stock_minimo')

    return data ?? []
  },

  async getCajaBalance(negocioId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('caja')
      .select('tipo, monto')
      .eq('negocio_id', negocioId)
      .gte('created_at', today.toISOString())

    const ingresos = data?.filter(m => m.tipo === 'ingreso')
      .reduce((s, m) => s + m.monto, 0) ?? 0
    const egresos = data?.filter(m => m.tipo === 'egreso')
      .reduce((s, m) => s + m.monto, 0) ?? 0

    return { ingresos, egresos, balance: ingresos - egresos }
  }
}