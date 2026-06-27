import TelegramChannelManager from '@/components/settings/TelegramChannelManager'
import { getAppContext } from '@/lib/appData'

export default async function CanalesPage() {
  const context = await getAppContext()
  const organization = context?.organization
  const telegram = context?.telegramChannel
  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.trim() || null
  const botLink = botUsername && telegram?.linking_code
    ? `https://t.me/${botUsername}?start=${encodeURIComponent(telegram.linking_code)}`
    : botUsername
      ? `https://t.me/${botUsername}`
      : null

  return (
    <>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Canales</h1>
        <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
          Gestiona la conexion real de tus canales desde el esquema `channels`
        </p>
      </div>

      <Section title="Telegram" icon="T">
        <TelegramChannelManager
          initialData={{
            organization: organization ? { name: organization.name } : null,
            botUsername,
            botLink,
            telegramChannel: telegram
              ? {
                  name: telegram.name,
                  status: telegram.status,
                  linking_code: telegram.linking_code,
                  telegram_username: telegram.telegram_username,
                  connected_at: telegram.connected_at,
                }
              : null,
          }}
        />
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
