import { NextRequest, NextResponse } from 'next/server'

import { createCategory, deleteCategory, getInventoryOverview, updateCategory } from '@/lib/appData'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 })
    }

    const category = await createCategory({ name })
    const data = await getInventoryOverview()

    return NextResponse.json({ category, inventory: data }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la categoria'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 })
    }

    const category = await updateCategory({ id, name })
    const data = await getInventoryOverview()

    return NextResponse.json({ category, inventory: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo actualizar la categoria'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    await deleteCategory({ id })
    const data = await getInventoryOverview()

    return NextResponse.json({ inventory: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar la categoria'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
