import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const negocioId = searchParams.get('negocioId')

  if (!negocioId) return NextResponse.json({ error: 'negocioId requerido' }, { status: 400 })

  const { data, error } = await supabase
    .from('inventario')
    .select('*')
    .eq('negocio_id', negocioId)
    .order('nombre')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ inventario: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { negocio_id, nombre, cantidad, precio_venta, precio_costo, stock_minimo, unidad } = body

  if (!negocio_id || !nombre) {
    return NextResponse.json({ error: 'negocio_id y nombre son requeridos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('inventario')
    .insert({ negocio_id, nombre, cantidad: cantidad ?? 0, precio_venta, precio_costo, stock_minimo: stock_minimo ?? 5, unidad: unidad ?? 'unidad' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ producto: data })
}