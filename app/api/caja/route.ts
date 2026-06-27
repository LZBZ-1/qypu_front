import { NextRequest, NextResponse } from 'next/server'

import { getCashOverview } from '@/lib/appData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const desde = searchParams.get('desde') ?? undefined

  try {
    const data = await getCashOverview({ from: desde })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar caja'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
