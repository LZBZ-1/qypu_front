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
    <aside className="border-b border-[#dcefeb] bg-white px-4 py-3 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:border-b-0 lg:border-r lg:px-3 lg:py-4">
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        <SectionLabel>Principal</SectionLabel>
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}

        <SectionLabel className="lg:mt-3">Configuracion</SectionLabel>
        {NAV_CONFIG.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
      </nav>
    </aside>
  )
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`hidden px-2 pb-1 pt-3 text-[10px] font-black uppercase tracking-[0.08em] text-[#6b8796] lg:block ${className}`}>
      {children}
    </div>
  )
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-bold transition lg:rounded-lg lg:px-3 ${
        active
          ? 'bg-[#e0f7f1] text-[#008772]'
          : 'bg-[#f7fbfa] text-[#34566c] hover:bg-[#eefaf7] hover:text-[#063052]'
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm">{icon}</span>
      {label}
    </Link>
  )
}
