import { formatCurrency, formatDateTime } from '@/lib/formatters'

type CashMovement = {
  id: string
  createdAt: string
  type: string
  amount: number
  concept: string
  reference: string
}

export default function CajaBalance({
  ingresos,
  egresos,
  balance,
  weekBalance,
  movimientos,
}: {
  ingresos: number
  egresos: number
  balance: number
  weekBalance: number
  movimientos: CashMovement[]
}) {
  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Caja del dia</div>
          <div style={{ fontSize: 11, color: '#52525B', marginTop: 2 }}>Movimientos reales de Supabase</div>
        </div>
        <span
          style={{
            padding: '3px 8px',
            borderRadius: 20,
            fontSize: 10.5,
            fontWeight: 500,
            background: balance >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            color: balance >= 0 ? '#34D399' : '#F87171',
          }}
        >
          {balance >= 0 ? '+' : '-'} {formatCurrency(Math.abs(balance))}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A1A1AA' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>I</div>
            Ingresos
          </div>
          <span style={{ color: '#34D399', fontWeight: 700 }}>{formatCurrency(ingresos)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A1A1AA' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>E</div>
            Egresos
          </div>
          <span style={{ color: '#F87171', fontWeight: 700 }}>{formatCurrency(egresos)}</span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0 14px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#52525B' }}>Balance neto del dia</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: balance >= 0 ? '#34D399' : '#F87171', marginTop: 4 }}>
            {formatCurrency(balance)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#52525B' }}>Ultimos 7 dias</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#A78BFA', marginTop: 4 }}>{formatCurrency(weekBalance)}</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: '#52525B', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Ultimos movimientos
        </div>
        {movimientos.length === 0 ? (
          <div style={{ fontSize: 12, color: '#71717A' }}>Todavia no hay movimientos financieros registrados para esta sucursal.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {movimientos.slice(0, 4).map((movement) => (
              <div key={movement.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 12 }}>
                <span style={{ color: '#A1A1AA' }}>
                  {formatDateTime(movement.createdAt)} · {movement.concept} · {movement.reference}
                </span>
                <span style={{ color: movement.type === 'egreso' ? '#F87171' : '#34D399', fontWeight: 600 }}>
                  {movement.type === 'egreso' ? '-' : '+'}
                  {formatCurrency(movement.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
