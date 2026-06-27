interface Product {
  name: string
  stock: number
  max: number
  status: 'ok' | 'low' | 'out'
}

const PRODUCTS: Product[] = [
  { name: 'Gaseosa Inca Kola',  stock: 32, max: 40, status: 'ok'  },
  { name: 'Leche Gloria',       stock: 8,  max: 20, status: 'ok'  },
  { name: 'Chocolate Sublime',  stock: 2,  max: 20, status: 'low' },
  { name: 'Azúcar 1kg',         stock: 1,  max: 20, status: 'low' },
  { name: 'Agua San Luis',      stock: 0,  max: 20, status: 'out' },
]

const STATUS = {
  ok:  { label: 'OK',      bg: 'rgba(16,185,129,0.1)',  color: '#34D399' },
  low: { label: 'Bajo',    bg: 'rgba(245,158,11,0.1)',  color: '#FCD34D' },
  out: { label: 'Agotado', bg: 'rgba(244,63,94,0.1)',   color: '#FB7185' },
}

const BAR_COLOR = { ok: '#7C3AED', low: '#F59E0B', out: '#F43F5E' }

export default function InventoryTable() {
  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Inventario</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>24 productos · 3 alertas</div>
        </div>
        <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 500, background: 'rgba(245,158,11,0.12)', color: '#FCD34D' }}>
          3 stock bajo
        </span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <thead>
          <tr>
            {['Producto', 'Stock', '', 'Estado'].map(h => (
              <th key={h} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((p) => {
            const pct = Math.round((p.stock / p.max) * 100)
            const s = STATUS[p.status]
            return (
              <tr key={p.name}>
                <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '10px 8px 10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA', whiteSpace: 'nowrap' }}>{p.stock} uds</td>
                <td style={{ padding: '10px 12px 10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: 4, borderRadius: 2, background: BAR_COLOR[p.status] }} />
                  </div>
                </td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}