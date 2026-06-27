import { NextResponse } from 'next/server'

import { getReportOverview } from '@/lib/appData'

export async function GET() {
  try {
    const data = await getReportOverview()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar reportes'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
