'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Option = {
  id: string
  name: string
}

type BootstrapResponse = {
  profile: {
    name: string
    last_name: string
  } | null
  existingOrganization: {
    name: string
  } | null
  existingBranch: {
    name: string
  } | null
  states: Option[]
  cities: Option[]
  districts: Option[]
  error?: string
}

type FormState = {
  organizationName: string
  organizationAddress: string
  branchName: string
  stateId: string
  cityId: string
  districtId: string
}

export default function OrganizationOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [options, setOptions] = useState<BootstrapResponse | null>(null)
  const [form, setForm] = useState<FormState>({
    organizationName: '',
    organizationAddress: '',
    branchName: '',
    stateId: '',
    cityId: '',
    districtId: '',
  })

  const stateQuery = useMemo(() => {
    const params = new URLSearchParams()
    if (form.stateId) params.set('stateId', form.stateId)
    if (form.cityId) params.set('cityId', form.cityId)
    const query = params.toString()
    return query ? `?${query}` : ''
  }, [form.stateId, form.cityId])

  const loadCatalog = useCallback(async (query = '', config?: { keepState?: boolean }) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/onboarding/organization${query}`)
      const payload = (await response.json()) as BootstrapResponse

      if (response.status === 401) {
        router.replace('/login')
        return
      }

      if (!response.ok) {
        setError(payload.error ?? 'No se pudo cargar el onboarding.')
        return
      }

      setOptions(payload)
      setForm((current) => ({
        ...current,
        organizationName: config?.keepState ? current.organizationName : current.organizationName,
        organizationAddress: config?.keepState ? current.organizationAddress : current.organizationAddress,
        branchName:
          config?.keepState || current.branchName
            ? current.branchName
            : payload.profile
              ? `Principal ${payload.profile.name}`
              : '',
        cityId:
          payload.cities.some((city) => city.id === current.cityId) && config?.keepState ? current.cityId : '',
        districtId:
          payload.districts.some((district) => district.id === current.districtId) && config?.keepState
            ? current.districtId
            : '',
      }))
    } catch {
      setError('No se pudo cargar el onboarding.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCatalog()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadCatalog])

  useEffect(() => {
    if (!form.stateId) return

    const timer = window.setTimeout(() => {
      void loadCatalog(stateQuery, { keepState: true })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [form.stateId, loadCatalog, stateQuery])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      if (key === 'stateId') {
        return { ...current, stateId: value, cityId: '', districtId: '' }
      }

      if (key === 'cityId') {
        return { ...current, cityId: value, districtId: '' }
      }

      return { ...current, [key]: value }
    })
    setError('')
  }

  async function handleSubmit() {
    if (!form.organizationName || !form.organizationAddress || !form.branchName || !form.stateId || !form.cityId || !form.districtId) {
      setError('Completa todos los datos de la organizacion.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await response.json()

      if (!response.ok) {
        setError(payload.error ?? 'No se pudo guardar la organizacion.')
        return
      }

      router.replace(payload.nextStep ?? '/onboarding/telegram')
      router.refresh()
    } catch {
      setError('No se pudo guardar la organizacion.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={shellStyle}>
      <div style={{ width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 24 }}>
          <header style={{ display: 'grid', gap: 10 }}>
            <div style={eyebrowStyle}>Paso 1 de 2</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#062342', margin: 0 }}>
              Onboarding de organizacion
            </h1>
            <p style={{ margin: 0, maxWidth: 560, color: '#45677B', lineHeight: 1.7, fontSize: 14 }}>
              Creamos tu organizacion, tu sucursal principal y dejamos listo el canal base para Telegram.
            </p>
          </header>

          <div style={cardStyle}>
            {error ? <Alert>{error}</Alert> : null}

            {loading && !options ? (
              <div style={{ color: '#A1A1AA', fontSize: 13 }}>Cargando catalogos de ubicacion...</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                  <Field label="Nombre de la organizacion">
                    <input
                      value={form.organizationName}
                      onChange={(event) => update('organizationName', event.target.value)}
                      placeholder="Qypu Market"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Sucursal principal">
                    <input
                      value={form.branchName}
                      onChange={(event) => update('branchName', event.target.value)}
                      placeholder="Casa matriz"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <Field label="Direccion">
                  <input
                    value={form.organizationAddress}
                    onChange={(event) => update('organizationAddress', event.target.value)}
                    placeholder="Av. Principal 123"
                    style={inputStyle}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
                  <Field label="Departamento">
                    <select value={form.stateId} onChange={(event) => update('stateId', event.target.value)} style={inputStyle}>
                      <option value="">Selecciona</option>
                      {options?.states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Provincia">
                    <select value={form.cityId} onChange={(event) => update('cityId', event.target.value)} style={inputStyle} disabled={!form.stateId}>
                      <option value="">Selecciona</option>
                      {options?.cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Distrito">
                    <select
                      value={form.districtId}
                      onChange={(event) => update('districtId', event.target.value)}
                      style={inputStyle}
                      disabled={!form.cityId}
                    >
                      <option value="">Selecciona</option>
                      {options?.districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div style={noteStyle}>
                  La tabla `branches` exige ubicacion completa, por eso este paso guarda departamento, provincia y distrito desde tus catalogos reales de Supabase.
                </div>

                <button onClick={handleSubmit} disabled={saving || loading} style={primaryButtonStyle(saving || loading)}>
                  {saving ? 'Guardando organizacion...' : 'Continuar a Telegram'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
  padding: '48px 20px',
  display: 'grid',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #EEFaf7 100%)',
}

const eyebrowStyle: React.CSSProperties = {
  width: 'fit-content',
  padding: '6px 10px',
  borderRadius: 999,
  background: '#E0F7F1',
  border: '1px solid #B9DDD6',
  fontSize: 11,
  fontWeight: 700,
  color: '#008772',
  letterSpacing: '.08em',
  textTransform: 'uppercase',
}

const cardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 18,
  background: '#FFFFFF',
  border: '1px solid #DCEFEB',
  borderRadius: 14,
  padding: 28,
  boxShadow: '0 18px 44px rgba(6,35,66,0.10)',
}

const inputStyle: React.CSSProperties = {
  background: '#F7FBFA',
  border: '1px solid #B9DDD6',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 14,
  color: '#061D33',
  fontFamily: 'inherit',
  width: '100%',
}

const noteStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: 14,
  background: '#EEFaf7',
  border: '1px solid #B9DDD6',
  color: '#34566C',
  fontSize: 12.5,
  lineHeight: 1.6,
}

const alertStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 12,
  background: 'rgba(248,113,113,0.08)',
  border: '1px solid rgba(248,113,113,0.22)',
  color: '#B42318',
  fontSize: 12,
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '13px 18px',
    borderRadius: 12,
    background: disabled ? '#7CBFB0' : '#00A884',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 800,
    cursor: disabled ? 'default' : 'pointer',
  }
}
