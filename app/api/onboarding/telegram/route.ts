import { NextResponse } from 'next/server'

import { getAccessState } from '@/lib/access'
import { getSessionUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function generateLinkingCode() {
  return `QYPU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

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
    const access = await getAccessState()

    if (!access.authUser) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
    }

    return NextResponse.json({
      organization: access.organization,
      telegramChannel: access.telegramChannel,
      ...getTelegramConnectionMeta(access.telegramChannel?.linking_code ?? null),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar el canal de Telegram.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const authUser = await getSessionUser()

    if (!authUser) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
    }

    const access = await getAccessState()

    if (!access.organization) {
      return NextResponse.json({ error: 'Primero crea tu organizacion.' }, { status: 400 })
    }

    const currentChannel = access.telegramChannel

    if (!currentChannel) {
      const channelId = crypto.randomUUID()
      const linkingCode = generateLinkingCode()
      const { data, error } = await supabaseAdmin
        .from('channels')
        .insert({
          id: channelId,
          organization_id: access.organization.id,
          name: `${access.organization.name} Telegram`,
          channel_type: 'telegram',
          status: 'pending',
          linking_code: linkingCode,
        })
        .select('*')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({
        telegramChannel: data,
        ...getTelegramConnectionMeta(data.linking_code ?? null),
      })
    }

    const { data, error } = await supabaseAdmin
      .from('channels')
      .update({
        status: currentChannel.connected_at ? currentChannel.status : 'pending',
        linking_code: generateLinkingCode(),
      })
      .eq('id', currentChannel.id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      telegramChannel: data,
      ...getTelegramConnectionMeta(data.linking_code ?? null),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar el canal.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
