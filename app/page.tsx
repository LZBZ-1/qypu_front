import Link from 'next/link'

import { getAccessState } from '@/lib/access'

export default async function HomePage() {
  const access = await getAccessState()
  const hasSession = Boolean(access.authUser)

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <nav style={navStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={logoStyle}>Q</div>
            <div>
              <div style={{ color: '#F8FAFC', fontWeight: 800, letterSpacing: '-0.03em' }}>Qypu</div>
              <div style={{ color: '#94A3B8', fontSize: 12 }}>Gestion conversacional para negocios</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {hasSession ? (
              <Link href="/dashboard" style={primaryLinkStyle}>
                Ir al dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" style={ghostLinkStyle}>
                  Iniciar sesion
                </Link>
                <Link href="/register" style={primaryLinkStyle}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </nav>

        <div style={heroGridStyle}>
          <div style={{ display: 'grid', gap: 22 }}>
            <div style={pillStyle}>Venta, inventario y caja desde Telegram</div>
            <h1 style={titleStyle}>Tu negocio no deberia depender de abrir diez pantallas para operar.</h1>
            <p style={subtitleStyle}>
              Qypu conecta registro, onboarding de organizacion y canal de Telegram para que manejes tu negocio con un flujo mucho mas simple desde el celular.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {hasSession ? (
                <>
                  <Link href="/dashboard" style={primaryCtaStyle}>
                    Volver al dashboard
                  </Link>
                  <Link href="/canales" style={secondaryCtaStyle}>
                    Ir a canales
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" style={primaryCtaStyle}>
                    Empezar gratis
                  </Link>
                  <Link href="/login" style={secondaryCtaStyle}>
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>

            <div style={metricsRowStyle}>
              <Metric value="1" label="flujo de entrada claro" />
              <Metric value="3" label="pasos hasta Telegram" />
              <Metric value="24/7" label="operacion desde chat" />
            </div>
          </div>

          <div style={panelShellStyle}>
            <div style={chatPanelStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#F8FAFC', fontWeight: 700 }}>Canal Telegram</div>
                  <div style={{ color: '#94A3B8', fontSize: 12 }}>Estado real conectado a Supabase</div>
                </div>
                <div style={statusBadgeStyle}>Pending</div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <PreviewCard
                  title="1. Registro"
                  body="Crea tu cuenta con correo, nombre, apellido y telefono."
                />
                <PreviewCard
                  title="2. Organizacion"
                  body="Define negocio, sucursal principal y ubicacion real."
                />
                <PreviewCard
                  title="3. Telegram"
                  body="Genera tu codigo de vinculacion y conecta el canal."
                />
              </div>

              <div style={messageBoxStyle}>
                <div style={{ color: '#67E8F9', fontSize: 12, fontWeight: 700 }}>Ejemplo</div>
                <div style={{ color: '#E2E8F0', fontSize: 13, lineHeight: 1.7 }}>
                  "Qypu, cuanto vendi hoy?"<br />
                  "Tienes 4 productos con stock bajo."<br />
                  "Tu canal Telegram ya quedo enlazado."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div style={metricCardStyle}>
      <div style={{ color: '#F8FAFC', fontSize: 22, fontWeight: 800 }}>{value}</div>
      <div style={{ color: '#94A3B8', fontSize: 12 }}>{label}</div>
    </div>
  )
}

function PreviewCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={previewCardStyle}>
      <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 14 }}>{title}</div>
      <div style={{ color: '#A5B4C7', fontSize: 12.5, lineHeight: 1.6 }}>{body}</div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 24%), radial-gradient(circle at right, rgba(34,197,94,0.14), transparent 28%), linear-gradient(180deg, #09090B 0%, #111827 100%)',
}

const heroStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '28px 20px 56px',
  display: 'grid',
  gap: 40,
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
}

const logoStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
  color: '#1C1204',
  fontWeight: 900,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
}

const ghostLinkStyle: React.CSSProperties = {
  color: '#E2E8F0',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
}

const primaryLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  padding: '11px 16px',
  borderRadius: 999,
  background: '#22C55E',
  color: '#052E16',
  fontSize: 14,
  fontWeight: 800,
}

const heroGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
  gap: 28,
  alignItems: 'center',
}

const pillStyle: React.CSSProperties = {
  width: 'fit-content',
  padding: '7px 12px',
  borderRadius: 999,
  border: '1px solid rgba(251,146,60,0.25)',
  background: 'rgba(249,115,22,0.1)',
  color: '#FDBA74',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.04em',
  textTransform: 'uppercase',
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#F8FAFC',
  fontSize: 'clamp(40px, 6vw, 68px)',
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: '-0.06em',
  maxWidth: 760,
}

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#CBD5E1',
  fontSize: 16,
  lineHeight: 1.8,
  maxWidth: 650,
}

const primaryCtaStyle: React.CSSProperties = {
  textDecoration: 'none',
  padding: '14px 18px',
  borderRadius: 14,
  background: '#F97316',
  color: '#FFF7ED',
  fontWeight: 800,
  fontSize: 14,
}

const secondaryCtaStyle: React.CSSProperties = {
  textDecoration: 'none',
  padding: '14px 18px',
  borderRadius: 14,
  border: '1px solid rgba(148,163,184,0.22)',
  color: '#E2E8F0',
  fontWeight: 700,
  fontSize: 14,
  background: 'rgba(15,23,42,0.5)',
}

const metricsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 14,
  maxWidth: 560,
}

const metricCardStyle: React.CSSProperties = {
  padding: '16px 18px',
  borderRadius: 18,
  background: 'rgba(15,23,42,0.55)',
  border: '1px solid rgba(148,163,184,0.12)',
}

const panelShellStyle: React.CSSProperties = {
  padding: 1,
  borderRadius: 28,
  background: 'linear-gradient(135deg, rgba(34,197,94,0.35), rgba(14,165,233,0.18))',
}

const chatPanelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 18,
  borderRadius: 27,
  padding: 24,
  background: 'rgba(2,6,23,0.92)',
  minHeight: 480,
}

const statusBadgeStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(250,204,21,0.12)',
  border: '1px solid rgba(250,204,21,0.22)',
  color: '#FDE68A',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
}

const previewCardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 6,
  padding: '16px 18px',
  borderRadius: 18,
  background: 'rgba(15,23,42,0.72)',
  border: '1px solid rgba(148,163,184,0.12)',
}

const messageBoxStyle: React.CSSProperties = {
  marginTop: 'auto',
  padding: '16px 18px',
  borderRadius: 20,
  background: 'linear-gradient(135deg, rgba(8,145,178,0.12), rgba(34,197,94,0.1))',
  border: '1px solid rgba(103,232,249,0.16)',
}
