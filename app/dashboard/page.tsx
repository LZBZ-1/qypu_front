import KpiGrid        from '@/components/dashboard/KpiGrid'
import SalesChart     from '@/components/dashboard/SalesChart'
import DonutChart     from '@/components/dashboard/DonutChart'
import InventoryTable from '@/components/dashboard/InventoryTable'
import CajaBalance    from '@/components/dashboard/CajaBalance'

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: 12, color: '#52525B', marginTop: 3 }}>Bodega La Esperanza · Hoy</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Hoy', 'Semana', 'Mes'].map((c, i) => (
            <button key={c}
              style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11.5, border: '1px solid rgba(255,255,255,0.12)', background: i === 0 ? '#7C3AED' : 'transparent', color: i === 0 ? '#fff' : '#A1A1AA', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <KpiGrid />

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <SalesChart />
        <DonutChart />
      </div>

      {/* Tabla + Caja */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InventoryTable />
        <CajaBalance />
      </div>
    </>
  )
}