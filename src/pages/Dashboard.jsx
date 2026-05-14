import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getDashboard } from '../api/dashboardApi'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function Dashboard() {
  const [metricas, setMetricas] = useState({
    pedidos_hoy: 0,
    en_preparacion: 0,
    listos: 0,
    total_clientes: 0,
    ordenes_completadas: 0,
    actividad_reciente: [],
    pedidos_por_dia: [],
  })

  useEffect(() => {
    getDashboard()
      .then(setMetricas)
      .catch(() => {})
  }, [])

  const pedidosResumen = [
    { titulo: 'Pedidos hoy', valor: metricas.pedidos_hoy },
    { titulo: 'En preparación', valor: metricas.en_preparacion },
    { titulo: 'Listos para entregar', valor: metricas.listos },
    { titulo: 'Clientes registrados', valor: metricas.total_clientes },
  ]

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Cafetería</h1>
        <p className="mt-2 text-slate-600">Panel principal del sistema de pedidos.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pedidosResumen.map((item) => (
          <div key={item.titulo} className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-slate-500">{item.titulo}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">{item.valor}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow xl:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Pedidos últimos 7 días</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-slate-500">Órdenes completadas</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {metricas.ordenes_completadas}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-slate-500">Clientes registrados</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">
                {metricas.total_clientes}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metricas.pedidos_por_dia} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v) => [v, 'Pedidos']}
              />
              <Bar dataKey="pedidos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Actividad reciente</h2>
          <div className="space-y-3">
            {metricas.actividad_reciente.length === 0 ? (
              <p className="text-sm text-slate-400">Sin actividad registrada</p>
            ) : (
              metricas.actividad_reciente.map((actividad, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600"
                >
                  {actividad}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
