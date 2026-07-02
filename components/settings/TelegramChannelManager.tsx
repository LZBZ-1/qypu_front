'use client'

import { useCallback, useState } from 'react'

type TelegramResponse = {
  organization: {
    name: string
  } | null
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

export default function TelegramChannelManager({
  initialData,
}: {
  initialData: TelegramResponse
}) {
  const [data, setData] = useState<TelegramResponse>(initialData)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const isConnected = Boolean(data.telegramChannel?.telegram_username || data.telegramChannel?.connected_at)

  const loadChannel = useCallback(async () => {
    setRefreshing(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding/telegram')
      const payload = (await response.json()) as TelegramResponse

      if (!response.ok) {
        setError(payload.error ?? 'No se pudo recargar el canal.')
        return
      }

      setData(payload)
    } catch {
      setError('No se pudo recargar el canal.')
    } finally {
      setRefreshing(false)
    }
  }, [])

  async function regenerateCode() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding/telegram', { method: 'POST' })
      const payload = (await response.json()) as TelegramResponse

      if (!response.ok) {
        setError(payload.error ?? 'No se pudo regenerar el codigo.')
        return
      }

      setData((current) => ({
        organization: current.organization,
        botUsername: payload.botUsername ?? current.botUsername,
        botLink: payload.botLink ?? current.botLink,
        telegramChannel: payload.telegramChannel,
      }))
    } catch {
      setError('No se pudo regenerar el codigo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {error ? (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)', color: '#FCA5A5', fontSize: 12 }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Canal">{data.telegramChannel?.name ?? 'No configurado'}</Field>
        <Field label="Estado">
          <span style={{ color: isConnected ? '#059669' : '#B45309' }}>
            {isConnected ? 'Conectado' : data.telegramChannel?.status === 'pending' ? 'Pendiente' : data.telegramChannel?.status ?? 'Pendiente'}
          </span>
        </Field>
        <Field label="Codigo de enlace">{data.telegramChannel?.linking_code ?? 'Sin codigo activo'}</Field>
        <Field label="Usuario">{data.telegramChannel?.telegram_username ?? 'Sin usuario vinculado'}</Field>
      </div>

      <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(34,158,217,0.07)', border: '1px solid rgba(34,158,217,0.16)', color: '#0E7490', fontSize: 12.5, lineHeight: 1.7 }}>
        Usa el bot para enlazar Telegram con este negocio. Cuando la vinculacion termine, este panel mostrara el canal como conectado.
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {data.botLink ? (
          <a
            href={data.botLink}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '11px 14px', borderRadius: 10, background: '#229ED9', color: '#F8FAFC', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}
          >
            Abrir @{data.botUsername ?? 'bot'} en Telegram
          </a>
        ) : null}

        <button
          onClick={regenerateCode}
          disabled={loading}
          style={{ padding: '11px 14px', borderRadius: 10, border: 'none', background: loading ? '#155E75' : '#0E7490', color: '#ECFEFF', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer' }}
        >
          {loading ? 'Generando...' : 'Regenerar codigo'}
        </button>

        <button
          onClick={() => void loadChannel()}
          disabled={refreshing}
          style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #CFE9E3', background: '#FFFFFF', color: '#063052', fontSize: 13, fontWeight: 700, cursor: refreshing ? 'default' : 'pointer' }}
        >
          {refreshing ? 'Refrescando...' : 'Refrescar estado'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11.5, color: '#71717A', fontWeight: 500 }}>{label}</label>
      <div style={{ background: '#F7FBFA', border: '1px solid #CFE9E3', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#063052' }}>
        {children}
      </div>
    </div>
  )
}
