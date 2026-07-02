import Image from 'next/image'
import Link from 'next/link'

import { getAccessState } from '@/lib/access'

const steps = [
  'Escribes o hablas por Telegram',
  'Qypu entiende la operacion',
  'Registra compras, ventas e inventario',
  'Mantiene tu negocio organizado',
]

const benefits = [
  'Ahorra tiempo en cada venta',
  'Evita errores de cuaderno',
  'Controla stock sin esfuerzo',
  'Funciona desde el celular',
]

const audiences = ['Bodegas', 'Tiendas pequenas', 'Comerciantes informales', 'Negocios en crecimiento']

export default async function HomePage() {
  const access = await getAccessState()
  const hasSession = Boolean(access.authUser)

  const primaryHref = hasSession ? '/dashboard' : '/register'
  const primaryText = hasSession ? 'Ir al dashboard' : 'Empieza gratis en 1 minuto'
  const navPrimaryText = hasSession ? 'Dashboard' : 'Empieza gratis'
  const secondaryHref = hasSession ? '/canales' : '/login'
  const secondaryText = hasSession ? 'Conectar Telegram' : 'Iniciar sesion'

  return (
    <main className="min-h-screen bg-[#f7fbfa] text-[#061d33]">
      <section className="relative overflow-hidden border-b border-[#dcefeb] bg-[linear-gradient(180deg,#ffffff_0%,#eefaf7_100%)]">
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="flex w-fit items-center gap-3" aria-label="Qypu">
            <Image
              src="/images/logo.png"
              alt="Qypu"
              width={176}
              height={68}
              priority
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
            <Link
              href={secondaryHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9ddd6] bg-white px-3 text-center text-sm font-semibold leading-5 text-[#063052] shadow-sm transition hover:border-[#0bbf91] sm:px-4"
            >
              {secondaryText}
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#00bf8f] px-3 text-center text-sm font-bold leading-5 text-white shadow-[0_10px_24px_rgba(0,191,143,0.24)] transition hover:bg-[#039f7a] sm:px-4"
            >
              {navPrimaryText}
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-6 sm:px-6 md:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.9fr)] md:items-center lg:px-8 lg:pb-18 lg:pt-8">
          <div className="flex flex-col gap-6">
            <div className="max-w-full rounded-full border border-[#b9ddd6] bg-white px-3 py-2 text-center text-[11px] font-bold uppercase leading-5 tracking-[0.04em] text-[#007a84] shadow-sm sm:w-fit sm:text-xs sm:tracking-[0.08em]">
              Gestion conversacional para negocios
            </div>

            <div className="grid gap-4">
              <h1 className="max-w-3xl text-3xl font-black leading-[1.08] text-[#062342] sm:text-4xl lg:text-5xl">
                Maneja tu negocio sin cuadernos ni sistemas complicados
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#34566c] sm:text-lg">
                Registra compras, ventas e inventario con un mensaje por Telegram.
                Qypu entiende como hablas y organiza tu bodega desde el celular.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#061d33] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(6,29,51,0.18)] transition hover:bg-[#0a355c]"
              >
                {primaryText}
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b9ddd6] bg-white px-6 text-sm font-bold text-[#063052] transition hover:border-[#00bf8f]"
              >
                Ver como funciona
              </a>
            </div>

          </div>

          <HeroVisual />

          <div className="grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-3 md:col-start-1 md:row-start-2">
            <Stat value="1 min" label="para empezar" />
            <Stat value="0" label="capacitaciones" />
            <Stat value="24/7" label="desde chat" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-[0.85fr_1fr] md:items-center lg:px-8">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[#dcefeb] bg-white shadow-[0_18px_44px_rgba(6,35,66,0.10)]">
          <Image
            src="/images/bodeguero_clasico.jpg"
            alt="Bodeguera atendiendo su tienda"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover"
          />
        </div>

        <div className="grid gap-4">
          <InfoPanel
            eyebrow="Problema"
            title="El control sigue en papel o memoria"
            body="En bodegas y pequenos comercios de Lima, una venta olvidada o un stock mal contado puede convertirse en perdida directa."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPanel
              eyebrow="Solucion"
              title="La gestion ocurre en una conversacion"
              body="Qypu transforma mensajes simples en movimientos ordenados de compra, venta, inventario e historial."
            />
            <InfoPanel
              eyebrow="Diferencia"
              title="No es un ERP. Es un asistente"
              body="No obliga a aprender pantallas nuevas. La tecnologia aprende a hablar como trabaja el comerciante."
            />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-start lg:px-8">
          <div className="grid gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#008772]">Como funciona</p>
            <h2 className="text-3xl font-black leading-tight text-[#062342] sm:text-4xl">
              Del mensaje al inventario actualizado, sin cambiar la forma de trabajar
            </h2>
            <p className="text-base leading-7 text-[#45677b]">
              Qypu vive donde el comerciante ya esta: el celular. Escribes o hablas,
              y el sistema hace el trabajo operativo detras.
            </p>
          </div>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[44px_1fr] items-center gap-4 rounded-lg border border-[#dcefeb] bg-[#f7fbfa] p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e0f7f1] text-sm font-black text-[#008772]">
                  {index + 1}
                </div>
                <p className="text-base font-bold text-[#113852]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_0.9fr] md:items-center lg:px-8">
        <div className="grid gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#008772]">Del cuaderno al celular</p>
          <h2 className="text-3xl font-black leading-tight text-[#062342] sm:text-4xl">
            La bodega sigue siendo la misma. La carga operativa baja.
          </h2>
          <p className="text-base leading-8 text-[#45677b]">
            Qypu acompana el ritmo real del negocio: atender, reponer, vender y revisar caja sin depender de una computadora.
          </p>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-[#dcefeb] bg-white shadow-[0_18px_44px_rgba(6,35,66,0.10)]">
          <Image
            src="/images/bodeguero_automatizado.jpg"
            alt="Comerciante revisando productos con una tablet"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_0.8fr] lg:px-8">
        <div className="rounded-lg bg-[#062342] p-6 text-white shadow-[0_18px_44px_rgba(6,35,66,0.16)] sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#52e3c3]">Insight</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
            Ellos no necesitan aprender tecnologia. La tecnologia tiene que aprender a hablar como ellos.
          </h2>
        </div>

        <div className="grid gap-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-lg border border-[#dcefeb] bg-white p-4 text-base font-bold text-[#113852]">
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#dcefeb] bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.8fr_1fr] md:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#008772]">Para quien es</p>
            <h2 className="mt-3 text-3xl font-black text-[#062342]">Hecho para negocios que venden todos los dias</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {audiences.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-[#b9ddd6] bg-[#f7fbfa] px-4 py-3 text-sm font-bold text-[#063052]"
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dcefeb] bg-[#f7fbfa]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="grid gap-2">
            <Image src="/images/logo.png" alt="Qypu" width={120} height={46} className="h-9 w-auto" />
            <p className="max-w-md text-sm leading-6 text-[#45677b]">
              Gestion conversacional para bodegas y pequenos comercios en Peru.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-[#063052]">
            <a href="#como-funciona" className="hover:text-[#008772]">
              Como funciona
            </a>
            <Link href="/login" className="hover:text-[#008772]">
              Iniciar sesion
            </Link>
            <Link href="/register" className="hover:text-[#008772]">
              Crear cuenta
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function HeroVisual() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-4 md:row-span-2 md:ml-auto">
      <HeroChatCard />
      <div className="overflow-hidden rounded-2xl border border-[#dcefeb] bg-white shadow-[0_12px_30px_rgba(6,35,66,0.08)]">
        <div className="relative min-h-[190px]">
          <Image
            src="/images/Bodeguero_feliz.jpg"
            alt="Bodeguero feliz en su tienda"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover object-[50%_18%]"
          />
        </div>
        <div className="p-4">
          <p className="text-sm font-black text-[#062342]">Hecho para atender rapido</p>
          <p className="mt-1 text-sm leading-6 text-[#45677b]">
            Registra mientras vendes, compras o revisas stock.
          </p>
        </div>
      </div>
    </div>
  )
}

function HeroChatCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#c7e8e0] bg-white shadow-[0_22px_54px_rgba(6,35,66,0.14)]">
      <div className="qypu-chat-carousel">
        <div className="qypu-chat-slide qypu-chat-slide-telegram flex items-center justify-between px-4 py-4 text-white">
          <ChannelHeader channel="Telegram" helper="inventario, ventas y caja" />
        </div>
        <div className="qypu-chat-slide qypu-chat-slide-whatsapp flex items-center justify-between px-4 py-4 text-white">
          <ChannelHeader channel="WhatsApp" helper="compras, stock y caja" />
        </div>
      </div>

      <div className="qypu-chat-body-carousel">
        <div className="qypu-chat-body-slide grid gap-3 bg-[#eef6ff] px-3 py-4">
          <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#dff0ff] px-4 py-3 text-sm text-[#123c63] shadow-sm">
            Compre 2 cajas de leche Gloria
          </div>
          <div className="mr-auto max-w-[82%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-[#17384f] shadow-sm">
            Listo. Registre la compra y actualice tu inventario.
          </div>
        </div>
        <div className="qypu-chat-body-slide grid gap-3 bg-[#eefaf7] px-3 py-4">
          <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#d9fdd3] px-4 py-3 text-sm text-[#163b2c] shadow-sm">
            Vendi 6 panes y 1 gaseosa
          </div>
          <div className="mr-auto max-w-[82%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-[#17384f] shadow-sm">
            Venta guardada. Tu caja y stock quedaron al dia.
          </div>
        </div>
      </div>

      <div className="border-t border-[#d1e8e3] bg-white px-3 py-3">
        <div className="flex min-h-11 items-center rounded-full bg-[#f1f5f4] px-4 text-sm font-semibold text-[#6b8796]">
          Escribe una venta, compra o consulta...
        </div>
      </div>
    </div>
  )
}

function ChannelHeader({ channel, helper }: { channel: string; helper: string }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <Image
            src="/images/logo-icon.png"
            alt="Qypu"
            width={34}
            height={34}
            className="h-7 w-7 object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-black">Qypu en {channel}</p>
          <p className="text-xs font-medium text-white/85">{helper}</p>
        </div>
      </div>
      <span className="rounded-full bg-white/20 px-2 py-1 text-[11px] font-black">{channel}</span>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-[#dcefeb] bg-white p-4 shadow-[0_8px_22px_rgba(6,35,66,0.05)]">
      <p className="text-2xl font-black text-[#008772]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.05em] text-[#45677b]">{label}</p>
    </div>
  )
}

function InfoPanel({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <article className="rounded-md border border-[#dcefeb] bg-white/90 p-5 shadow-[0_8px_22px_rgba(6,35,66,0.05)]">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-[#008772]">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-black leading-tight text-[#062342]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#45677b]">{body}</p>
    </article>
  )
}
