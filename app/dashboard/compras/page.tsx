'use client'

import { useState } from 'react'

const COMPRAS = [
  { id: 'C-001', hora: '08:14', proveedor: 'Distribuidora Norte', items: '10 Leche Gloria',         total: 380.00, imagen: true  },
  { id: 'C-002', hora: 'Ayer',  proveedor: 'Mayorista Central',   items: '24 Gaseosas Inca Kola',   total: 96.00,  imagen: false },
  { id: 'C-003', hora: 'Ayer',  proveedor: 'Distribuidora Norte', items: '12 Chocolates Sublime',   total: 36.00,  imagen: true  },
  { id: 'C-004', hora: 'Lun',   proveedor: 'Mercado Central',     items: '5kg Azúcar, 3kg Arroz',   total: 28.50,  imagen: false },
]

const RESUMEN = [
  { label: 'Total compras',    value: 'S/ 540.50', color: '#F87171' },
  { label: 'N° compras',       value: '4',          color: '#F4F4F5' },
  { label: 'Promedio compra',  value: 'S/ 135.13', color: '#A78BFA' },
  { label: 'Mayor compra',     value: 'S/ 380.00', color: '#FCD34D' },
]

export default function ComprasPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Compras</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Historial de compras y gastos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: 10, background: '#7C3AED', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Registrar compra
        </button>
      </div>

      {/* Form rápido */}
      {showForm && (
        <div style={{ background: '#18181B', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#C4B5FD' }}>💡 Tip: también puedes registrar compras desde Telegram escribiendo "Compré 10 leches por 380 soles"</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input placeholder="Proveedor" style={inputStyle} />
            <input placeholder="Total (S/)" type="number" style={inputStyle} />
          </div>
          <textarea placeholder="Productos (ej: 10 Leche Gloria, 5 Gaseosas)" rows={2} style={{ ...inputStyle, resize: 'none' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 16px', borderRadius: 8, background: '#7C3AED', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#A1A1AA', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {RESUMEN.map(r => (
          <div key={r.label} style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{r.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: r.color }}>{r.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {COMPRAS.map(c => (
          <div key={c.id} style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🛒</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.proveedor}</div>
              <div style={{ fontSize: 12, color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.items}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#F87171' }}>S/ {c.total.toFixed(2)}</div>
              <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>{c.hora}</div>
            </div>
            {c.imagen && (
              <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#34D399', flexShrink: 0 }}>📄 Boleta</span>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, color: '#F4F4F5', fontFamily: 'inherit', outline: 'none', width: '100%',
}