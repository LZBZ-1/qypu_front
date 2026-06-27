import { NextResponse } from 'next/server'

import { getAccessState, getLocationCatalog } from '@/lib/access'
import { getSessionUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type OrganizationPayload = {
  organizationName?: string
  organizationAddress?: string
  branchName?: string
  stateId?: string
  cityId?: string
  districtId?: string
}

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function generateLinkingCode() {
  return `QYPU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export async function GET(request: Request) {
  try {
    const access = await getAccessState()

    if (!access.authUser) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
    }

    const url = new URL(request.url)
    const stateId = url.searchParams.get('stateId')
    const cityId = url.searchParams.get('cityId')
    const catalog = await getLocationCatalog({ stateId, cityId })

    return NextResponse.json({
      profile: access.profile,
      existingOrganization: access.organization,
      existingBranch: access.branch,
      ...catalog,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo cargar el onboarding.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getSessionUser()

    if (!authUser) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
    }

    const access = await getAccessState()

    if (access.membership && access.organization && access.branch) {
      return NextResponse.json({ nextStep: '/onboarding/telegram' })
    }

    const body = (await request.json()) as OrganizationPayload
    const organizationName = getText(body.organizationName)
    const organizationAddress = getText(body.organizationAddress)
    const branchName = getText(body.branchName)
    const stateId = getText(body.stateId)
    const cityId = getText(body.cityId)
    const districtId = getText(body.districtId)

    if (!organizationName || !organizationAddress || !branchName || !stateId || !cityId || !districtId) {
      return NextResponse.json({ error: 'Completa los datos de tu organizacion.' }, { status: 400 })
    }

    const organizationId = crypto.randomUUID()
    const branchId = crypto.randomUUID()
    const membershipId = crypto.randomUUID()
    const channelId = crypto.randomUUID()

    const { error: organizationError } = await supabaseAdmin.from('organizations').insert({
      id: organizationId,
      name: organizationName,
      address: organizationAddress,
    })

    if (organizationError) {
      return NextResponse.json({ error: organizationError.message }, { status: 400 })
    }

    const { error: branchError } = await supabaseAdmin.from('branches').insert({
      id: branchId,
      organization_id: organizationId,
      state_id: stateId,
      city_id: cityId,
      district_id: districtId,
      name: branchName,
    })

    if (branchError) {
      await supabaseAdmin.from('organizations').delete().eq('id', organizationId)
      return NextResponse.json({ error: branchError.message }, { status: 400 })
    }

    const { error: membershipError } = await supabaseAdmin.from('user_organizations').insert({
      id: membershipId,
      organization_id: organizationId,
      user_id: authUser.id,
      status: 'active',
    })

    if (membershipError) {
      await supabaseAdmin.from('branches').delete().eq('id', branchId)
      await supabaseAdmin.from('organizations').delete().eq('id', organizationId)
      return NextResponse.json({ error: membershipError.message }, { status: 400 })
    }

    const { error: channelError } = await supabaseAdmin.from('channels').insert({
      id: channelId,
      organization_id: organizationId,
      name: `${organizationName} Telegram`,
      channel_type: 'telegram',
      status: 'pending',
      linking_code: generateLinkingCode(),
    })

    if (channelError) {
      await supabaseAdmin.from('user_organizations').delete().eq('id', membershipId)
      await supabaseAdmin.from('branches').delete().eq('id', branchId)
      await supabaseAdmin.from('organizations').delete().eq('id', organizationId)
      return NextResponse.json({ error: channelError.message }, { status: 400 })
    }

    return NextResponse.json({
      nextStep: '/canales',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo crear la organizacion.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
