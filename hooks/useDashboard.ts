'use client'

import { useEffect, useState } from 'react'

import { insightsService } from '@/services/insightsService'
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime'

export function useDashboard() {
  const [todaySales, setTodaySales] = useState({ total: 0, count: 0 })
  const [topProducts, setTopProducts] = useState<{ id: string; name: string; qty: number }[]>([])
  const [stockAlerts, setStockAlerts] = useState<any[]>([])
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [sales, top, alerts] = await Promise.all([
          insightsService.getTodaySales(),
          insightsService.getTopProducts(),
          insightsService.getStockAlerts(),
        ])

        setTodaySales({ total: sales.total, count: sales.count })
        setTopProducts(top)
        setStockAlerts(alerts)

        if (alerts.length > 0) {
          setAiInsight(`Tienes ${alerts.length} producto(s) agotados. Conviene reponerlos.`)
        } else if (sales.total > 0) {
          setAiInsight(`Llevas S/ ${sales.total.toFixed(2)} en ventas hoy.`)
        } else {
          setAiInsight('Aun no hay ventas registradas hoy.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useSupabaseRealtime('sales', () => setIsLoading(false))
  useSupabaseRealtime('product_stocks', () => setIsLoading(false))

  return { todaySales, topProducts, stockAlerts, aiInsight, isLoading }
}
