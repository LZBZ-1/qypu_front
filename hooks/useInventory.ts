'use client'

import { useEffect, useState } from 'react'

import { Product } from '@/types/inventory'

type InventoryItemResponse = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  updatedAt: string | null
}

type InventoryResponse = {
  context?: {
    organization?: {
      id: string
    } | null
  } | null
  items?: InventoryItemResponse[]
}

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)

      try {
        const response = await fetch('/api/inventario')
        const payload = (await response.json()) as InventoryResponse
        setProducts(
          (payload.items ?? []).map((item) => ({
            id: item.productId,
            negocio_id: payload.context?.organization?.id ?? '',
            nombre: item.name,
            cantidad: item.quantity,
            precio_venta: item.unitPrice,
            precio_costo: 0,
            unidad: 'unidad',
            stock_minimo: 0,
            updated_at: item.updatedAt ?? new Date().toISOString(),
          }))
        )
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  return { products, isLoading }
}
