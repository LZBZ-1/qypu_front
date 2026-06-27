import { getAppContext } from '@/lib/appData'

export default async function ConfiguracionPage() {
  const context = await getAppContext()
  const organization = context?.organization
  const branch = context?.branch

  return (
    <>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Configuracion</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
          Campos reales disponibles hoy en tu esquema de Supabase
        </p>
      </div>

      <Section title="Organizacion" icon="O">
        <Field label="Nombre">{organization?.name ?? 'Sin organizacion'}</Field>
        <Field label="Direccion">{organization?.address ?? 'Sin direccion'}</Field>
      </Section>

      <Section title="Sucursal" icon="S">
        <Field label="Nombre">{branch?.name ?? 'Sin sucursal'}</Field>
      </Section>

      <Section title="Nota" icon="i">
        <div style={{ fontSize: 12.5, color: '#A1A1AA', lineHeight: 1.6 }}>
          Esta pantalla se enfoca en los datos reales de `organizations` y `branches`. La gestion del canal Telegram ahora vive en la seccion `Canales`.
        </div>
      </Section>
    </>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span>
        <span style={{ color: '#F4F4F5' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11.5, color: '#71717A', fontWeight: 500 }}>{label}</label>
      <div style={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#F4F4F5' }}>
        {children}
      </div>
    </div>
  )
}
