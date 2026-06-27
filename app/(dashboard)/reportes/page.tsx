import { getReportOverview } from '@/lib/appData'
import { formatCurrency } from '@/lib/formatters'

export default async function ReportesPage() {
  const report = await getReportOverview()
  const maxValue = Math.max(1, ...report.daily.map((item) => Math.max(item.sales, item.expenses)))
  const resumen = [
    { label: 'Ventas totales', value: formatCurrency(report.summary.sales), color: '#34D399', icon: '$' },
    { label: 'Egresos totales', value: formatCurrency(report.summary.expenses), color: '#F87171', icon: 'E' },
    { label: 'Balance neto', value: formatCurrency(report.summary.net), color: '#A78BFA', icon: 'B' },
    { label: 'Mejor dia', value: report.summary.bestDay, color: '#FCD34D', icon: 'T' },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Reportes</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Resumen real de los ultimos 7 dias</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {resumen.map((item) => (
          <div key={item.label} style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Ventas vs egresos</div>
        <div style={{ fontSize: 11, color: '#52525B', marginBottom: 20 }}>Comparacion diaria segun las tablas existentes</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
          {report.daily.map((day) => (
            <div key={day.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%' }}>
                <div style={{ flex: 1, background: '#7C3AED', borderRadius: '4px 4px 0 0', height: `${(day.sales / maxValue) * 100}%`, minHeight: 4 }} />
                <div style={{ flex: 1, background: '#F43F5E', borderRadius: '4px 4px 0 0', height: `${(day.expenses / maxValue) * 100}%`, minHeight: 4 }} />
              </div>
              <span style={{ fontSize: 10.5, color: '#52525B', marginTop: 6 }}>{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Productos con mayor ingreso</div>
        <div style={{ fontSize: 11, color: '#52525B', marginBottom: 16 }}>Calculado desde `sale_details` y `products`</div>

        {report.topProducts.length === 0 ? (
          <div style={{ fontSize: 13, color: '#A1A1AA' }}>Todavia no hay ventas con detalle para rankear productos.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['#', 'Producto', 'Unidades', 'Ingresos'].map((header) => (
                  <th key={header} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingRight: 12 }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.topProducts.map((item, index) => (
                <tr key={item.name}>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: index === 0 ? '#FCD34D' : '#52525B', fontWeight: 700, fontSize: 12 }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA' }}>{item.quantity} uds</td>
                  <td style={{ padding: '11px 12px 11px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#34D399', fontWeight: 600 }}>{formatCurrency(item.income)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
