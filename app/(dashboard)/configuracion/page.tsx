import type { ComponentProps, ReactNode } from 'react'

import { getAppContext } from '@/lib/appData'
import AppIcon from '@/components/ui/AppIcon'

export default async function ConfiguracionPage() {
  const context = await getAppContext()
  const organization = context?.organization
  const branch = context?.branch

  return (
    <>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Configuracion</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
          Datos principales de tu negocio
        </p>
      </div>

      <Section title="Organizacion" icon="building">
        <Field label="Nombre">{organization?.name ?? 'Sin organizacion'}</Field>
        <Field label="Direccion">{organization?.address ?? 'Sin direccion'}</Field>
      </Section>

      <Section title="Sucursal" icon="home">
        <Field label="Nombre">{branch?.name ?? 'Sin sucursal'}</Field>
      </Section>

      <Section title="Nota" icon="message">
        <div style={{ fontSize: 12.5, color: '#587487', lineHeight: 1.6 }}>
          La gestion del canal Telegram ahora vive en la seccion Canales.
        </div>
      </Section>
    </>
  )
}

function Section({ title, icon, children }: { title: string; icon: ComponentProps<typeof AppIcon>['name']; children: ReactNode }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#008772' }}><AppIcon name={icon} size={17} /></span>
        <span style={{ color: '#063052' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11.5, color: '#71717A', fontWeight: 500 }}>{label}</label>
      <div style={{ background: '#F7FBFA', border: '1px solid #CFE9E3', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#063052' }}>
        {children}
      </div>
    </div>
  )
}
