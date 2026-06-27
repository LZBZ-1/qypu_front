import Sidebar from '@/components/sidebar/Sidebar'
import TelegramConnect from '@/components/insights/TelegramConnect'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gridTemplateRows: '52px 1fr', minHeight: '100vh', background: '#0F0F11', color: '#F4F4F5' }}>

      {/* TOPBAR */}
      <header style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '14px', background: '#0A0A0D', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
          Q
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>Qypu</span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <TelegramConnect />
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#3F3F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#D4D4D8' }}>
            JP
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO DE CADA PÁGINA */}
      <main style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </main>

    </div>
  )
}