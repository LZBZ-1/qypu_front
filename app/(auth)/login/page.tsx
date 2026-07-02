'use client'

import Image from 'next/image'
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
      <Image src="/images/logo.png" alt="Qypu" width={156} height={60} priority style={logoImageStyle} />
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#062342' }}>{title}</h1>
      <p style={{ fontSize: 13, color: '#45677B', marginTop: 8, textAlign: 'center', lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: '#34566C', fontWeight: 700 }}>{label}</label>
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
  background: 'linear-gradient(180deg, #FFFFFF 0%, #EEFaf7 100%)',
}

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #DCEFEB',
  borderRadius: 14,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  boxShadow: '0 18px 44px rgba(6,35,66,0.10)',
}

const logoImageStyle: React.CSSProperties = {
  width: 156,
  height: 'auto',
  marginBottom: 16,
}

const inputStyle: React.CSSProperties = {
  background: '#F7FBFA',
  border: '1px solid #B9DDD6',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#061D33',
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
  color: '#B42318',
}

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#45677B',
  textAlign: 'center',
  marginTop: 2,
}

const linkStyle: React.CSSProperties = {
  color: '#008772',
  fontWeight: 700,
  textDecoration: 'none',
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '12px 16px',
    borderRadius: 10,
    background: disabled ? '#7CBFB0' : '#00A884',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
  }
}
