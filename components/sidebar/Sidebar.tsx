'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',     label: 'Dashboard',  icon: '📊' },
  { href: '/ventas',        label: 'Ventas',     icon: '💰' },
  { href: '/compras',       label: 'Compras',    icon: '🛒' },
  { href: '/inventario',    label: 'Inventario', icon: '📦' },
  { href: '/caja',          label: 'Caja',       icon: '🏦' },
  { href: '/reportes',      label: 'Reportes',   icon: '📈' },
]

const NAV_CONFIG = [
  { href: '/configuracion', label: 'Mi negocio', icon: '⚙️' },
  { href: '/cuenta',        label: 'Cuenta',     icon: '👤' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{ background: '#0A0A0D', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto' }}>

      <SectionLabel>Principal</SectionLabel>
      {NAV.map(item => <NavItem key={item.href} {...item} active={pathname === item.href} />)}

      <SectionLabel style={{ marginTop: 8 }}>Configuración</SectionLabel>
      {NAV_CONFIG.map(item => <NavItem key={item.href} {...item} active={pathname === item.href} />)}

      <div style={{ flex: 1 }} />

      {/* Botón Telegram */}
      <Link href="#" onClick={(e) => { e.preventDefault(); document.dispatchEvent(new CustomEvent('open-telegram-modal')) }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 9, fontSize: 12, fontWeight: 600, color: '#fff', background: '#229ED9', textDecoration: 'none', transition: 'opacity .15s' }}
        onMouseOver={e => (e.currentTarget.style.opacity = '.85')}
        onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
        <span style={{ fontSize: 18 }}>✈️</span>
        <div>
          <div>Conectar Telegram</div>
          <div style={{ fontSize: 10, fontWeight: 400, opacity: .8, marginTop: 1 }}>Gestiona desde el chat</div>
        </div>
      </Link>

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
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, fontSize: 13, color: active ? '#C4B5FD' : '#A1A1AA', background: active ? 'rgba(124,58,237,0.12)' : 'transparent', fontWeight: active ? 500 : 400, textDecoration: 'none', transition: 'all .15s' }}
      onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F4F4F5' }}}
      onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A1A1AA' }}}>
      <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      {label}
    </Link>
  )
}