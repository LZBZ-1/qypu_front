'use client'

import { useState } from 'react'

const SEMANA = [
  { dia: 'Lun', ventas: 320, compras: 150 },
  { dia: 'Mar', ventas: 480, compras: 200 },
  { dia: 'Mié', ventas: 290, compras: 80  },
  { dia: 'Jue', ventas: 510, compras: 380 },
  { dia: 'Vie', ventas: 420, compras: 120 },
  { dia: 'Sáb', ventas: 680, compras: 200 },
  { dia: 'Hoy', ventas: 468, compras: 380 },
]

const TOP_PRODUCTOS = [
  { nombre: 'Gaseosa Inca Kola', unidades: 84, ingresos: 168.00, margen: 25 },
  { nombre: 'Leche Gloria',      unidades: 52, ingresos: 197.60, margen: 19 },
  { nombre: 'Chocolate Sublime', unidades: 38, ingresos: 76.00,  margen: 30 },
  { nombre: 'Agua San Luis',     unidades: 31, ingresos: 31.00,  margen: 43 },
  { nombre: 'Pan de molde',      unidades: 18, ingresos: 99.00,  margen: 24 },
]

const RESUMEN_SEMANA = [
  { label: 'Ventas totales',   value: 'S/ 3,168',  color: '#34D399', icon: '💰' },
  { label: 'Compras totales',  value: 'S/ 1,510',  color: '#F87171', icon: '🛒' },
  { label: 'Ganancia neta',    value: 'S/ 1,658',  color: '#A78BFA', icon: '📈' },
  { label: 'Mejor día',        value: 'Sábado',    color: '#FCD34D', icon: '🏆' },
]

const MAX_VENTA = Math.max(...SEMANA.map(d => d.ventas))

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState('Semana')

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Reportes</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Análisis de tu negocio</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Semana', 'Mes', 'Año'].map(p => (
            <button key={p} onClick={() => setPeriodo(p)}
              style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11.5, border: '1px solid rgba(255,255,255,0.12)', background: periodo === p ? '#7C3AED' : 'transparent', color: periodo === p ? '#fff' : '#A1A1AA', cursor: 'pointer', transition: 'all .15s' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {RESUMEN_SEMANA.map(r => (
          <div key={r.label} style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{r.icon}</div>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{r.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: r.color }}>{r.value}</div>
          </div>
        ))}
      </div>

      {/* Gráfico de barras manual */}
      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Ventas vs Compras — Esta semana</div>
        <div style={{ fontSize: 11, color: '#52525B', marginBottom: 20 }}>Comparación diaria en soles</div>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#A1A1AA' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#7C3AED', display: 'inline-block' }} />Ventas
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#A1A1AA' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#F43F5E', display: 'inline-block' }} />Compras
          </div>
        </div>

        {/* Barras */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
          {SEMANA.map(d => (
            <div key={d.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%' }}>
                <div style={{ flex: 1, background: '#7C3AED', borderRadius: '4px 4px 0 0', height: `${(d.ventas / MAX_VENTA) * 100}%`, minHeight: 4, transition: 'height .4s' }} />
                <div style={{ flex: 1, background: '#F43F5E', borderRadius: '4px 4px 0 0', height: `${(d.compras / MAX_VENTA) * 100}%`, minHeight: 4, transition: 'height .4s' }} />
              </div>
              <span style={{ fontSize: 10.5, color: '#52525B', marginTop: 6 }}>{d.dia}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top productos */}
      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Productos más rentables</div>
        <div style={{ fontSize: 11, color: '#52525B', marginBottom: 16 }}>Esta semana · por ingresos generados</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['#', 'Producto', 'Unidades', 'Ingresos', 'Margen'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingRight: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_PRODUCTOS.map((p, i) => (
              <tr key={p.nombre}>
                <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: i === 0 ? '#FCD34D' : '#52525B', fontWeight: 700, fontSize: 12 }}>
                  {i === 0 ? '🏆' : i + 1}
                </td>
                <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>{p.nombre}</td>
                <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA' }}>{p.unidades} uds</td>
                <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#34D399', fontWeight: 600 }}>S/ {p.ingresos.toFixed(2)}</td>
                <td style={{ padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <div style={{ width: `${p.margen * 2}%`, height: 4, borderRadius: 2, background: '#A78BFA' }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600 }}>{p.margen}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight IA */}
      <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA', marginBottom: 8 }}>💡 Análisis de Qypu</div>
        <div style={{ fontSize: 13, color: '#C4B5FD', lineHeight: 1.65 }}>
          Tu mejor día de la semana es el <strong style={{ color: '#F4F4F5' }}>sábado</strong> con S/ 680 en ventas.
          El producto con mayor margen es el <strong style={{ color: '#F4F4F5' }}>Agua San Luis (43%)</strong>.
          Considera aumentar su stock para maximizar ganancias.
          Las compras del jueves representaron el <strong style={{ color: '#F4F4F5' }}>74% de tus egresos</strong> semanales — intenta distribuirlas mejor.
        </div>
      </div>
    </>
  )
}