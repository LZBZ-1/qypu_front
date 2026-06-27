interface KpiItem {
  icon: string
  label: string
  value: string
  delta: string
  deltaType: 'up' | 'down' | 'warn'
}

const KPIS: KpiItem[] = [
  { icon: '💰', label: 'Ventas del día',      value: 'S/ 468.50', delta: '↑ 22% vs ayer',    deltaType: 'up' },
  { icon: '🛒', label: 'Compras del día',     value: 'S/ 380.00', delta: '↓ 5% vs ayer',     deltaType: 'down' },
  { icon: '🏦', label: 'Balance caja',        value: 'S/ 88.50',  delta: '↑ Positivo hoy',   deltaType: 'up' },
  { icon: '📦', label: 'Productos en stock',  value: '24',         delta: '⚠ 3 stock bajo',  deltaType: 'warn' },
]

const DELTA_COLOR = { up: '#10B981', down: '#F43F5E', warn: '#F59E0B' }

export default function KpiGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {KPIS.map((k) => (
        <div key={k.label}
          style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 18 }}>{k.icon}</span>
          <span style={{ fontSize: 11, color: '#52525B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k.label}</span>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>{k.value}</span>
          <span style={{ fontSize: 11, color: DELTA_COLOR[k.deltaType] }}>{k.delta}</span>
        </div>
      ))}
    </div>
  )
}