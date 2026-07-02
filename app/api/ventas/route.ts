import { NextRequest, NextResponse } from 'next/server'

import { createSale, getSalesOverview } from '@/lib/appData'

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { issueDate, client, items } = body

    if (!client || typeof client.name !== 'string') {
      return NextResponse.json({ error: 'El cliente es obligatorio' }, { status: 400 })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Agrega al menos un producto' }, { status: 400 })
    }

    await createSale({
      issueDate: typeof issueDate === 'string' ? issueDate : undefined,
      client: {
        name: client.name,
        email: typeof client.email === 'string' ? client.email : undefined,
        phoneNumber: typeof client.phoneNumber === 'string' ? client.phoneNumber : undefined,
      },
      items: items.map((item) => ({
        productId: String(item.productId ?? ''),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    })

    const today = new Date().toISOString().slice(0, 10)
    const data = await getSalesOverview({ from: today, to: today })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo registrar la venta'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
