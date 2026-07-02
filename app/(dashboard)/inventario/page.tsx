'use client'

import { useEffect, useMemo, useState } from 'react'

import { formatCurrency, formatDateTime } from '@/lib/formatters'

type InventoryResponse = {
  context: {
    organization: { id: string; name: string; address: string | null }
    branch: { id: string; name: string } | null
    categories: Array<{ id: string; name: string }>
  } | null
  items: Array<{
    stockId: string | null
    productId: string
    name: string
    categoryId: string | null
    categoryName: string
    quantity: number
    unitPrice: number
    updatedAt: string | null
  }>
  summary: {
    totalProducts: number
    totalUnits: number
    agotados: number
  }
  error?: string
}

const initialData: InventoryResponse = {
  context: null,
  items: [],
  summary: { totalProducts: 0, totalUnits: 0, agotados: 0 },
}

function getStatus(quantity: number) {
  if (quantity === 0) return { label: 'Agotado', bg: 'rgba(244,63,94,0.1)', color: '#FB7185' }
  return { label: 'Disponible', bg: 'rgba(16,185,129,0.1)', color: '#34D399' }
}

export default function InventarioPage() {
  const [data, setData] = useState<InventoryResponse>(initialData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    unitPrice: '',
    quantity: '',
  })

  async function loadInventory() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/inventario')
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo cargar inventario')
      setData(payload)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar inventario')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInventory()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  async function handleCreateProduct() {
    if (!form.name.trim()) {
      setError('El nombre del producto es obligatorio')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          categoryId: form.categoryId || null,
          unitPrice: Number(form.unitPrice) || 0,
          quantity: Number(form.quantity) || 0,
        }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo crear el producto')

      setData(payload)
      setForm({ name: '', categoryId: '', unitPrice: '', quantity: '' })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo crear el producto')
    } finally {
      setSaving(false)
    }
  }

  const categorias = useMemo(
    () => ['Todas', ...(data.context?.categories.map((item) => item.name) ?? [])],
    [data.context]
  )

  const filtrados = data.items.filter((item) => {
    const matchBusqueda = item.name.toLowerCase().includes(busqueda.toLowerCase())
    const matchCategoria = categoria === 'Todas' || item.categoryName === categoria
    return matchBusqueda && matchCategoria
  })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Inventario</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
            {data.summary.totalProducts} producto(s) en {data.context?.branch?.name ?? 'sin sucursal'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#A1A1AA', alignItems: 'center' }}>
          <span style={{ color: '#34D399' }}>{data.summary.totalUnits} unidades</span>
          <span style={{ color: '#52525B' }}>·</span>
          <span style={{ color: '#FB7185' }}>{data.summary.agotados} agotado(s)</span>
        </div>
      </div>

      <div style={{ background: 'rgba(34,158,217,0.07)', border: '1px solid rgba(34,158,217,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#60C8F5' }}>
        El esquema actual usa `products`, `product_stocks` y `categories`. Por ahora no existe `stock_minimo`, asi que el estado se basa en disponibilidad real.
      </div>

      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10 }}>
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Nombre del producto"
          style={inputStyle}
        />
        <select
          value={form.categoryId}
          onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
          style={inputStyle}
        >
          <option value="">Sin categoria</option>
          {(data.context?.categories ?? []).map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          value={form.unitPrice}
          onChange={(event) => setForm((current) => ({ ...current, unitPrice: event.target.value }))}
          placeholder="Precio"
          type="number"
          min="0"
          step="0.01"
          style={inputStyle}
        />
        <input
          value={form.quantity}
          onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
          placeholder="Cantidad"
          type="number"
          min="0"
          step="1"
          style={inputStyle}
        />
        <button
          onClick={handleCreateProduct}
          disabled={saving}
          style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'default' : 'pointer' }}
        >
          {saving ? 'Guardando...' : 'Crear'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', fontSize: 12, color: '#F87171' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar producto..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {categorias.map((item) => (
            <button
              key={item}
              onClick={() => setCategoria(item)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 11.5,
                border: '1px solid rgba(255,255,255,0.12)',
                background: categoria === item ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: categoria === item ? '#C4B5FD' : '#A1A1AA',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        {loading ? (
          <div style={{ fontSize: 13, color: '#A1A1AA' }}>Cargando inventario real...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ fontSize: 13, color: '#A1A1AA' }}>
            No hay productos que coincidan. Si la base sigue vacia, crea el primero arriba.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Producto', 'Categoria', 'Stock', 'P. Venta', 'Actualizado', 'Estado'].map((header) => (
                  <th key={header} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingRight: 12 }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => {
                const status = getStatus(item.quantity)
                return (
                  <tr key={item.productId}>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA', fontSize: 12 }}>{item.categoryName}</td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 700, color: item.quantity === 0 ? '#F87171' : '#F4F4F5' }}>{item.quantity}</td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#34D399' }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#71717A' }}>
                      {item.updatedAt ? formatDateTime(item.updatedAt) : 'Sin stock'}
                    </td>
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
        )}
      </div>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#0A0A0D',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#F4F4F5',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}
