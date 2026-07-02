import { getSalesOverview } from '@/lib/appData'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'

export default async function VentasPage() {
  const today = new Date().toISOString().slice(0, 10)
  const sales = await getSalesOverview({ from: today, to: today })

  const resumen = [
    { label: 'Total ventas', value: formatCurrency(sales.summary.total), color: '#34D399' },
    { label: 'Transacciones', value: String(sales.summary.count), color: '#063052' },
    { label: 'Ticket promedio', value: formatCurrency(sales.summary.average), color: '#A78BFA' },
    { label: 'Venta mas alta', value: formatCurrency(sales.summary.highest), color: '#FCD34D' },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Ventas</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
            Historial de ventas del dia
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {resumen.map((item) => (
          <div key={item.label} style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px' }}>
        {sales.rows.length === 0 ? (
          <div style={{ fontSize: 13, color: '#587487' }}>
            Aun no hay ventas registradas para hoy. Cuando cargues una venta, aparecera aqui.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['ID', 'Fecha', 'Registrado', 'Estado', 'Productos', 'Total'].map((header) => (
                  <th key={header} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid #DCEFEB' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.rows.map((sale) => (
                <tr key={sale.id}>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid #EEF6F4', color: '#52525B', fontFamily: 'monospace', fontSize: 12 }}>
                    {sale.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid #EEF6F4', color: '#587487' }}>{formatDate(sale.issueDate)}</td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid #EEF6F4', color: '#71717A' }}>{formatDateTime(sale.createdAt)}</td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid #EEF6F4' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px 12px 0', borderBottom: '1px solid #EEF6F4', color: '#587487', fontSize: 12 }}>
                    {sale.items.length
                      ? sale.items.map((item) => `${item.quantity} ${item.productName}`).join(', ')
                      : 'Sin detalle'}
                  </td>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid #EEF6F4', color: '#059669', fontWeight: 700 }}>
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
