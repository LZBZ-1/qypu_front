import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const negocioId = searchParams.get('negocioId')
  const desde     = searchParams.get('desde')
  const hasta     = searchParams.get('hasta')

  if (!negocioId) return NextResponse.json({ error: 'negocioId requerido' }, { status: 400 })

  let query = supabase
    .from('ventas')
    .select('*')
    .eq('negocio_id', negocioId)
    .order('created_at', { ascending: false })

  if (desde) query = query.gte('created_at', desde)
  if (hasta) query = query.lte('created_at', hasta)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ventas: data })
}