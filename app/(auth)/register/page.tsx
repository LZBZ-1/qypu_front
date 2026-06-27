'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type RegisterState = {
  name: string
  lastName: string
  phone: string
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<RegisterState>({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof RegisterState>(key: K, value: RegisterState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function handleRegister() {
    if (!form.name || !form.lastName || !form.phone || !form.email || !form.password) {
      setError('Completa todos los campos.')
      return
    }

    if (form.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await response.json()

      if (!response.ok) {
        setError(payload.error ?? 'No se pudo crear la cuenta.')
        return
      }

      router.replace(payload.nextStep ?? '/onboarding/organization')
      router.refresh()
    } catch {
      setError('No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={shellStyle}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <div style={{ display: 'grid', gap: 28 }}>
          <Brand
            title="Crea tu cuenta"
            subtitle="Primero tu acceso, luego onboarding de organizacion y al final la conexion con Telegram."
          />

          <div style={cardStyle}>
            {error ? <Alert>{error}</Alert> : null}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Nombre">
                <input
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Juan"
                  style={inputStyle}
                />
              </Field>

              <Field label="Apellido">
                <input
                  value={form.lastName}
                  onChange={(event) => update('lastName', event.target.value)}
                  placeholder="Perez"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Telefono">
                <input
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder="+51 999 999 999"
                  style={inputStyle}
                />
              </Field>

              <Field label="Correo">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="tu@correo.com"
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Contrasena">
              <input
                type="password"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                placeholder="Minimo 6 caracteres"
                style={inputStyle}
              />
            </Field>

            <div style={infoCardStyle}>
              Apenas crees tu cuenta, te llevamos directo al onboarding de tu organizacion y al codigo para enlazar Telegram.
            </div>

            <button onClick={handleRegister} disabled={loading} style={primaryButtonStyle(loading)}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p style={footerTextStyle}>
              Ya tienes cuenta?{' '}
              <Link href="/login" style={linkStyle}>
                Inicia sesion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Brand({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={logoStyle}>Q</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#F4F4F5' }}>{title}</h1>
      <p style={{ fontSize: 13, color: '#A1A1AA', marginTop: 8, textAlign: 'center', lineHeight: 1.6, maxWidth: 420 }}>{subtitle}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: '#D4D4D8', fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  )
}

function Alert({ children }: { children: React.ReactNode }) {
  return <div style={alertStyle}>{children}</div>
}

const shellStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  background:
    'radial-gradient(circle at top left, rgba(245,158,11,0.16), transparent 34%), linear-gradient(180deg, #14110D 0%, #080808 100%)',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(24,24,27,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 22,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  boxShadow: '0 26px 90px rgba(0,0,0,0.38)',
}

const logoStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 18,
  background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: 24,
  color: '#1C1204',
  marginBottom: 16,
}

const inputStyle: React.CSSProperties = {
  background: '#09090B',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#F4F4F5',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}

const infoCardStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: 12,
  background: 'rgba(251,191,36,0.08)',
  border: '1px solid rgba(251,191,36,0.22)',
  color: '#FCD34D',
  fontSize: 12.5,
  lineHeight: 1.6,
}

const alertStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(248,113,113,0.08)',
  border: '1px solid rgba(248,113,113,0.22)',
  fontSize: 12,
  color: '#FCA5A5',
}

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#71717A',
  textAlign: 'center',
  marginTop: 2,
}

const linkStyle: React.CSSProperties = {
  color: '#FDBA74',
  fontWeight: 700,
  textDecoration: 'none',
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '12px 16px',
    borderRadius: 10,
    background: disabled ? '#C2410C' : '#EA580C',
    border: 'none',
    color: '#FFF7ED',
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
  }
}
