export default function ChatPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Chat</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
          Esta parte sigue pendiente de mapearse al esquema real actual.
        </p>
      </div>

      <div style={{ background: '#18181B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', fontSize: 13, color: '#A1A1AA', lineHeight: 1.7 }}>
        El chat original dependia de tablas como `negocios`, `inventario`, `ventas`, `compras`, `caja` y `mensajes`, pero tu proyecto actual usa otro esquema.
        La base ya quedo corregida para inventario, ventas, caja, reportes y Telegram. El chat se puede reconectar despues sobre `organizations`, `products`, `sales` y `financial_transaction_movements`.
      </div>
    </div>
  )
}
