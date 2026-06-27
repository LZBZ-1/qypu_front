import { redirect } from 'next/navigation'

import { getAccessState } from '@/lib/access'
import TopbarSessionActions from '@/components/dashboard/TopbarSessionActions'
import Sidebar from '@/components/sidebar/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const access = await getAccessState()

  if (!access.authUser) {
    redirect('/login')
  }

  if (!access.membership || !access.organization || !access.branch) {
    redirect('/onboarding/organization')
  }

  const initials = `${access.profile?.name?.[0] ?? 'Q'}${access.profile?.last_name?.[0] ?? 'Y'}`.toUpperCase()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gridTemplateRows: '52px 1fr', minHeight: '100vh', background: '#0F0F11', color: '#F4F4F5' }}>
      <header style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '14px', background: '#0A0A0D', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
          Q
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>Qypu</span>

        <div style={{ marginLeft: 'auto' }}>
          <TopbarSessionActions initials={initials} />
        </div>
      </header>

      <Sidebar />

      <main style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </main>
    </div>
  )
}
