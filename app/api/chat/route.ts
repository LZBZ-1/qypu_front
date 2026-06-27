import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      text: 'El chat aun no esta conectado al esquema real actual de Supabase. Primero habia sido construido sobre tablas que no existen en este proyecto.',
      intent: 'OTRO',
      data: null,
      actions: [],
    },
    { status: 501 }
  )
}
