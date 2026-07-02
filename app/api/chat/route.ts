import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      text: 'El chat aun esta en preparacion. Pronto podras centralizar mensajes y consultas desde tus canales conectados.',
      intent: 'OTRO',
      data: null,
      actions: [],
    },
    { status: 501 }
  )
}
