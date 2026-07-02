import { getCashOverview } from '@/lib/appData'
import { formatCurrency, formatDateTime } from '@/lib/formatters'

export default async function ComprasPage() {
  const today = new Date().toISOString().slice(0, 10)
  const cash = await getCashOverview({ from: today })
  const compras = cash.movimientos.filter((movement) => movement.type === 'egreso')
  const total = compras.reduce((sum, movement) => sum + movement.amount, 0)

  const resumen = [
    { label: 'Total egresos', value: formatCurrency(total), color: '#F87171' },
    { label: 'Egresos', value: String(compras.length), color: '#063052' },
    { label: 'Promedio', value: formatCurrency(compras.length ? total / compras.length : 0), color: '#A78BFA' },
    { label: 'Mayor egreso', value: formatCurrency(compras.reduce((max, movement) => Math.max(max, movement.amount), 0)), color: '#FCD34D' },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Compras</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Vista provisional basada en egresos reales</p>
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: 'rgba(34,158,217,0.07)', border: '1px solid rgba(34,158,217,0.15)', borderRadius: 10, fontSize: 12, color: '#0E7490', lineHeight: 1.6 }}>
        Esta vista resume los egresos registrados para ayudarte a revisar compras y salidas de caja.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {resumen.map((item) => (
          <div key={item.label} style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {compras.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px', fontSize: 13, color: '#587487' }}>
            Todavia no hay egresos registrados.
          </div>
        ) : (
          compras.map((item) => (
            <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(244,63,94,0.1)', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>-</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.concept}</div>
                <div style={{ fontSize: 12, color: '#587487', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Referencia {item.reference}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#F87171' }}>{formatCurrency(item.amount)}</div>
                <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>{formatDateTime(item.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
