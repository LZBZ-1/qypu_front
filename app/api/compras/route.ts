import { NextRequest, NextResponse } from 'next/server'

import { getCashOverview } from '@/lib/appData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const desde = searchParams.get('desde') ?? undefined

  try {
    const data = await getCashOverview({ from: desde })
    const compras = data.movimientos.filter((movement) => movement.type === 'egreso')

    return NextResponse.json({
      compras,
      summary: {
        total: compras.reduce((sum, movement) => sum + movement.amount, 0),
        count: compras.length,
        average: compras.length
          ? compras.reduce((sum, movement) => sum + movement.amount, 0) / compras.length
          : 0,
        highest: compras.reduce((max, movement) => Math.max(max, movement.amount), 0),
      },
      note: 'Esta vista muestra egresos de caja registrados.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar compras'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
