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

const CARDS = [
  {
    key: 'pedidos_hoy',
    titulo: 'Pedidos hoy',
    icon: '📦',
    border: 'border-blue-400',
    iconBg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    key: 'en_preparacion',
    titulo: 'En preparación',
    icon: '🍳',
    border: 'border-amber-400',
    iconBg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    key: 'listos',
    titulo: 'Listos para entregar',
    icon: '✅',
    border: 'border-green-400',
    iconBg: 'bg-green-50',
    color: 'text-green-600',
  },
  {
    key: 'total_clientes',
    titulo: 'Clientes registrados',
    icon: '👥',
    border: 'border-purple-400',
    iconBg: 'bg-purple-50',
    color: 'text-purple-600',
  },
]

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

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-slate-500 text-sm">Resumen del sistema de pedidos de la cafetería.</p>
      </div>

      {/* Metric cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ key, titulo, icon, border, iconBg, color }) => (
          <div
            key={key}
            className={`rounded-xl bg-white p-5 shadow-sm border-t-4 ${border} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">{titulo}</p>
              <span className={`text-xl p-2 rounded-lg ${iconBg}`}>{icon}</span>
            </div>
            <p className={`text-3xl font-bold ${color}`}>{metricas[key]}</p>
          </div>
        ))}
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-1 text-lg font-bold text-slate-800">Pedidos — últimos 7 días</h2>
          <p className="text-xs text-slate-400 mb-5">Histórico diario de pedidos registrados</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-green-50 border border-green-100 p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Órdenes completadas</p>
              <p className="text-2xl font-bold text-green-700">{metricas.ordenes_completadas}</p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Clientes registrados</p>
              <p className="text-2xl font-bold text-blue-700">{metricas.total_clientes}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={metricas.pedidos_por_dia}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(v) => [v, 'Pedidos']}
              />
              <Bar dataKey="pedidos" fill="#f59e0b" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-slate-800">Actividad reciente</h2>
          <p className="text-xs text-slate-400 mb-4">Últimos 5 pedidos registrados</p>
          <div className="space-y-2.5">
            {metricas.actividad_reciente.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-slate-400">
                <span className="text-4xl mb-2">📭</span>
                <p className="text-sm">Sin actividad registrada</p>
              </div>
            ) : (
              metricas.actividad_reciente.map((actividad, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
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
