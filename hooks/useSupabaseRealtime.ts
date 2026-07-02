'use client'

import { useEffect } from 'react'
import type {
  RealtimePostgresChangesPayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/realtime-js'
import { supabase } from '../lib/supabaseClient'

type RealtimeRow = Record<string, unknown>
type RealtimePayload = RealtimePostgresChangesPayload<RealtimeRow>

export function useSupabaseRealtime(
  table: string,
  onInsert: (payload: RealtimePostgresInsertPayload<RealtimeRow>) => void,
  onUpdate?: (payload: RealtimePostgresUpdatePayload<RealtimeRow>) => void
) {
  useEffect(() => {
    const handleUpdate = onUpdate ?? (() => {})
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload: RealtimePayload) => {
        onInsert(payload as RealtimePostgresInsertPayload<RealtimeRow>)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload: RealtimePayload) => {
        handleUpdate(payload as RealtimePostgresUpdatePayload<RealtimeRow>)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [onInsert, onUpdate, table])
}
