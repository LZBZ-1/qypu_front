export default function ChatPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Chat</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
          Conversaciones y asistencia para tu negocio.
        </p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #DCEFEB', borderRadius: 12, padding: '18px 20px', fontSize: 13, color: '#587487', lineHeight: 1.7 }}>
        El chat aun esta en preparacion. Pronto podras centralizar mensajes y consultas desde tus canales conectados.
      </div>
    </div>
  )
}
