'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: 'D' },
  { href: '/ventas', label: 'Ventas', icon: 'V' },
  { href: '/compras', label: 'Compras', icon: 'C' },
  { href: '/inventario', label: 'Inventario', icon: 'I' },
  { href: '/caja', label: 'Caja', icon: 'J' },
  { href: '/reportes', label: 'Reportes', icon: 'R' },
]

const NAV_CONFIG = [
  { href: '/configuracion', label: 'Mi negocio', icon: 'M' },
  { href: '/canales', label: 'Canales', icon: 'T' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{ background: '#0A0A0D', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto' }}>
      <SectionLabel>Principal</SectionLabel>
      {NAV.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href} />)}

      <SectionLabel style={{ marginTop: 8 }}>Configuracion</SectionLabel>
      {NAV_CONFIG.map((item) => <NavItem key={item.href} {...item} active={pathname === item.href} />)}

      <div style={{ flex: 1 }} />
    </aside>
  )
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 9.5, fontWeight: 600, color: '#52525B', textTransform: 'uppercase', letterSpacing: '.08em', padding: '10px 8px 6px', ...style }}>
      {children}
    </div>
  )
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, fontSize: 13, color: active ? '#C4B5FD' : '#A1A1AA', background: active ? 'rgba(124,58,237,0.12)' : 'transparent', fontWeight: active ? 500 : 400, textDecoration: 'none', transition: 'all .15s' }}
      onMouseOver={(event) => {
        if (!active) {
          event.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          event.currentTarget.style.color = '#F4F4F5'
        }
      }}
      onMouseOut={(event) => {
        if (!active) {
          event.currentTarget.style.background = 'transparent'
          event.currentTarget.style.color = '#A1A1AA'
        }
      }}
    >
      <span style={{ fontSize: 12, width: 20, textAlign: 'center', flexShrink: 0, fontWeight: 700 }}>{icon}</span>
      {label}
    </Link>
  )
}
