import { getCashOverview } from '@/lib/appData'
import { formatCurrency, formatDateTime } from '@/lib/formatters'

export default async function CajaPage() {
  const today = new Date().toISOString().slice(0, 10)
  const cash = await getCashOverview({ from: today })

  return (
    <>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Caja</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
          Movimientos de caja del dia
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <StatCard label="Ingresos" value={formatCurrency(cash.ingresos)} tone="#34D399" detail={`${cash.movimientos.filter((item) => item.type === 'ingreso').length} movimiento(s)`} />
        <StatCard label="Egresos" value={formatCurrency(cash.egresos)} tone="#F87171" detail={`${cash.movimientos.filter((item) => item.type === 'egreso').length} movimiento(s)`} />
        <StatCard label="Balance neto" value={formatCurrency(cash.balance)} tone={cash.balance >= 0 ? '#34D399' : '#F87171'} detail={`7 dias: ${formatCurrency(cash.weekBalance)}`} />
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px' }}>
        {cash.movimientos.length === 0 ? (
          <div style={{ fontSize: 13, color: '#587487' }}>
            No hay movimientos de caja registrados todavia para esta sucursal.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Fecha', 'Concepto', 'Referencia', 'Tipo', 'Monto'].map((header) => (
                  <th key={header} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid #DCEFEB', paddingRight: 12 }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cash.movimientos.map((movement) => (
                <tr key={movement.id}>
                  <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid #EEF6F4', color: '#587487' }}>{formatDateTime(movement.createdAt)}</td>
                  <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid #EEF6F4', color: '#063052', fontWeight: 500 }}>{movement.concept}</td>
                  <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid #EEF6F4', color: '#52525B', fontFamily: 'monospace', fontSize: 12 }}>{movement.reference}</td>
                  <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid #EEF6F4' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: movement.type === 'egreso' ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', color: movement.type === 'egreso' ? '#F87171' : '#34D399' }}>
                      {movement.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0', borderBottom: '1px solid #EEF6F4', fontWeight: 800, color: movement.type === 'egreso' ? '#F87171' : '#059669', fontSize: 14 }}>
                    {movement.type === 'egreso' ? '-' : '+'}
                    {formatCurrency(movement.amount)}
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

function StatCard({ label, value, tone, detail }: { label: string; value: string; tone: string; detail: string }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: tone }}>{value}</div>
      <div style={{ fontSize: 11, color: '#52525B', marginTop: 4 }}>{detail}</div>
    </div>
  )
}
