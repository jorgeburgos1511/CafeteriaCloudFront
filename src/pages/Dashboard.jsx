import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import grafica from '../assets/images/grafica.jpg'
import { getDashboard } from '../api/dashboardApi'

function Dashboard() {
  const [metricas, setMetricas] = useState({
    pedidos_hoy: 0,
    en_preparacion: 0,
    listos: 0,
    total_clientes: 0,
    ordenes_completadas: 0,
    actividad_reciente: [],
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
          <h2 className="mb-4 text-xl font-bold text-slate-800">Resumen operativo</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <img
              src={grafica}
              alt="Gráfica de resumen operativo"
              className="h-64 w-full object-cover"
            />
          </div>
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
