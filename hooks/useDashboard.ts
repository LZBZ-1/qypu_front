'use client'

import { useState, useEffect, useCallback } from 'react'
import { insightsService } from '../services/insightsService'
import { useSupabaseRealtime } from './useSupabaseRealtime'

const NEGOCIO_ID = process.env.NEXT_PUBLIC_NEGOCIO_ID ?? ''

export function useDashboard() {
  const [todaySales, setTodaySales] = useState({ total: 0, count: 0 })
  const [topProducts, setTopProducts] = useState<{ id: string; name: string; qty: number }[]>([])
  const [stockAlerts, setStockAlerts] = useState<any[]>([])
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [sales, top, alerts, caja] = await Promise.all([
        insightsService.getTodaySales(NEGOCIO_ID),
        insightsService.getTopProducts(NEGOCIO_ID),
        insightsService.getStockAlerts(NEGOCIO_ID),
        insightsService.getCajaBalance(NEGOCIO_ID),
      ])
      setTodaySales({ total: sales.total, count: sales.count })
      setTopProducts(top)
      setStockAlerts(alerts)

      if (alerts.length > 0) {
        setAiInsight(`Tienes ${alerts.length} producto(s) con stock bajo. Considera reabastecer pronto.`)
      } else if (sales.total > 0) {
        setAiInsight(`Llevas S/ ${sales.total.toFixed(2)} en ventas hoy. ¡Vas bien! 💪`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Recargar cuando haya nuevas ventas en tiempo real
  useSupabaseRealtime('ventas', () => loadData())
  useSupabaseRealtime('inventario', () => loadData())

  return { todaySales, topProducts, stockAlerts, aiInsight, isLoading }
}