import { NextRequest, NextResponse } from 'next/server'

import { getSalesOverview } from '@/lib/appData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const desde = searchParams.get('desde') ?? undefined
  const hasta = searchParams.get('hasta') ?? undefined

  try {
    const data = await getSalesOverview({ from: desde, to: hasta })
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar ventas'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
