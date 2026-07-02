import type { ComponentProps } from 'react'

import CajaBalance from '@/components/dashboard/CajaBalance'
import DonutChart from '@/components/dashboard/DonutChart'
import InventoryTable from '@/components/dashboard/InventoryTable'
import KpiGrid from '@/components/dashboard/KpiGrid'
import SalesChart from '@/components/dashboard/SalesChart'
import { getCashOverview, getInventoryOverview, getSalesOverview } from '@/lib/appData'
import { formatCurrency } from '@/lib/formatters'

export default async function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10)
  const [inventory, sales, cash] = await Promise.all([
    getInventoryOverview(),
    getSalesOverview({ from: today, to: today }),
    getCashOverview({ from: today }),
  ])

  const organizationName = inventory.context?.organization?.name ?? 'Sin organizacion'
  const branchName = inventory.context?.branch?.name ?? 'Sin sucursal'
  const kpis: ComponentProps<typeof KpiGrid>['items'] = [
    {
      icon: 'banknote',
      label: 'Ventas del dia',
      value: formatCurrency(sales.summary.total),
      delta: sales.summary.count ? `${sales.summary.count} transaccion(es)` : 'Sin ventas registradas',
      deltaType: sales.summary.count ? ('up' as const) : ('warn' as const),
    },
    {
      icon: 'shopping-bag',
      label: 'Egresos del dia',
      value: formatCurrency(cash.egresos),
      delta: cash.egresos ? 'Con movimientos registrados' : 'Sin egresos registrados',
      deltaType: cash.egresos ? ('down' as const) : ('warn' as const),
    },
    {
      icon: 'wallet',
      label: 'Balance caja',
      value: formatCurrency(cash.balance),
      delta: cash.balance >= 0 ? 'Balance positivo' : 'Balance negativo',
      deltaType: cash.balance >= 0 ? ('up' as const) : ('down' as const),
    },
    {
      icon: 'package',
      label: 'Productos',
      value: String(inventory.summary.totalProducts),
      delta: inventory.summary.agotados
        ? `${inventory.summary.agotados} agotado(s)`
        : 'Sin productos agotados',
      deltaType: inventory.summary.agotados ? ('warn' as const) : ('up' as const),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>
            {organizationName} - {branchName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Hoy', 'Semana', 'Mes'].map((chip, index) => (
            <button
              key={chip}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 11.5,
                border: '1px solid #CFE9E3',
                background: index === 0 ? '#008772' : '#FFFFFF',
                color: index === 0 ? '#FFFFFF' : '#34566C',
                cursor: 'pointer',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <KpiGrid items={kpis} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <SalesChart points={sales.hourly} />
        <DonutChart items={sales.categoryTotals} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InventoryTable
          products={inventory.items.slice(0, 5).map((item) => ({
            name: item.name,
            quantity: item.quantity,
            categoryName: item.categoryName,
          }))}
          totalProducts={inventory.summary.totalProducts}
          agotados={inventory.summary.agotados}
        />
        <CajaBalance
          ingresos={cash.ingresos}
          egresos={cash.egresos}
          balance={cash.balance}
          weekBalance={cash.weekBalance}
          movimientos={cash.movimientos}
        />
      </div>
    </>
  )
}
