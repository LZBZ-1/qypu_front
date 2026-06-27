async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed for ${url}`)
  }

  return payload
}

export const insightsService = {
  async getTodaySales() {
    const today = new Date().toISOString().slice(0, 10)
    const data = await fetchJson<{
      summary: { total: number; count: number }
      rows: Array<{ id: string }>
    }>(`/api/ventas?desde=${today}&hasta=${today}`)

    return { total: data.summary.total, count: data.summary.count, raw: data.rows }
  },

  async getTopProducts(limit = 5) {
    const data = await fetchJson<{
      topProducts: Array<{ name: string; quantity: number; income: number }>
    }>('/api/reportes')

    return data.topProducts.slice(0, limit).map((item, index) => ({
      id: String(index),
      name: item.name,
      qty: item.quantity,
    }))
  },

  async getStockAlerts() {
    const data = await fetchJson<{
      items: Array<{ productId: string; name: string; quantity: number }>
    }>('/api/inventario')

    return data.items.filter((item) => item.quantity === 0)
  },

  async getCajaBalance() {
    return fetchJson<{ ingresos: number; egresos: number; balance: number }>('/api/caja')
  },
}
