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
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="min-h-10 rounded-full border border-[#b9ddd6] bg-white px-3 text-xs font-bold text-[#063052] shadow-sm disabled:cursor-default disabled:opacity-70 sm:px-4"
      >
        {loading ? 'Saliendo...' : 'Salir'}
      </button>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f7f1] text-xs font-black text-[#008772]">
        {initials}
      </div>
    </div>
  )
}
