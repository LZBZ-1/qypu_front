import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { message, imageUrl, history, negocioId } = await req.json()

    if (!message && !imageUrl) {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })
    }

    // Obtener contexto del negocio
    const { data: negocio } = await supabase
      .from('negocios')
      .select('nombre, tipo')
      .eq('id', negocioId)
      .single()

    const { data: inventario } = await supabase
      .from('inventario')
      .select('nombre, cantidad, precio_venta, precio_costo, stock_minimo')
      .eq('negocio_id', negocioId)

    // Ventas del día para contexto
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const { data: ventasHoy } = await supabase
      .from('ventas')
      .select('total')
      .eq('negocio_id', negocioId)
      .gte('created_at', hoy.toISOString())

    const totalVentasHoy = ventasHoy?.reduce((s, v) => s + v.total, 0) ?? 0

    // System prompt
    const systemPrompt = `
Eres Qypu, el asistente inteligente de gestión de "${negocio?.nombre ?? 'este negocio'}" (${negocio?.tipo ?? 'negocio'}) en Perú.

INVENTARIO ACTUAL:
${inventario?.map(p => `- ${p.nombre}: ${p.cantidad} uds | venta: S/${p.precio_venta} | costo: S/${p.precio_costo} | mínimo: ${p.stock_minimo}`).join('\n') ?? 'Sin productos registrados'}

VENTAS DE HOY: S/ ${totalVentasHoy.toFixed(2)}

TU TRABAJO:
1. Interpretar mensajes en español peruano natural
2. Detectar el intent del mensaje
3. Extraer entidades (productos, cantidades, precios)
4. Responder de forma breve, cálida y natural
5. Confirmar siempre lo que registraste

INTENTS POSIBLES:
- VENTA: "vendí X productos", "le vendí a", "salió X"
- COMPRA: "compré", "llegó mercadería", "traje"
- CONSULTA_VENTAS: "cuánto vendí", "cómo voy", "ventas de hoy"
- CONSULTA_STOCK: "cuánto tengo de", "stock de", "me queda"
- AJUSTE_INVENTARIO: "actualiza", "corrige el stock", "agrega producto"
- OTRO: saludos, preguntas generales

REGLAS:
- Responde SIEMPRE en español peruano natural
- Usa S/ para precios (soles peruanos)
- Sé breve: máximo 3-4 líneas de respuesta
- Si detectas stock bajo al registrar una venta, avisa
- Si no entiendes algo, pide que lo repita con un ejemplo

RESPONDE SOLO CON JSON VÁLIDO con esta estructura:
{
  "text": "tu respuesta natural aquí",
  "intent": "VENTA | COMPRA | CONSULTA_VENTAS | CONSULTA_STOCK | AJUSTE_INVENTARIO | OTRO",
  "data": {
    "items": [{ "nombre": "string", "qty": number, "precio_unitario": number }],
    "total": number,
    "proveedor": "string (solo en COMPRA)"
  },
  "actions": [{ "id": "string", "label": "string" }]
}

El campo "data" solo es necesario en VENTA, COMPRA y AJUSTE_INVENTARIO.
En CONSULTA y OTRO, data puede ser null.
`

    // Construir mensajes para OpenAI
    const userContent: any = imageUrl
      ? [
          { type: 'text', text: message ?? 'Analiza esta imagen' },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } }
        ]
      : message

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 800,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-8).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: userContent },
      ],
    })

    const raw = completion.choices[0].message.content ?? '{}'
    const result = JSON.parse(raw)

    // Procesar según intent
    if (result.intent === 'VENTA' && result.data?.items?.length > 0) {
      await procesarVenta(negocioId, result.data, inventario ?? [])
    }

    if (result.intent === 'COMPRA' && result.data?.items?.length > 0) {
      await procesarCompra(negocioId, result.data, imageUrl)
    }

    if (result.intent === 'AJUSTE_INVENTARIO' && result.data?.items?.length > 0) {
      await ajustarInventario(negocioId, result.data.items)
    }

    // Guardar mensajes en historial
    await supabase.from('mensajes').insert([
      { negocio_id: negocioId, rol: 'user',      contenido: message ?? '[imagen]', metadata: { imageUrl } },
      { negocio_id: negocioId, rol: 'assistant', contenido: result.text, metadata: result },
    ])

    return NextResponse.json(result)

  } catch (err) {
    console.error('Error en /api/chat:', err)
    return NextResponse.json({
      text: 'Ups, tuve un problema procesando tu mensaje. Intenta de nuevo 🙏',
      intent: 'OTRO',
      data: null,
      actions: [],
    }, { status: 500 })
  }
}

