'use client'

import { useState } from 'react'

const PRODUCTOS = [
  { id: 1, nombre: 'Gaseosa Inca Kola', categoria: 'Bebidas',  stock: 32, minimo: 10, precio_venta: 2.00, precio_costo: 1.50 },
  { id: 2, nombre: 'Leche Gloria',      categoria: 'Lácteos',  stock: 8,  minimo: 5,  precio_venta: 3.80, precio_costo: 3.20 },
  { id: 3, nombre: 'Chocolate Sublime', categoria: 'Snacks',   stock: 2,  minimo: 5,  precio_venta: 2.00, precio_costo: 1.40 },
  { id: 4, nombre: 'Azúcar 1kg',        categoria: 'Abarrotes',stock: 1,  minimo: 5,  precio_venta: 3.50, precio_costo: 2.80 },
  { id: 5, nombre: 'Agua San Luis',     categoria: 'Bebidas',  stock: 0,  minimo: 10, precio_venta: 1.00, precio_costo: 0.70 },
  { id: 6, nombre: 'Pan de molde',      categoria: 'Panadería',stock: 15, minimo: 5,  precio_venta: 5.50, precio_costo: 4.20 },
]

function getStatus(stock: number, minimo: number) {
  if (stock === 0)          return { label: 'Agotado', bg: 'rgba(244,63,94,0.1)',   color: '#FB7185' }
  if (stock <= minimo)      return { label: 'Bajo',    bg: 'rgba(245,158,11,0.1)',  color: '#FCD34D' }
  return                           { label: 'OK',      bg: 'rgba(16,185,129,0.1)',  color: '#34D399' }
}

export default function InventarioPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')

  const categorias = ['Todas', ...Array.from(new Set(PRODUCTOS.map(p => p.categoria)))]

  const filtrados = PRODUCTOS.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const matchCategoria = categoria === 'Todas' || p.categoria === categoria
    return matchBusqueda && matchCategoria
  })

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Inventario</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>{PRODUCTOS.length} productos registrados</p>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#A1A1AA', alignItems: 'center' }}>
          <span style={{ color: '#FCD34D' }}>⚠ 3 con stock bajo</span>
          <span style={{ color: '#52525B' }}>·</span>
          <span style={{ color: '#FB7185' }}>1 agotado</span>
        </div>
      </div>

      {/* Tip Telegram */}
      <div style={{ background: 'rgba(34,158,217,0.07)', border: '1px solid rgba(34,158,217,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#60C8F5' }}>
        ✈️ <strong>Tip:</strong> Actualiza tu inventario desde Telegram escribiendo cosas como <em>"Llegaron 20 gaseosas"</em> o <em>"¿Cuánta leche tengo?"</em>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          style={{ flex: 1, background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#F4F4F5', fontFamily: 'inherit', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {categorias.map(c => (
            <button key={c} onClick={() => setCategoria(c)}
              style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11.5, border: '1px solid rgba(255,255,255,0.12)', background: categoria === c ? 'rgba(124,58,237,0.2)' : 'transparent', color: categoria === c ? '#C4B5FD' : '#A1A1AA', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Producto', 'Categoría', 'Stock', 'Mínimo', 'P. Venta', 'P. Costo', 'Margen', 'Estado'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingRight: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => {
              const status = getStatus(p.stock, p.minimo)
              const margen = (((p.precio_venta - p.precio_costo) / p.precio_costo) * 100).toFixed(0)
              return (
                <tr key={p.id}>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>{p.nombre}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA', fontSize: 12 }}>{p.categoria}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 700, color: p.stock === 0 ? '#F87171' : p.stock <= p.minimo ? '#FCD34D' : '#F4F4F5' }}>{p.stock}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#52525B' }}>{p.minimo}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#34D399' }}>S/ {p.precio_venta.toFixed(2)}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F87171' }}>S/ {p.precio_costo.toFixed(2)}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A78BFA', fontWeight: 600 }}>{margen}%</td>
                  <td style={{ padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}