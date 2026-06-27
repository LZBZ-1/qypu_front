'use client'

import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSupabaseRealtime(
  table: string,
  onInsert: (payload: any) => void,
  onUpdate?: (payload: any) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes' as any, { event: 'INSERT', schema: 'public', table }, onInsert)
      .on('postgres_changes' as any, { event: 'UPDATE', schema: 'public', table }, onUpdate ?? (() => {}))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [table])
}