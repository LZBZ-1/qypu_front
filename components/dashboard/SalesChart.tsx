'use client'

import { useEffect, useRef } from 'react'

const HOURS  = ['7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm']
const VALUES = [18, 55, 42, 78, 95, 110, 88, 62, 40, 0]

export default function SalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<any>(null)

  useEffect(() => {
    let Chart: any
    import('chart.js/auto').then((mod) => {
      Chart = mod.default

      if (chartRef.current) chartRef.current.destroy()

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: HOURS,
          datasets: [{
            label: 'Ventas S/',
            data: VALUES,
            backgroundColor: VALUES.map((_, i) =>
              i === VALUES.length - 1 ? 'rgba(124,58,237,0.3)' : '#7C3AED'
            ),
            borderRadius: 6,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#52525B', font: { size: 11 } }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#52525B', font: { size: 11 }, callback: (v: any) => 'S/' + v }
            }
          }
        }
      })
    })

    return () => { chartRef.current?.destroy() }
  }, [])

  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Ventas por hora</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>Hoy · Últimas 10 horas</div>
        </div>
        <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 500, background: 'rgba(16,185,129,0.12)', color: '#34D399' }}>
          En vivo
        </span>
      </div>
      <div style={{ height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}