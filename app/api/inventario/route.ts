import { NextRequest, NextResponse } from 'next/server'

import { createInventoryItem, deleteInventoryItem, getInventoryOverview, updateInventoryItem } from '@/lib/appData'

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

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json({ error: 'Selecciona o crea una categoria para el producto' }, { status: 400 })
    }

    await createInventoryItem({
      name,
      quantity: typeof quantity === 'number' ? quantity : Number(quantity) || 0,
      unitPrice: typeof unitPrice === 'number' ? unitPrice : Number(unitPrice) || 0,
      categoryId,
    })

    const data = await getInventoryOverview()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear el producto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, name, quantity, unitPrice, categoryId } = body

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'productId es requerido' }, { status: 400 })
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 })
    }

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json({ error: 'Selecciona o crea una categoria para el producto' }, { status: 400 })
    }

    await updateInventoryItem({
      productId,
      name,
      quantity: typeof quantity === 'number' ? quantity : Number(quantity) || 0,
      unitPrice: typeof unitPrice === 'number' ? unitPrice : Number(unitPrice) || 0,
      categoryId,
    })

    const data = await getInventoryOverview()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar el producto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId } = body

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'productId es requerido' }, { status: 400 })
    }

    await deleteInventoryItem({ productId })

    const data = await getInventoryOverview()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar el producto'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
