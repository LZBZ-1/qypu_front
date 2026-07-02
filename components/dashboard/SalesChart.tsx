'use client'

import { useEffect, useRef } from 'react'
import type { Chart } from 'chart.js'

type SalesPoint = {
  label: string
  total: number
}

export default function SalesChart({ points }: { points: SalesPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart<'bar'> | null>(null)

  useEffect(() => {
    import('chart.js/auto').then((mod) => {
      const Chart = mod.default
      if (chartRef.current) chartRef.current.destroy()

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      const labels = points.length ? points.map((point) => point.label) : ['Sin datos']
      const values = points.length ? points.map((point) => point.total) : [0]

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Ventas S/',
              data: values,
              backgroundColor: values.map((_, index) =>
                index === values.length - 1 ? 'rgba(124,58,237,0.3)' : '#7C3AED'
              ),
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: '#EEF6F4' },
              ticks: { color: '#52525B', font: { size: 11 } },
            },
            y: {
              grid: { color: '#EEF6F4' },
              ticks: { color: '#52525B', font: { size: 11 }, callback: (value: string | number) => 'S/' + value },
            },
          },
        },
      })
    })

    return () => {
      chartRef.current?.destroy()
    }
  }, [points])

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Ventas por hora</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>
            {points.length ? 'Ventas registradas hoy' : 'Todavia no hay ventas registradas hoy'}
          </div>
        </div>
        <span
          style={{
            padding: '3px 8px',
            borderRadius: 20,
            fontSize: 10.5,
            fontWeight: 500,
            background: points.length ? 'rgba(16,185,129,0.12)' : '#EEF6F4',
            color: points.length ? '#059669' : '#587487',
          }}
        >
          {points.length ? 'En vivo' : 'Sin datos'}
        </span>
      </div>
      <div style={{ height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
