'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LoginState = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState<LoginState>({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof LoginState>(key: K, value: LoginState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError('Ingresa tu correo y contrasena.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await response.json()

      if (!response.ok) {
        setError(payload.error ?? 'No se pudo iniciar sesion.')
        return
      }

      router.replace(payload.nextStep ?? '/dashboard')
      router.refresh()
    } catch {
      setError('No se pudo iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={shellStyle}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Brand
          title="Bienvenido a Qypu"
          subtitle="Entra a tu cuenta y sigue el flujo de onboarding de tu negocio."
        />

        <div style={cardStyle}>
          {error ? <Alert>{error}</Alert> : null}

          <Field label="Correo">
            <input
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
              placeholder="tu@correo.com"
              style={inputStyle}
            />
          </Field>

          <Field label="Contrasena">
            <input
              type="password"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
              placeholder="Minimo 6 caracteres"
              style={inputStyle}
            />
          </Field>

          <button onClick={handleLogin} disabled={loading} style={primaryButtonStyle(loading)}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p style={footerTextStyle}>
            Aun no tienes cuenta?{' '}
            <Link href="/register" style={linkStyle}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Brand({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
      <div style={logoStyle}>Q</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: '#F4F4F5' }}>{title}</h1>
      <p style={{ fontSize: 13, color: '#71717A', marginTop: 8, textAlign: 'center', lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: '#A1A1AA', fontWeight: 600 }}>{label}</label>
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
    'radial-gradient(circle at top, rgba(34,197,94,0.18), transparent 28%), linear-gradient(180deg, #101316 0%, #090A0D 100%)',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(17,24,39,0.88)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
}

const logoStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 16,
  background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: 22,
  color: '#04130A',
  marginBottom: 14,
}

const inputStyle: React.CSSProperties = {
  background: '#06080B',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#F4F4F5',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
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
  color: '#86EFAC',
  fontWeight: 700,
  textDecoration: 'none',
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '12px 16px',
    borderRadius: 10,
    background: disabled ? '#166534' : '#16A34A',
    border: 'none',
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
  }
}
