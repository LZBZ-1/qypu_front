'use client'

import { useEffect, useRef } from 'react'

type CategoryPoint = {
  label: string
  value: number
}

const palette = ['#7C3AED', '#10B981', '#F59E0B', '#F43F5E', '#38BDF8', '#FACC15']

export default function DonutChart({ items }: { items: CategoryPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)
  const normalizedItems = items.length ? items : [{ label: 'Sin ventas', value: 1 }]
  const total = items.reduce((sum, item) => sum + item.value, 0)

  useEffect(() => {
    import('chart.js/auto').then((mod) => {
      const Chart = mod.default
      if (chartRef.current) chartRef.current.destroy()
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: normalizedItems.map((item) => item.label),
          datasets: [
            {
              data: normalizedItems.map((item) => item.value),
              backgroundColor: normalizedItems.map((_, index) => palette[index % palette.length]),
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: { legend: { display: false } },
        },
      })
    })

    return () => {
      chartRef.current?.destroy()
    }
  }, [normalizedItems])

  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Ventas por categoria</div>
        <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>
          {items.length ? 'Distribucion de ventas reales' : 'No hay ventas para agrupar por categoria'}
        </div>
      </div>

      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 16px' }}>
        <canvas ref={canvasRef} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>S/{total.toFixed(0)}</span>
          <span style={{ fontSize: 10, color: '#52525B' }}>total</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {normalizedItems.map((item, index) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: palette[index % palette.length],
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#A1A1AA' }}>{item.label}</span>
            </div>
            <span style={{ fontWeight: 600 }}>{items.length ? `S/ ${item.value.toFixed(2)}` : 'Sin datos'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
