import { getSalesOverview } from '@/lib/appData'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'

export default async function VentasPage() {
  const today = new Date().toISOString().slice(0, 10)
  const sales = await getSalesOverview({ from: today, to: today })

  const resumen = [
    { label: 'Total ventas', value: formatCurrency(sales.summary.total), color: '#34D399' },
    { label: 'N° transacciones', value: String(sales.summary.count), color: '#F4F4F5' },
    { label: 'Ticket promedio', value: formatCurrency(sales.summary.average), color: '#A78BFA' },
    { label: 'Venta mas alta', value: formatCurrency(sales.summary.highest), color: '#FCD34D' },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Ventas</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
            Historial real de `sales` y `sale_details`
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {resumen.map((item) => (
          <div key={item.label} style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        {sales.rows.length === 0 ? (
          <div style={{ fontSize: 13, color: '#A1A1AA' }}>
            Aun no hay filas en `sales` para hoy. Cuando cargues ventas reales en Supabase, apareceran aqui.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['ID', 'Fecha', 'Registrado', 'Estado', 'Productos', 'Total'].map((header) => (
                  <th key={header} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.rows.map((sale) => (
                <tr key={sale.id}>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#52525B', fontFamily: 'monospace', fontSize: 12 }}>
                    {sale.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA' }}>{formatDate(sale.issueDate)}</td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#71717A' }}>{formatDateTime(sale.createdAt)}</td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA', fontSize: 12 }}>
                    {sale.items.length
                      ? sale.items.map((item) => `${item.quantity} ${item.productName}`).join(', ')
                      : 'Sin detalle'}
                  </td>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#34D399', fontWeight: 700 }}>
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
