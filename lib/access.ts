import 'server-only'

import { cache } from 'react'

import { getSessionUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export type UserProfile = {
  id: string
  name: string
  last_name: string
  email: string
  phone: string
}

export type UserOrganization = {
  id: string
  organization_id: string
  user_id: string
  status: 'pending' | 'active'
}

export type Organization = {
  id: string
  name: string
  address: string
}

export type Branch = {
  id: string
  organization_id: string
  state_id: string
  city_id: string
  district_id: string
  name: string
}

export type Channel = {
  id: string
  organization_id: string
  name: string
  channel_type: string
  status: string
  linking_code: string | null
  telegram_chat_id: number | null
  telegram_user_id: number | null
  telegram_username: string | null
  telegram_first_name: string | null
  telegram_last_name: string | null
  connected_at: string | null
}

export type LocationOption = {
  id: string
  name: string
}

export type AccessState = {
  authUser: Awaited<ReturnType<typeof getSessionUser>>
  profile: UserProfile | null
  membership: UserOrganization | null
  organization: Organization | null
  branch: Branch | null
  telegramChannel: Channel | null
}

async function getAccessStateForUserId(userId: string, authUser: Awaited<ReturnType<typeof getSessionUser>>): Promise<AccessState> {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle<UserProfile>()

  if (profileError) {
    throw profileError
  }

  const activeMembershipResult = await supabaseAdmin
    .from('user_organizations')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle<UserOrganization>()

  if (activeMembershipResult.error) {
    throw activeMembershipResult.error
  }

  const fallbackMembershipResult = activeMembershipResult.data
    ? { data: null, error: null }
    : await supabaseAdmin
        .from('user_organizations')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle<UserOrganization>()

  if (fallbackMembershipResult.error) {
    throw fallbackMembershipResult.error
  }

  const membership = activeMembershipResult.data ?? fallbackMembershipResult.data ?? null

  if (!membership) {
    return {
      authUser,
      profile,
      membership: null,
      organization: null,
      branch: null,
      telegramChannel: null,
    }
  }

  const [organizationResult, branchResult, channelResult] = await Promise.all([
    supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', membership.organization_id)
      .maybeSingle<Organization>(),
    supabaseAdmin
      .from('branches')
      .select('*')
      .eq('organization_id', membership.organization_id)
      .order('name')
      .limit(1)
      .maybeSingle<Branch>(),
    supabaseAdmin
      .from('channels')
      .select('*')
      .eq('organization_id', membership.organization_id)
      .eq('channel_type', 'telegram')
      .order('connected_at', { ascending: false })
      .limit(1)
      .maybeSingle<Channel>(),
  ])

  if (organizationResult.error) throw organizationResult.error
  if (branchResult.error) throw branchResult.error
  if (channelResult.error) throw channelResult.error

  return {
    authUser,
    profile,
    membership,
    organization: organizationResult.data,
    branch: branchResult.data,
    telegramChannel: channelResult.data,
  }
}

export const getAccessState = cache(async (): Promise<AccessState> => {
  const authUser = await getSessionUser()

  if (!authUser) {
    return {
      authUser: null,
      profile: null,
      membership: null,
      organization: null,
      branch: null,
      telegramChannel: null,
    }
  }

  return getAccessStateForUserId(authUser.id, authUser)
})

export async function getPostAuthDestination() {
  const access = await getAccessState()

  if (!access.authUser) {
    return '/login'
  }

  if (!access.membership || !access.organization || !access.branch) {
    return '/onboarding/organization'
  }

  return '/dashboard'
}

export async function getPostAuthDestinationForUserId(userId: string) {
  const access = await getAccessStateForUserId(userId, {
    id: userId,
  } as Awaited<ReturnType<typeof getSessionUser>>)

  if (!access.membership || !access.organization || !access.branch) {
    return '/onboarding/organization'
  }

  return '/dashboard'
}

export async function getLocationCatalog(input?: {
  stateId?: string | null
  cityId?: string | null
}) {
  const [statesResult, citiesResult, districtsResult] = await Promise.all([
    supabaseAdmin.from('states').select('id,name').order('name').returns<LocationOption[]>(),
    input?.stateId
      ? supabaseAdmin
          .from('cities')
          .select('id,name')
          .eq('state_id', input.stateId)
          .order('name')
          .returns<LocationOption[]>()
      : Promise.resolve({ data: [], error: null } as { data: LocationOption[]; error: null }),
    input?.cityId
      ? supabaseAdmin
          .from('districts')
          .select('id,name')
          .eq('city_id', input.cityId)
          .order('name')
          .returns<LocationOption[]>()
      : Promise.resolve({ data: [], error: null } as { data: LocationOption[]; error: null }),
  ])

  if (statesResult.error) throw statesResult.error
  if (citiesResult.error) throw citiesResult.error
  if (districtsResult.error) throw districtsResult.error

  return {
    states: statesResult.data ?? [],
    cities: citiesResult.data ?? [],
    districts: districtsResult.data ?? [],
  }
}
