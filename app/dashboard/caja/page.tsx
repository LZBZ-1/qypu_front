const MOVIMIENTOS = [
  { id: 1, hora: '10:32', concepto: 'Venta chat',        tipo: 'ingreso', monto: 17.60,  ref: 'V-001' },
  { id: 2, hora: '09:15', concepto: 'Venta chat',        tipo: 'ingreso', monto: 32.00,  ref: 'V-002' },
  { id: 3, hora: '08:14', concepto: 'Compra leche',      tipo: 'egreso',  monto: 380.00, ref: 'C-001' },
  { id: 4, hora: '08:02', concepto: 'Venta apertura',    tipo: 'ingreso', monto: 48.90,  ref: 'V-003' },
  { id: 5, hora: '07:30', concepto: 'Venta madrugada',   tipo: 'ingreso', monto: 12.00,  ref: 'V-004' },
]

const ingresos = MOVIMIENTOS.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0)
const egresos  = MOVIMIENTOS.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0)
const balance  = ingresos - egresos

export default function CajaPage() {
  return (
    <>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Caja</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Movimientos del día</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Ingresos</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#34D399' }}>S/ {ingresos.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 4 }}>{MOVIMIENTOS.filter(m => m.tipo === 'ingreso').length} ventas</div>
        </div>
        <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Egresos</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#F87171' }}>S/ {egresos.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 4 }}>{MOVIMIENTOS.filter(m => m.tipo === 'egreso').length} compras</div>
        </div>
        <div style={{ background: '#18181B', border: `1px solid ${balance >= 0 ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`, borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Balance neto</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: balance >= 0 ? '#34D399' : '#F87171' }}>
            {balance >= 0 ? '' : '−'}S/ {Math.abs(balance).toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: balance >= 0 ? '#10B981' : '#F43F5E', marginTop: 4 }}>
            {balance >= 0 ? '↑ Positivo hoy' : '↓ Negativo hoy'}
          </div>
        </div>
      </div>

      {/* Movimientos */}
      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Todos los movimientos</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Hora', 'Concepto', 'Referencia', 'Tipo', 'Monto'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10.5, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingRight: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOVIMIENTOS.map(m => (
              <tr key={m.id}>
                <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#A1A1AA' }}>{m.hora}</td>
                <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#F4F4F5', fontWeight: 500 }}>{m.concepto}</td>
                <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#52525B', fontFamily: 'monospace', fontSize: 12 }}>{m.ref}</td>
                <td style={{ padding: '12px 12px 12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: m.tipo === 'ingreso' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', color: m.tipo === 'ingreso' ? '#34D399' : '#F87171' }}>
                    {m.tipo === 'ingreso' ? '↑ Ingreso' : '↓ Egreso'}
                  </span>
                </td>
                <td style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 800, color: m.tipo === 'ingreso' ? '#34D399' : '#F87171', fontSize: 14 }}>
                  {m.tipo === 'ingreso' ? '+' : '−'}S/ {m.monto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}