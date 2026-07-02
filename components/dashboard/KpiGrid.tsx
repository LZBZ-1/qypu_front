import type { ComponentProps } from 'react'

import AppIcon from '@/components/ui/AppIcon'

interface KpiItem {
  icon: ComponentProps<typeof AppIcon>['name']
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
            background: '#FFFFFF',
            border: '1px solid #DCEFEB',
            borderRadius: 12,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ width: 34, height: 34, borderRadius: 10, background: '#EAF8F4', color: '#008772', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppIcon name={item.icon} size={18} />
          </span>
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
