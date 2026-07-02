'use client'

import { useEffect, useState } from 'react'

type ChannelResponse = {
  organization: { name: string } | null
  botUsername: string | null
  botLink: string | null
  telegramChannel: {
    name: string
    status: string
    linking_code: string | null
    telegram_username: string | null
    connected_at: string | null
  } | null
  error?: string
}

export default function TelegramConnect() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ChannelResponse | null>(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-telegram-modal', handler)
    return () => document.removeEventListener('open-telegram-modal', handler)
  }, [])

  useEffect(() => {
    async function loadStatus() {
      setLoading(true)
      try {
        const response = await fetch('/api/channels')
        const payload = await response.json()
        setData(payload)
      } finally {
        setLoading(false)
      }
    }

    loadStatus()
  }, [])

  const connected = Boolean(data?.telegramChannel?.telegram_username || data?.telegramChannel?.connected_at)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 500,
          border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : '#CFE9E3'}`,
          background: '#FFFFFF',
          color: '#063052',
          cursor: 'pointer',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#10B981' : '#52525B', display: 'inline-block' }} />
        {connected ? 'Telegram conectado' : 'Conectar Telegram'}
      </button>

      {open && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(6,35,66,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
        >
          <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 16, width: 440, maxWidth: 'calc(100vw - 32px)', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 17, fontWeight: 800 }}>Telegram real</span>
              <button
                onClick={() => setOpen(false)}
                style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #CFE9E3', background: '#FFFFFF', color: '#587487', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                x
              </button>
            </div>

            {loading ? (
              <div style={{ fontSize: 13, color: '#587487' }}>Cargando canal...</div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: '#587487', lineHeight: 1.6 }}>
                  Revisa el estado de Telegram y usa el enlace para completar la vinculacion.
                </p>

                <Step title="Organizacion" value={data?.organization?.name ?? 'Sin organizacion'} />
                <Step title="Canal" value={data?.telegramChannel?.name ?? 'No configurado'} />
                <Step title="Estado" value={data?.telegramChannel?.status ?? 'Sin estado'} />
                <Step title="Codigo de vinculacion" value={data?.telegramChannel?.linking_code ?? 'Sin codigo activo'} />
                <Step title="Usuario vinculado" value={data?.telegramChannel?.telegram_username ?? 'Sin usuario vinculado'} />

                {data?.botLink ? (
                  <a
                    href={data.botLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '11px 14px', borderRadius: 10, background: '#229ED9', color: '#F8FAFC', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}
                  >
                    Abrir @{data.botUsername ?? 'bot'} en Telegram
                  </a>
                ) : null}

                <div style={{ padding: '12px 14px', background: 'rgba(34,158,217,0.06)', border: '1px solid rgba(34,158,217,0.15)', borderRadius: 10, fontSize: 12, color: '#0E7490', lineHeight: 1.6 }}>
                  El boton abre el chat de Telegram con el codigo preparado para acelerar la vinculacion.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function Step({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#71717A', fontWeight: 600 }}>{title}</div>
      <div style={{ background: '#F7FBFA', border: '1px solid #CFE9E3', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#063052' }}>
        {value}
      </div>
    </div>
  )
}
