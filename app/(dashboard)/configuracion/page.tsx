'use client'

import { useState } from 'react'

export default function ConfiguracionPage() {
  const [negocio, setNegocio] = useState({ nombre: 'Bodega La Esperanza', tipo: 'bodega', direccion: 'Jr. Los Olivos 245, Lima', telefono: '987654321' })
  const [usuario, setUsuario] = useState({ nombre: 'Juan Pérez', email: 'juan@email.com' })
  const [tgConectado, setTgConectado] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Configuración</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Ajustes de tu negocio y cuenta</p>
      </div>

      {/* Mi negocio */}
      <Section title="Mi negocio" icon="🏪">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre del negocio">
            <input value={negocio.nombre} onChange={e => setNegocio({ ...negocio, nombre: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Tipo de negocio">
            <select value={negocio.tipo} onChange={e => setNegocio({ ...negocio, tipo: e.target.value })} style={inputStyle}>
              <option value="bodega">Bodega</option>
              <option value="tienda">Tienda</option>
              <option value="restaurante">Restaurante</option>
              <option value="farmacia">Farmacia</option>
              <option value="otro">Otro</option>
            </select>
          </Field>
          <Field label="Dirección">
            <input value={negocio.direccion} onChange={e => setNegocio({ ...negocio, direccion: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Teléfono">
            <input value={negocio.telefono} onChange={e => setNegocio({ ...negocio, telefono: e.target.value })} style={inputStyle} />
          </Field>
        </div>
      </Section>

      {/* Cuenta */}
      <Section title="Mi cuenta" icon="👤">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre completo">
            <input value={usuario.nombre} onChange={e => setUsuario({ ...usuario, nombre: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Correo electrónico">
            <input value={usuario.email} onChange={e => setUsuario({ ...usuario, email: e.target.value })} style={inputStyle} />
          </Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="Contraseña">
            <button style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: '#A78BFA', background: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.2)' }}>
              Cambiar contraseña →
            </button>
          </Field>
        </div>
      </Section>

      {/* Telegram */}
      <Section title="Conexión con Telegram" icon="✈️">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: tgConectado ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tgConectado ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✈️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>@QypuBot</div>
              <div style={{ fontSize: 12, color: tgConectado ? '#34D399' : '#52525B', marginTop: 2 }}>
                {tgConectado ? '✓ Conectado — puedes gestionar tu negocio desde Telegram' : 'No conectado'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setTgConectado(!tgConectado)}
            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: tgConectado ? 'rgba(244,63,94,0.15)' : '#229ED9', color: tgConectado ? '#F87171' : '#fff', transition: 'all .2s' }}>
            {tgConectado ? 'Desconectar' : 'Conectar'}
          </button>
        </div>

        {!tgConectado && (
          <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(34,158,217,0.06)', border: '1px solid rgba(34,158,217,0.15)', borderRadius: 10, fontSize: 12, color: '#60C8F5', lineHeight: 1.6 }}>
            Conecta Telegram para registrar ventas, compras y consultar tu negocio desde tu celular sin abrir el dashboard.
            Escribe <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4 }}>/vincular</code> al bot para obtener tu código de conexión.
          </div>
        )}
      </Section>

      {/* Notificaciones */}
      <Section title="Notificaciones" icon="🔔">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Alerta de stock bajo',         desc: 'Te avisa cuando un producto llega al mínimo' },
            { label: 'Resumen diario',                desc: 'Recibe un resumen de tu negocio cada noche' },
            { label: 'Confirmación de ventas',        desc: 'Confirma cada venta registrada por Telegram' },
          ].map((n, i) => (
            <Toggle key={i} label={n.label} desc={n.desc} />
          ))}
        </div>
      </Section>

      {/* Zona peligrosa */}
      <Section title="Zona peligrosa" icon="⚠️" danger>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F87171' }}>Eliminar cuenta</div>
            <div style={{ fontSize: 12, color: '#52525B', marginTop: 2 }}>Esta acción es irreversible y borrará todos tus datos</div>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(244,63,94,0.3)', background: 'transparent', color: '#F87171', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Eliminar
          </button>
        </div>
      </Section>

      {/* Guardar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 24 }}>
        <button onClick={handleSave}
          style={{ padding: '10px 28px', borderRadius: 10, background: saved ? '#10B981' : '#7C3AED', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background .3s' }}>
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </>
  )
}

/* ── Sub-componentes ── */
function Section({ title, icon, children, danger }: { title: string; icon: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div style={{ background: '#18181B', border: `1px solid ${danger ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span>
        <span style={{ color: danger ? '#F87171' : '#F4F4F5' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11.5, color: '#71717A', fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

function Toggle({ label, desc }: { label: string; desc: string }) {
  const [on, setOn] = useState(true)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: '#52525B', marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => setOn(!on)}
        style={{ width: 40, height: 22, borderRadius: 11, border: 'none', background: on ? '#7C3AED' : '#3F3F46', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#0A0A0D',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#F4F4F5',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}