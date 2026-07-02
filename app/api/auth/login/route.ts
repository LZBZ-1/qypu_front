import { NextResponse } from 'next/server'

import { getPostAuthDestinationForUserId } from '@/lib/access'
import { setSessionCookies, signInWithPassword } from '@/lib/auth'
import { validateLoginInput } from '@/lib/authValidation'

type LoginPayload = {
  email?: string
  password?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload
    const validation = validateLoginInput(body)

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { email, password } = validation.data
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
