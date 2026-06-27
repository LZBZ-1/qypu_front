'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TopbarSessionActions({ initials }: { initials: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#D4D4D8', fontSize: 12, fontWeight: 700, cursor: loading ? 'default' : 'pointer' }}
      >
        {loading ? 'Saliendo...' : 'Cerrar sesion'}
      </button>

      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#3F3F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#D4D4D8' }}>
        {initials}
      </div>
    </div>
  )
}
