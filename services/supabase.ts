import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseServer = createClient(supabaseUrl, supabaseKey)

export async function getNegocioId(client: any, userId: string) {
  const { data } = await client
    .from('negocios')
    .select('id, nombre')
    .eq('user_id', userId)
    .single()

  return data
}