type InventoryPreview = {
  name: string
  quantity: number
  categoryName: string
}

export default function InventoryTable({
  products,
  totalProducts,
  agotados,
}: {
  products: InventoryPreview[]
  totalProducts: number
  agotados: number
}) {
  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Inventario</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>
            {totalProducts} producto{totalProducts === 1 ? '' : 's'} en el esquema real
          </div>
        </div>
        <span
          style={{
            padding: '3px 8px',
            borderRadius: 20,
            fontSize: 10.5,
            fontWeight: 500,
            background: agotados ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
            color: agotados ? '#FB7185' : '#34D399',
          }}
        >
          {agotados ? `${agotados} agotado(s)` : 'Stock disponible'}
        </span>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '24px 0', fontSize: 12.5, color: '#71717A' }}>
          Aun no hay productos cargados en `products`. Puedes crearlos desde la vista de Inventario.
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr>
              {['Producto', 'Categoria', 'Stock', 'Estado'].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: 'left',
                    fontSize: 10.5,
                    color: '#52525B',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '.05em',
                    paddingBottom: 10,
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isOut = product.quantity === 0
              return (
                <tr key={product.name}>
                  <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '10px 8px 10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA' }}>
                    {product.categoryName}
                  </td>
                  <td style={{ padding: '10px 8px 10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA', whiteSpace: 'nowrap' }}>
                    {product.quantity} uds
                  </td>
                  <td style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '2px 8px',
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 600,
                        background: isOut ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
                        color: isOut ? '#FB7185' : '#34D399',
                      }}
                    >
                      {isOut ? 'Agotado' : 'Disponible'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
