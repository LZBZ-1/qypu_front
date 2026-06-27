'use client'

import { useState, useEffect } from 'react'

export default function TelegramConnect() {
  const [open, setOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'connect' | 'success'>('connect')

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-telegram-modal', handler)
    return () => document.removeEventListener('open-telegram-modal', handler)
  }, [])

  function verify() {
    if (token.length !== 6) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setConnected(true)
      setStep('success')
    }, 1200)
  }

  return (
    <>
      {/* Botón topbar */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.12)'}`,
          background: 'rgba(255,255,255,0.04)', color: '#F4F4F5', cursor: 'pointer',
        }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#10B981' : '#52525B', display: 'inline-block' }} />
        {connected ? 'Telegram conectado' : 'Conectar Telegram'}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>

          <div style={{ background: '#1C1C21', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, width: 440, maxWidth: 'calc(100vw - 32px)', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 17, fontWeight: 800 }}>
                {step === 'success' ? 'Telegram conectado' : '✈️ Conectar con Telegram'}
              </span>
              <button onClick={() => setOpen(false)}
                style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#A1A1AA', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>

            {/* Estado: conectar */}
            {step === 'connect' && (
              <>
                <p style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.6 }}>
                  Vincula tu Telegram para gestionar tu negocio conversando con el bot. Registra ventas, compras y consulta tu stock sin abrir el dashboard.
                </p>

                {/* Paso 1 */}
                <Step num={1} title="Abre el bot de Qypu en Telegram" desc='Toca el botón y luego presiona Iniciar o escribe /start'>
                  <a href="https://t.me/QypuBot" target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#229ED9', borderRadius: 10, padding: '12px 16px', marginTop: 8, textDecoration: 'none', cursor: 'pointer' }}>
                    <span style={{ fontSize: 22 }}>✈️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>@QypuBot</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>Toca para abrir en Telegram</div>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>→</span>
                  </a>
                </Step>

                {/* Paso 2 */}
                <Step num={2} title="Pide tu código al bot" desc="En el chat de Telegram escribe el comando:">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 14px', marginTop: 8, fontFamily: 'monospace', fontSize: 13, color: '#A78BFA' }}>
                    /vincular
                    <button
                      onClick={() => navigator.clipboard.writeText('/vincular')}
                      style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#A1A1AA', cursor: 'pointer' }}>
                      Copiar
                    </button>
                  </div>
                  <p style={{ fontSize: 11.5, color: '#52525B', marginTop: 6 }}>El bot te responderá con un código de 6 dígitos.</p>
                </Step>

                {/* Paso 3 */}
                <Step num={3} title="Ingresa el código aquí" desc="Pega el código que te dio el bot para vincular tu cuenta.">
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Ej: 847291"
                      style={{ flex: 1, background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#F4F4F5', fontFamily: 'inherit', outline: 'none' }}
                    />
                    <button
                      onClick={verify}
                      disabled={token.length !== 6 || loading}
                      style={{ padding: '9px 16px', borderRadius: 8, background: token.length === 6 ? '#7C3AED' : '#3F3F46', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: token.length === 6 ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'background .2s' }}>
                      {loading ? 'Verificando...' : 'Vincular'}
                    </button>
                  </div>
                </Step>
              </>
            )}

            {/* Estado: éxito */}
            {step === 'success' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                  ✅
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>¡Todo listo!</h3>
                <p style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.55 }}>
                  Tu Telegram está vinculado a <strong style={{ color: '#F4F4F5' }}>Bodega La Esperanza</strong>.<br />
                  Gestiona tu negocio escribiendo a <strong style={{ color: '#F4F4F5' }}>@QypuBot</strong>.
                </p>
                <div style={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', width: '100%', textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: '#52525B', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Prueba enviar al bot:</div>
                  <div style={{ fontSize: 13, color: '#A1A1AA', lineHeight: 1.8 }}>
                    💬 <em>"Vendí 3 gaseosas y 2 leches"</em><br />
                    💬 <em>"¿Cuánto vendí hoy?"</em><br />
                    💬 <em>"Compré 10 chocolates por 20 soles"</em>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{ padding: '10px 28px', borderRadius: 10, background: '#10B981', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                  Entendido, vamos 🚀
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}

function Step({ num, title, desc, children }: { num: number; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#A78BFA', flexShrink: 0 }}>
        {num}
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#A1A1AA', lineHeight: 1.55 }}>{desc}</div>
        {children}
      </div>
    </div>
  )
}