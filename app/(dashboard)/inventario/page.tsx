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

type InventoryItem = InventoryResponse['items'][number]

type ProductDraft = {
  name: string
  categoryId: string
  unitPrice: string
  quantity: string
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
  const [savingCategory, setSavingCategory] = useState(false)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryEditor, setCategoryEditor] = useState({ id: '', name: '' })
  const [editingProductId, setEditingProductId] = useState('')
  const [deletingProductId, setDeletingProductId] = useState('')
  const [productDraft, setProductDraft] = useState<ProductDraft>({
    name: '',
    categoryId: '',
    unitPrice: '',
    quantity: '',
  })
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

    if (!form.categoryId) {
      setError('Crea o selecciona una categoria antes de crear el producto')
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

  async function handleCreateCategory() {
    const name = newCategoryName.trim()

    if (!name) {
      setError('El nombre de la categoria es obligatorio')
      return
    }

    setSavingCategory(true)
    setError('')

    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo crear la categoria')

      setData(payload.inventory)
      setForm((current) => ({ ...current, categoryId: payload.category.id }))
      setNewCategoryName('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo crear la categoria')
    } finally {
      setSavingCategory(false)
    }
  }

  function handleSelectCategoryForEdit(categoryId: string) {
    const selectedCategory = data.context?.categories.find((item) => item.id === categoryId)
    setCategoryEditor({
      id: selectedCategory?.id ?? '',
      name: selectedCategory?.name ?? '',
    })
  }

  async function handleUpdateCategory() {
    if (!categoryEditor.id || !categoryEditor.name.trim()) {
      setError('Selecciona una categoria y escribe un nombre')
      return
    }

    setSavingCategory(true)
    setError('')

    try {
      const response = await fetch('/api/categorias', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryEditor.id, name: categoryEditor.name }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo actualizar la categoria')

      setData(payload.inventory)
      setCategoryEditor({ id: payload.category.id, name: payload.category.name })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo actualizar la categoria')
    } finally {
      setSavingCategory(false)
    }
  }

  async function handleDeleteCategory() {
    if (!categoryEditor.id) {
      setError('Selecciona una categoria para eliminar')
      return
    }

    if (!window.confirm('Eliminar esta categoria? Solo se puede si no tiene productos.')) return

    setSavingCategory(true)
    setError('')

    try {
      const response = await fetch('/api/categorias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryEditor.id }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo eliminar la categoria')

      setData(payload.inventory)
      setCategoryEditor({ id: '', name: '' })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo eliminar la categoria')
    } finally {
      setSavingCategory(false)
    }
  }

  function startEditProduct(item: InventoryItem) {
    setEditingProductId(item.productId)
    setProductDraft({
      name: item.name,
      categoryId: item.categoryId ?? '',
      unitPrice: String(item.unitPrice),
      quantity: String(item.quantity),
    })
    setError('')
  }

  async function handleUpdateProduct(productId: string) {
    if (!productDraft.name.trim() || !productDraft.categoryId) {
      setError('Nombre y categoria son obligatorios para actualizar el producto')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/inventario', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: productDraft.name,
          categoryId: productDraft.categoryId,
          unitPrice: Number(productDraft.unitPrice) || 0,
          quantity: Number(productDraft.quantity) || 0,
        }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo actualizar el producto')

      setData(payload)
      setEditingProductId('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo actualizar el producto')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!window.confirm('Eliminar este producto? No se puede eliminar si ya fue usado en ventas.')) return

    setDeletingProductId(productId)
    setError('')

    try {
      const response = await fetch('/api/inventario', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'No se pudo eliminar el producto')

      setData(payload)
      if (editingProductId === productId) setEditingProductId('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo eliminar el producto')
    } finally {
      setDeletingProductId('')
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
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#587487', alignItems: 'center' }}>
          <span style={{ color: '#34D399' }}>{data.summary.totalUnits} unidades</span>
          <span style={{ color: '#52525B' }}>·</span>
          <span style={{ color: '#FB7185' }}>{data.summary.agotados} agotado(s)</span>
        </div>
      </div>

      <div style={{ background: 'rgba(34,158,217,0.07)', border: '1px solid rgba(34,158,217,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#0E7490' }}>
        El estado de cada producto se calcula con la disponibilidad registrada en inventario.
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px', display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) auto', gap: 10, alignItems: 'center' }}>
          <input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="Nueva categoria"
            style={inputStyle}
          />
          <button
            onClick={handleCreateCategory}
            disabled={savingCategory}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #CFE9E3', background: '#E0F7F1', color: '#008772', fontSize: 13, fontWeight: 700, cursor: savingCategory ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
          >
            {savingCategory ? 'Creando...' : 'Crear categoria'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 0.9fr) minmax(180px, 1fr) auto auto', gap: 10, alignItems: 'center' }}>
          <select
            value={categoryEditor.id}
            onChange={(event) => handleSelectCategoryForEdit(event.target.value)}
            style={inputStyle}
          >
            <option value="">Editar categoria</option>
            {(data.context?.categories ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            value={categoryEditor.name}
            onChange={(event) => setCategoryEditor((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nombre de categoria"
            style={inputStyle}
          />
          <button
            onClick={handleUpdateCategory}
            disabled={savingCategory || !categoryEditor.id}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #CFE9E3', background: '#FFFFFF', color: '#008772', fontSize: 13, fontWeight: 700, cursor: savingCategory || !categoryEditor.id ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
          >
            Guardar
          </button>
          <button
            onClick={handleDeleteCategory}
            disabled={savingCategory || !categoryEditor.id}
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(244,63,94,0.28)', background: '#FFFFFF', color: '#E11D48', fontSize: 13, fontWeight: 700, cursor: savingCategory || !categoryEditor.id ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
          >
            Eliminar
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10 }}>
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
            <option value="">Selecciona categoria</option>
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
                border: '1px solid #CFE9E3',
                background: categoria === item ? '#E0F7F1' : '#FFFFFF',
                color: categoria === item ? '#008772' : '#34566C',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px' }}>
        {loading ? (
          <div style={{ fontSize: 13, color: '#587487' }}>Cargando inventario...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ fontSize: 13, color: '#587487' }}>
            No hay productos que coincidan. Si la base sigue vacia, crea el primero arriba.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Producto', 'Categoria', 'Stock', 'P. Venta', 'Actualizado', 'Estado', 'Acciones'].map((header) => (
                  <th key={header} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid #DCEFEB', paddingRight: 12 }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => {
                const status = getStatus(item.quantity)
                const isEditing = editingProductId === item.productId
                return (
                  <tr key={item.productId}>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid #EEF6F4', color: '#063052', fontWeight: 500 }}>
                      {isEditing ? (
                        <input
                          value={productDraft.name}
                          onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
                          style={tableInputStyle}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid #EEF6F4', color: '#587487', fontSize: 12 }}>
                      {isEditing ? (
                        <select
                          value={productDraft.categoryId}
                          onChange={(event) => setProductDraft((current) => ({ ...current, categoryId: event.target.value }))}
                          style={tableInputStyle}
                        >
                          {(data.context?.categories ?? []).map((categoryItem) => (
                            <option key={categoryItem.id} value={categoryItem.id}>
                              {categoryItem.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.categoryName
                      )}
                    </td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid #EEF6F4', fontWeight: 700, color: item.quantity === 0 ? '#F87171' : '#063052' }}>
                      {isEditing ? (
                        <input
                          value={productDraft.quantity}
                          onChange={(event) => setProductDraft((current) => ({ ...current, quantity: event.target.value }))}
                          type="number"
                          min="0"
                          step="1"
                          style={tableInputStyle}
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid #EEF6F4', color: '#059669' }}>
                      {isEditing ? (
                        <input
                          value={productDraft.unitPrice}
                          onChange={(event) => setProductDraft((current) => ({ ...current, unitPrice: event.target.value }))}
                          type="number"
                          min="0"
                          step="0.01"
                          style={tableInputStyle}
                        />
                      ) : (
                        formatCurrency(item.unitPrice)
                      )}
                    </td>
                    <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid #EEF6F4', color: '#71717A' }}>
                      {item.updatedAt ? formatDateTime(item.updatedAt) : 'Sin stock'}
                    </td>
                    <td style={{ padding: '11px 0', borderBottom: '1px solid #EEF6F4' }}>
                      <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '11px 0', borderBottom: '1px solid #EEF6F4' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateProduct(item.productId)}
                              disabled={saving}
                              style={tableButtonStyle}
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingProductId('')}
                              disabled={saving}
                              style={tableButtonStyle}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditProduct(item)}
                              style={tableButtonStyle}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.productId)}
                              disabled={deletingProductId === item.productId}
                              style={{ ...tableButtonStyle, color: '#E11D48', borderColor: 'rgba(244,63,94,0.28)' }}
                            >
                              {deletingProductId === item.productId ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </>
                        )}
                      </div>
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

const tableInputStyle: React.CSSProperties = {
  ...inputStyle,
  minWidth: 96,
  padding: '7px 9px',
  fontSize: 12,
}

const tableButtonStyle: React.CSSProperties = {
  padding: '6px 9px',
  borderRadius: 7,
  border: '1px solid #CFE9E3',
  background: '#FFFFFF',
  color: '#34566C',
  cursor: 'pointer',
  fontSize: 11.5,
  fontWeight: 700,
  whiteSpace: 'nowrap',
}
