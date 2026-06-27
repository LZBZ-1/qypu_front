'use client'

import { useEffect, useRef } from 'react'

const CATEGORIES = [
  { label: 'Bebidas',  value: 210, color: '#7C3AED' },
  { label: 'Lácteos', value: 145, color: '#10B981' },
  { label: 'Snacks',  value: 78,  color: '#F59E0B' },
  { label: 'Otros',   value: 35,  color: '#F43F5E' },
]

const TOTAL = CATEGORIES.reduce((s, c) => s + c.value, 0)

export default function DonutChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<any>(null)

  useEffect(() => {
    import('chart.js/auto').then((mod) => {
      const Chart = mod.default
      if (chartRef.current) chartRef.current.destroy()
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: CATEGORIES.map(c => c.label),
          datasets: [{
            data: CATEGORIES.map(c => c.value),
            backgroundColor: CATEGORIES.map(c => c.color),
            borderWidth: 0,
            hoverOffset: 4,
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: { legend: { display: false } }
        }
      })
    })
    return () => { chartRef.current?.destroy() }
  }, [])

  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Ventas por categoría</div>
        <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>Distribución de hoy</div>
      </div>

      {/* Donut */}
      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 16px' }}>
        <canvas ref={canvasRef} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>S/{TOTAL}</span>
          <span style={{ fontSize: 10, color: '#52525B' }}>total</span>
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CATEGORIES.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: '#A1A1AA' }}>{c.label}</span>
            </div>
            <span style={{ fontWeight: 600 }}>S/ {c.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}