import { NextRequest, NextResponse } from 'next/server'

import { createInventoryItem, getInventoryOverview } from '@/lib/appData'

export async function GET(req: NextRequest) {
  void req

  try {
    const data = await getInventoryOverview()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar inventario'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, quantity, unitPrice, categoryId } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 })
    }

    await createInventoryItem({
      name,
      quantity: typeof quantity === 'number' ? quantity : Number(quantity) || 0,
      unitPrice: typeof unitPrice === 'number' ? unitPrice : Number(unitPrice) || 0,
      categoryId: categoryId || null,
    })

    const data = await getInventoryOverview()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear el producto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
