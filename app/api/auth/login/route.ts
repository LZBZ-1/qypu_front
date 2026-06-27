import { NextResponse } from 'next/server'

import { getPostAuthDestinationForUserId } from '@/lib/access'
import { setSessionCookies, signInWithPassword } from '@/lib/auth'

type LoginPayload = {
  email?: string
  password?: string
}

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload
    const email = getText(body.email).toLowerCase()
    const password = getText(body.password)

    if (!email || !password) {
      return NextResponse.json({ error: 'Ingresa tu correo y contrasena.' }, { status: 400 })
    }

    const { data, error } = await signInWithPassword(email, password)

    if (error || !data.session) {
      return NextResponse.json({ error: error?.message ?? 'Credenciales invalidas.' }, { status: 401 })
    }

    await setSessionCookies(data.session)

    return NextResponse.json({
      nextStep: await getPostAuthDestinationForUserId(data.user.id),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo iniciar sesion.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
