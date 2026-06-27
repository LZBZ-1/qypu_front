const MOVIMIENTOS = [
  { hora: '10:32', concepto: 'Venta chat',      tipo: 'ingreso', monto: 17.60 },
  { hora: '09:15', concepto: 'Venta chat',      tipo: 'ingreso', monto: 32.00 },
  { hora: '08:14', concepto: 'Compra leche',    tipo: 'egreso',  monto: 380.00 },
  { hora: '08:02', concepto: 'Venta apertura',  tipo: 'ingreso', monto: 48.90 },
]

export default function CajaBalance() {
  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Caja del día</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>Movimientos de hoy</div>
        </div>
        <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 500, background: 'rgba(16,185,129,0.12)', color: '#34D399' }}>
          + S/ 88.50
        </span>
      </div>

      {/* Ingresos / Egresos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A1A1AA' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>💚</div>
            Ingresos (ventas)
          </div>
          <span style={{ color: '#34D399', fontWeight: 700 }}>+ S/ 468.50</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A1A1AA' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🔴</div>
            Egresos (compras)
          </div>
          <span style={{ color: '#F87171', fontWeight: 700 }}>− S/ 380.00</span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0 14px' }} />

      {/* Totales */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#52525B' }}>Balance neto del día</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#34D399', marginTop: 4 }}>S/ 88.50</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#52525B' }}>Esta semana</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#A78BFA', marginTop: 4 }}>S/ 1,240.80</div>
        </div>
      </div>

      {/* Últimos movimientos */}
      <div>
        <div style={{ fontSize: 11, color: '#52525B', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Últimos movimientos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOVIMIENTOS.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#A1A1AA' }}>{m.hora} · {m.concepto}</span>
              <span style={{ color: m.tipo === 'ingreso' ? '#34D399' : '#F87171', fontWeight: 600 }}>
                {m.tipo === 'ingreso' ? '+' : '−'}S/ {m.monto.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}