'use client'

import { useState } from 'react'
import Link from 'next/link'

const TIPOS = ['Bodega', 'Tienda', 'Restaurante', 'Farmacia', 'Otro']

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    negocio: '',
    tipo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
  }

  function handleStep1() {
    if (!form.nombre || !form.email || !form.password) {
      setError('Completa todos los campos')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setStep(2)
  }

  async function handleRegister() {
    if (!form.negocio || !form.tipo) {
      setError('Completa el nombre y tipo de tu negocio')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Aquí irá:
      // const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password })
      // await supabase.from('negocios').insert({ user_id: data.user.id, nombre: form.negocio, tipo: form.tipo })
      await new Promise(r => setTimeout(r, 1400)) // simulación
      window.location.href = '/dashboard'
    } catch {
      setError('Hubo un problema. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F11', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#fff', marginBottom: 14 }}>
            Q
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#F4F4F5' }}>
            {step === 1 ? 'Crea tu cuenta' : 'Cuéntanos de tu negocio'}
          </h1>
          <p style={{ fontSize: 13, color: '#52525B', marginTop: 6, textAlign: 'center' }}>
            {step === 1 ? 'Gratis para siempre en el plan básico' : 'Último paso — promesa 🤙'}
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? '#7C3AED' : 'rgba(255,255,255,0.08)', transition: 'background .3s' }} />
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Error */}
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', fontSize: 12, color: '#F87171' }}>
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Field label="Tu nombre">
                <input value={form.nombre} onChange={e => update('nombre', e.target.value)} placeholder="Juan Pérez" style={inputStyle} />
              </Field>
              <Field label="Correo electrónico">
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="tu@correo.com" style={inputStyle} />
              </Field>
              <Field label="Contraseña">
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Mínimo 6 caracteres" style={inputStyle} />
              </Field>
              <button onClick={handleStep1}
                style={{ padding: '11px 16px', borderRadius: 10, background: '#7C3AED', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
                Continuar →
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Field label="Nombre de tu negocio">
                <input value={form.negocio} onChange={e => update('negocio', e.target.value)} placeholder="Ej: Bodega La Esperanza" style={inputStyle} />
              </Field>

              <Field label="Tipo de negocio">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 2 }}>
                  {TIPOS.map(t => (
                    <button key={t} onClick={() => update('tipo', t.toLowerCase())}
                      style={{ padding: '9px 8px', borderRadius: 8, border: `1px solid ${form.tipo === t.toLowerCase() ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.1)'}`, background: form.tipo === t.toLowerCase() ? 'rgba(124,58,237,0.15)' : 'transparent', color: form.tipo === t.toLowerCase() ? '#C4B5FD' : '#A1A1AA', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Tip Telegram */}
              <div style={{ padding: '12px 14px', background: 'rgba(34,158,217,0.07)', border: '1px solid rgba(34,158,217,0.15)', borderRadius: 10, fontSize: 12, color: '#60C8F5', lineHeight: 1.6 }}>
                ✈️ Después de registrarte podrás conectar <strong>Telegram</strong> para gestionar tu negocio desde tu celular conversando con el bot.
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#A1A1AA', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  ← Atrás
                </button>
                <button onClick={handleRegister} disabled={loading}
                  style={{ flex: 2, padding: '11px 16px', borderRadius: 10, background: loading ? '#5B21B6' : '#7C3AED', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'default' : 'pointer', transition: 'background .2s' }}>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta gratis 🚀'}
                </button>
              </div>
            </>
          )}

          {/* Login link */}
          {step === 1 && (
            <p style={{ fontSize: 12, color: '#52525B', textAlign: 'center', marginTop: 4 }}>
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>
                Inicia sesión
              </Link>
            </p>
          )}

        </div>

        <p style={{ fontSize: 11, color: '#3F3F46', textAlign: 'center', marginTop: 20 }}>
          Hecho en Perú 🇵🇪 para los que trabajan duro
        </p>

      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#0A0A0D',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 13,
  color: '#F4F4F5',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}