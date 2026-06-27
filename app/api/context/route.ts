import { NextResponse } from 'next/server'

import { getAppContext } from '@/lib/appData'

export async function GET() {
  try {
    const context = await getAppContext()
    return NextResponse.json({ context })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar contexto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
