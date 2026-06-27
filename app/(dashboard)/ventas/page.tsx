'use client'

import { useState } from 'react'

const VENTAS = [
  { id: 'V-001', hora: '10:32', origen: 'Telegram', items: '4 Gaseosas, 2 Leches, 1 Chocolate', total: 17.60 },
  { id: 'V-002', hora: '09:15', origen: 'Telegram', items: '3 Aguas, 2 Chocolates',              total: 11.00 },
  { id: 'V-003', hora: '08:45', origen: 'Chat web', items: '10 Gaseosas',                         total: 20.00 },
  { id: 'V-004', hora: '08:02', origen: 'Telegram', items: '5 Leches Gloria, 2 Panes',            total: 48.90 },
  { id: 'V-005', hora: '07:30', origen: 'Telegram', items: '1 Azúcar 1kg, 3 Gaseosas',           total: 12.00 },
]

const RESUMEN = [
  { label: 'Total ventas',      value: 'S/ 468.50', color: '#34D399' },
  { label: 'N° transacciones',  value: '18',         color: '#F4F4F5' },
  { label: 'Ticket promedio',   value: 'S/ 26.03',  color: '#A78BFA' },
  { label: 'Venta más alta',    value: 'S/ 78.00',  color: '#FCD34D' },
]

export default function VentasPage() {
  const [filtro, setFiltro] = useState('Todos')

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Ventas</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Historial de ventas del día</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Hoy', 'Semana', 'Mes'].map((c, i) => (
            <button key={c}
              onClick={() => {}}
              style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11.5, border: '1px solid rgba(255,255,255,0.12)', background: i === 0 ? '#7C3AED' : 'transparent', color: i === 0 ? '#fff' : '#A1A1AA', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {RESUMEN.map(r => (
          <div key={r.label} style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{r.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: r.color }}>{r.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros origen */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['Todos', 'Telegram', 'Chat web', 'Manual'].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, border: '1px solid rgba(255,255,255,0.12)', background: filtro === f ? 'rgba(124,58,237,0.2)' : 'transparent', color: filtro === f ? '#C4B5FD' : '#A1A1AA', cursor: 'pointer', transition: 'all .15s' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['ID', 'Hora', 'Origen', 'Productos', 'Total'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VENTAS
              .filter(v => filtro === 'Todos' || v.origen === filtro)
              .map(v => (
                <tr key={v.id}>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#52525B', fontFamily: 'monospace', fontSize: 12 }}>{v.id}</td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA' }}>{v.hora}</td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: v.origen === 'Telegram' ? 'rgba(34,158,217,0.12)' : 'rgba(124,58,237,0.12)', color: v.origen === 'Telegram' ? '#60C8F5' : '#A78BFA' }}>
                      {v.origen === 'Telegram' ? '✈️ ' : '💬 '}{v.origen}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA', fontSize: 12 }}>{v.items}</td>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#34D399', fontWeight: 700 }}>S/ {v.total.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}