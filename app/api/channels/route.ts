import { NextResponse } from 'next/server'

import { getAppContext } from '@/lib/appData'

function getTelegramConnectionMeta(linkingCode: string | null) {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.trim() || null
  const botLink = botUsername && linkingCode
    ? `https://t.me/${botUsername}?start=${encodeURIComponent(linkingCode)}`
    : botUsername
      ? `https://t.me/${botUsername}`
      : null

  return {
    botUsername,
    botLink,
  }
}

export async function GET() {
  try {
    const context = await getAppContext()

    if (!context) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
    }

    return NextResponse.json({
      organization: context?.organization ?? null,
      telegramChannel: context?.telegramChannel ?? null,
      ...getTelegramConnectionMeta(context?.telegramChannel?.linking_code ?? null),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar canales'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
