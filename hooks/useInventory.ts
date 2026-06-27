'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Product } from '../types/inventory'

const NEGOCIO_ID = process.env.NEXT_PUBLIC_NEGOCIO_ID ?? ''

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('inventario')
        .select('*')
        .eq('negocio_id', NEGOCIO_ID)
        .order('nombre')

      setProducts(data ?? [])
      setIsLoading(false)
    }

    load()

    const channel = supabase
      .channel('inventario-changes')
      .on('postgres_changes' as any, {
        event: '*', schema: 'public', table: 'inventario'
      }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { products, isLoading }
}