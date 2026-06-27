import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

import { supabaseAdmin } from '@/lib/supabaseAdmin'

const AUTH_COOKIE = 'qypu-access-token'
const REFRESH_COOKIE = 'qypu-refresh-token'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

function getCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  }
}

export const getSessionAccessToken = cache(async () => {
  return (await cookies()).get(AUTH_COOKIE)?.value ?? null
})

export const getSessionUser = cache(async () => {
  const accessToken = await getSessionAccessToken()

  if (!accessToken) {
    return null
  }

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken)

  if (error || !data.user) {
    return null
  }

  return data.user
})

export async function requireSessionUser() {
  const user = await getSessionUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function signInWithPassword(email: string, password: string) {
  return supabaseAuthClient.auth.signInWithPassword({
    email,
    password,
  })
}

export async function setSessionCookies(session: {
  access_token: string
  refresh_token?: string
}) {
  const cookieStore = await cookies()

  cookieStore.set(AUTH_COOKIE, session.access_token, getCookieOptions())

  if (session.refresh_token) {
    cookieStore.set(REFRESH_COOKIE, session.refresh_token, getCookieOptions())
    return
  }

  cookieStore.delete(REFRESH_COOKIE)
}

export async function clearSessionCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  cookieStore.delete(REFRESH_COOKIE)
}
