import { NextResponse } from 'next/server'

import { setSessionCookies, signInWithPassword } from '@/lib/auth'
import { validateRegisterInput } from '@/lib/authValidation'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type RegisterPayload = {
  name?: string
  lastName?: string
  phone?: string
  email?: string
  password?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload
    const validation = validateRegisterInput(body)

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, lastName, phone, email, password } = validation.data

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        last_name: lastName,
      },
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message ?? 'No se pudo crear la cuenta.' },
        { status: 400 },
      )
    }

    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      name,
      last_name: lastName,
      email,
      phone,
    })

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    const { data: sessionData, error: sessionError } = await signInWithPassword(email, password)

    if (sessionError || !sessionData.session) {
      return NextResponse.json(
        { error: sessionError?.message ?? 'La cuenta fue creada, pero no se pudo iniciar sesion.' },
        { status: 400 },
      )
    }

    await setSessionCookies(sessionData.session)

    return NextResponse.json({
      nextStep: '/onboarding/organization',
      user: {
        id: authData.user.id,
        email,
        name,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la cuenta.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