/* ── PROCESAR VENTA ── */
async function procesarVenta(negocioId: string, data: any, inventario: any[]) {
  let total = 0
  const itemsConPrecio = data.items.map((item: any) => {
    const prod = inventario.find(p =>
      p.nombre.toLowerCase().includes(item.nombre.toLowerCase())
    )
    const precio = item.precio_unitario ?? prod?.precio_venta ?? 0
    const subtotal = precio * item.qty
    total += subtotal
    return { ...item, precio_unitario: precio, subtotal }
  })

  // Insertar venta
  const { data: venta } = await supabase
    .from('ventas')
    .insert({ negocio_id: negocioId, total, items: itemsConPrecio, origen: 'chat' })
    .select()
    .single()

  // Descontar stock
  for (const item of itemsConPrecio) {
    const prod = inventario.find(p =>
      p.nombre.toLowerCase().includes(item.nombre.toLowerCase())
    )
    if (prod) {
      await supabase
        .from('inventario')
        .update({ cantidad: Math.max(0, prod.cantidad - item.qty) })
        .eq('negocio_id', negocioId)
        .ilike('nombre', `%${item.nombre}%`)
    }
  }

  // Registrar ingreso en caja
  if (venta?.id) {
    await supabase.from('caja').insert({
      negocio_id: negocioId,
      tipo: 'ingreso',
      monto: total,
      concepto: 'Venta',
      referencia_id: venta.id,
    })
  }
}

/* ── PROCESAR COMPRA ── */
async function procesarCompra(negocioId: string, data: any, imageUrl?: string) {
  const total = data.total ?? data.items.reduce((s: number, i: any) => s + (i.qty * (i.precio_unitario ?? 0)), 0)

  // Insertar compra
  const { data: compra } = await supabase
    .from('compras')
    .insert({
      negocio_id: negocioId,
      total,
      items: data.items,
      proveedor: data.proveedor ?? null,
      imagen_url: imageUrl ?? null,
    })
    .select()
    .single()

  // Aumentar stock
  for (const item of data.items) {
    const { data: prod } = await supabase
      .from('inventario')
      .select('id, cantidad')
      .eq('negocio_id', negocioId)
      .ilike('nombre', `%${item.nombre}%`)
      .single()

    if (prod) {
      // Producto existe → actualizar cantidad
      await supabase
        .from('inventario')
        .update({ cantidad: prod.cantidad + item.qty })
        .eq('id', prod.id)
    } else {
      // Producto nuevo → crear en inventario
      await supabase.from('inventario').insert({
        negocio_id: negocioId,
        nombre: item.nombre,
        cantidad: item.qty,
        precio_costo: item.precio_unitario ?? 0,
        precio_venta: (item.precio_unitario ?? 0) * 1.25, // margen 25% por defecto
        stock_minimo: 5,
        unidad: 'unidad',
      })
    }
  }

  // Registrar egreso en caja
  if (compra?.id) {
    await supabase.from('caja').insert({
      negocio_id: negocioId,
      tipo: 'egreso',
      monto: total,
      concepto: 'Compra',
      referencia_id: compra.id,
    })
  }
}

/* ── AJUSTAR INVENTARIO ── */
async function ajustarInventario(negocioId: string, items: any[]) {
  for (const item of items) {
    await supabase
      .from('inventario')
      .update({ cantidad: item.qty })
      .eq('negocio_id', negocioId)
      .ilike('nombre', `%${item.nombre}%`)
  }
}