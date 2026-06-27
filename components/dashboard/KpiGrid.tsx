interface KpiItem {
  icon: string
  label: string
  value: string
  delta: string
  deltaType: 'up' | 'down' | 'warn'
}

const deltaColor = {
  up: '#10B981',
  down: '#F43F5E',
  warn: '#F59E0B',
}

export default function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: '#18181B',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span
            style={{
              fontSize: 11,
              color: '#52525B',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '.05em',
            }}
          >
            {item.label}
          </span>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>{item.value}</span>
          <span style={{ fontSize: 11, color: deltaColor[item.deltaType] }}>{item.delta}</span>
        </div>
      ))}
    </div>
  )
}
