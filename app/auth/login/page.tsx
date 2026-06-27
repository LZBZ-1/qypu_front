'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    setError('')
    try {
      // Aquí irá: await supabase.auth.signInWithPassword({ email, password })
      await new Promise(r => setTimeout(r, 1200)) // simulación
      window.location.href = '/dashboard'
    } catch {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    // Aquí irá: await supabase.auth.signInWithOAuth({ provider: 'google' })
    alert('Login con Google — conecta Supabase para activarlo')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F11', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#fff', marginBottom: 14 }}>
            Q
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#F4F4F5' }}>Bienvenido a Qypu</h1>
          <p style={{ fontSize: 13, color: '#52525B', marginTop: 6, textAlign: 'center' }}>
            Ingresa a tu cuenta para gestionar tu negocio
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Google */}
          <button onClick={handleGoogle}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#F4F4F5', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background .15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.2l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.5 36.2 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 11, color: '#52525B' }}>o con tu correo</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', fontSize: 12, color: '#F87171' }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="tu@correo.com"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}>Contraseña</label>
              <a href="#" style={{ fontSize: 11.5, color: '#A78BFA', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {/* Submit */}
          <button onClick={handleLogin} disabled={loading}
            style={{ padding: '11px 16px', borderRadius: 10, background: loading ? '#5B21B6' : '#7C3AED', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'default' : 'pointer', transition: 'background .2s', marginTop: 4 }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          {/* Register link */}
          <p style={{ fontSize: 12, color: '#52525B', textAlign: 'center', marginTop: 4 }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>
              Regístrate gratis
            </Link>
          </p>

        </div>

        {/* Footer */}
        <p style={{ fontSize: 11, color: '#3F3F46', textAlign: 'center', marginTop: 20 }}>
          Hecho en Perú 🇵🇪 para los que trabajan duro
        </p>

      </div>
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
  transition: 'border-color .2s',
}