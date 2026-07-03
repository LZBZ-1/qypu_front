'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'

type SalesResponse = {
  rows: Array<{
    id: string
    issueDate: string
    createdAt: string
    status: string
    total: number
    client: {
      id: string
      name: string
      email: string
      phoneNumber: string
    } | null
    items: Array<{
      productId: string
      productName: string
      quantity: number
      unitPrice: number
      subtotal: number
    }>
  }>
  summary: {
    total: number
    count: number
    average: number
    highest: number
  }
  error?: string
}

type InventoryResponse = {
  items: Array<{
    productId: string
    name: string
    quantity: number
    unitPrice: number
  }>
  error?: string
}

type SaleDraftItem = {
  productId: string
  quantity: string
  unitPrice: string
}

type FilterState = {
  from: string
  to: string
  product: string
}

const today = new Date().toISOString().slice(0, 10)
const initialFilters: FilterState = { from: today, to: today, product: '' }

const emptySales: SalesResponse = {
  rows: [],
  summary: { total: 0, count: 0, average: 0, highest: 0 },
}

export default function VentasPage() {
  const [sales, setSales] = useState<SalesResponse>(emptySales)
  const [inventory, setInventory] = useState<InventoryResponse>({ items: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [client, setClient] = useState({ name: '', phoneNumber: '', email: '' })
  const [draftItems, setDraftItems] = useState<SaleDraftItem[]>([
    { productId: '', quantity: '1', unitPrice: '' },
  ])

  const loadData = useCallback(async (nextFilters: FilterState) => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (nextFilters.from) params.set('desde', nextFilters.from)
      if (nextFilters.to) params.set('hasta', nextFilters.to)

      const [salesResponse, inventoryResponse] = await Promise.all([
        fetch(`/api/ventas?${params.toString()}`),
        fetch('/api/inventario'),
      ])

      const salesPayload = await salesResponse.json()
      const inventoryPayload = await inventoryResponse.json()

      if (!salesResponse.ok) throw new Error(salesPayload.error ?? 'No se pudo cargar ventas')
      if (!inventoryResponse.ok) throw new Error(inventoryPayload.error ?? 'No se pudo cargar inventario')

      setSales(salesPayload)
      setInventory({ items: inventoryPayload.items ?? [] })
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar ventas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData(initialFilters)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadData])

  const productMap = useMemo(
    () => new Map(inventory.items.map((item) => [item.productId, item])),
    [inventory.items]
  )

  const filteredRows = sales.rows.filter((sale) => {
    if (!filters.product) return true
    return sale.items.some((item) => item.productId === filters.product)
  })

  const filteredSummary = useMemo(() => {
    const total = filteredRows.reduce((sum, row) => sum + row.total, 0)
    return {
      total,
      count: filteredRows.length,
      average: filteredRows.length ? total / filteredRows.length : 0,
      highest: filteredRows.reduce((max, row) => Math.max(max, row.total), 0),
    }
  }, [filteredRows])

  const saleTotal = draftItems.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0)

  function updateDraftItem(index: number, patch: Partial<SaleDraftItem>) {
    setDraftItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item
        const next = { ...item, ...patch }
        if (patch.productId) {
          const product = productMap.get(patch.productId)
          next.unitPrice = String(product?.unitPrice ?? 0)
        }
        return next
      })
    )
  }

  function addDraftItem() {
    setDraftItems((current) => [...current, { productId: '', quantity: '1', unitPrice: '' }])
  }

  function removeDraftItem(index: number) {
    setDraftItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function handleCreateSale() {
    setError('')
    setSuccess('')

    if (!client.name.trim()) {
      setError('El cliente es obligatorio')
      return
    }

    const normalizedItems = draftItems
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        quantity: Math.trunc(Number(item.quantity)),
        unitPrice: Number(item.unitPrice),
      }))

    if (normalizedItems.length === 0) {
      setError('Agrega al menos un producto')
      return
    }

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId)
      if (!product) {
        setError('Selecciona productos validos')
        return
      }

      if (item.quantity <= 0 || item.unitPrice < 0) {
        setError('Cantidad y precio deben ser validos')
        return
      }

      if (product.quantity < item.quantity) {
        setError(`Stock insuficiente para ${product.name}`)
        return
      }
    }

    const detail = normalizedItems
      .map((item) => {
        const product = productMap.get(item.productId)
        return `${item.quantity} x ${product?.name ?? 'Producto'} (${formatCurrency(item.quantity * item.unitPrice)})`
      })
      .join('\n')

    if (!window.confirm(`Confirmar venta para ${client.name.trim()}?\n\n${detail}\n\nTotal: ${formatCurrency(saleTotal)}`)) {
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueDate: today,
          client,
          items: normalizedItems,
        }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo registrar la venta')

      setSuccess('Venta registrada y stock actualizado')
      setClient({ name: '', phoneNumber: '', email: '' })
      setDraftItems([{ productId: '', quantity: '1', unitPrice: '' }])
      await loadData(filters)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo registrar la venta')
    } finally {
      setSaving(false)
    }
  }

  const resumen = [
    { label: 'Total ventas', value: formatCurrency(filteredSummary.total), color: '#34D399' },
    { label: 'Transacciones', value: String(filteredSummary.count), color: '#063052' },
    { label: 'Ticket promedio', value: formatCurrency(filteredSummary.average), color: '#A78BFA' },
    { label: 'Venta mas alta', value: formatCurrency(filteredSummary.highest), color: '#FCD34D' },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0 }}>Ventas</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
            Registra ventas, descuenta stock y revisa el historial
          </p>
        </div>
        <button
          onClick={() => loadData(filters)}
          disabled={loading}
          style={secondaryButtonStyle}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        {resumen.map((item) => (
          <div key={item.label} style={summaryCardStyle}>
            <div style={summaryLabelStyle}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={panelStyle}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#063052', marginBottom: 10 }}>Nueva venta</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 1fr', gap: 10 }}>
            <input
              value={client.name}
              onChange={(event) => setClient((current) => ({ ...current, name: event.target.value }))}
              placeholder="Cliente"
              style={inputStyle}
            />
            <input
              value={client.phoneNumber}
              onChange={(event) => setClient((current) => ({ ...current, phoneNumber: event.target.value }))}
              placeholder="Telefono"
              style={inputStyle}
            />
            <input
              value={client.email}
              onChange={(event) => setClient((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email opcional"
              type="email"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {draftItems.map((item, index) => {
            const selectedProduct = productMap.get(item.productId)
            return (
              <div key={`${index}-${item.productId}`} style={{ display: 'grid', gridTemplateColumns: '2fr .7fr .8fr .8fr auto', gap: 8, alignItems: 'center' }}>
                <select
                  value={item.productId}
                  onChange={(event) => updateDraftItem(index, { productId: event.target.value })}
                  style={inputStyle}
                >
                  <option value="">Producto</option>
                  {inventory.items.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.name} - stock {product.quantity}
                    </option>
                  ))}
                </select>
                <input
                  value={item.quantity}
                  onChange={(event) => updateDraftItem(index, { quantity: event.target.value })}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Cant."
                  style={inputStyle}
                />
                <input
                  value={item.unitPrice}
                  onChange={(event) => updateDraftItem(index, { unitPrice: event.target.value })}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Precio"
                  style={inputStyle}
                />
                <div style={{ fontSize: 12, color: selectedProduct && selectedProduct.quantity < Number(item.quantity) ? '#E11D48' : '#587487' }}>
                  Stock {selectedProduct?.quantity ?? 0}
                </div>
                <button
                  onClick={() => removeDraftItem(index)}
                  disabled={draftItems.length === 1}
                  style={tableButtonStyle}
                >
                  Quitar
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <button onClick={addDraftItem} style={secondaryButtonStyle}>Agregar producto</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#587487' }}>
              Total <span style={{ color: '#059669', fontWeight: 800 }}>{formatCurrency(saleTotal)}</span>
            </div>
            <button
              onClick={handleCreateSale}
              disabled={saving}
              style={primaryButtonStyle}
            >
              {saving ? 'Guardando...' : 'Registrar venta'}
            </button>
          </div>
        </div>
      </div>

      {(error || success) && (
        <div style={error ? errorStyle : successStyle}>
          {error || success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr auto', gap: 10, alignItems: 'center' }}>
        <input
          value={filters.from}
          onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))}
          type="date"
          style={inputStyle}
        />
        <input
          value={filters.to}
          onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))}
          type="date"
          style={inputStyle}
        />
        <select
          value={filters.product}
          onChange={(event) => setFilters((current) => ({ ...current, product: event.target.value }))}
          style={inputStyle}
        >
          <option value="">Todos los productos</option>
          {inventory.items.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.name}
            </option>
          ))}
        </select>
        <button onClick={() => loadData(filters)} disabled={loading} style={secondaryButtonStyle}>
          Filtrar
        </button>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ fontSize: 13, color: '#587487' }}>Cargando ventas...</div>
        ) : filteredRows.length === 0 ? (
          <div style={{ fontSize: 13, color: '#587487' }}>
            Aun no hay ventas para los filtros seleccionados.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 840 }}>
            <thead>
              <tr>
                {['ID', 'Fecha', 'Cliente', 'Productos', 'Estado', 'Total'].map((header) => (
                  <th key={header} style={thStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((sale) => (
                <tr key={sale.id}>
                  <td style={tdMonoStyle}>{sale.id.slice(0, 8).toUpperCase()}</td>
                  <td style={tdStyle}>
                    <div>{formatDate(sale.issueDate)}</div>
                    <div style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{formatDateTime(sale.createdAt)}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#063052', fontWeight: 700 }}>{sale.client?.name ?? 'Sin cliente'}</div>
                    <div style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{sale.client?.phoneNumber ?? ''}</div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>
                    {sale.items.length
                      ? sale.items.map((item) => `${item.quantity} x ${item.productName}`).join(', ')
                      : 'Sin detalle'}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(124,58,237,0.12)', color: '#7C3AED' }}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: '#059669', fontWeight: 800 }}>
                    {formatCurrency(sale.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

const panelStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #DCEFEB',
  borderRadius: 12,
  padding: '18px 20px',
  display: 'grid',
  gap: 14,
}

const summaryCardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #DCEFEB',
  borderRadius: 12,
  padding: '14px 16px',
}

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#52525B',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #CFE9E3',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#063052',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#7C3AED',
  color: '#fff',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const secondaryButtonStyle: React.CSSProperties = {
  padding: '9px 13px',
  borderRadius: 8,
  border: '1px solid #CFE9E3',
  background: '#FFFFFF',
  color: '#008772',
  fontSize: 12,
  fontWeight: 800,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const tableButtonStyle: React.CSSProperties = {
  padding: '7px 9px',
  borderRadius: 7,
  border: '1px solid #CFE9E3',
  background: '#FFFFFF',
  color: '#34566C',
  cursor: 'pointer',
  fontSize: 11.5,
  fontWeight: 700,
  whiteSpace: 'nowrap',
}

const errorStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  background: 'rgba(244,63,94,0.08)',
  border: '1px solid rgba(244,63,94,0.2)',
  fontSize: 12,
  color: '#E11D48',
}

const successStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  background: 'rgba(16,185,129,0.08)',
  border: '1px solid rgba(16,185,129,0.2)',
  fontSize: 12,
  color: '#059669',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 10.5,
  color: '#52525B',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  paddingBottom: 12,
  borderBottom: '1px solid #DCEFEB',
  paddingRight: 12,
}

const tdStyle: React.CSSProperties = {
  padding: '12px 12px 12px 0',
  borderBottom: '1px solid #EEF6F4',
  color: '#587487',
  verticalAlign: 'top',
}

const tdMonoStyle: React.CSSProperties = {
  ...tdStyle,
  color: '#52525B',
  fontFamily: 'monospace',
  fontSize: 12,
}
