import MainLayout from '../layouts/MainLayout'
import grafica from '../assets/images/grafica.jpg'

function Dashboard() {
  const pedidosResumen = [
    { titulo: 'Pedidos hoy', valor: 24 },
    { titulo: 'En preparación', valor: 8 },
    { titulo: 'Listos para entregar', valor: 5 },
    { titulo: 'Clientes registrados', valor: 42 },
  ]

  const actividadReciente = [
    'Pedido #1024 cambió a En preparación',
    'Nuevo cliente registrado: María López',
    'Producto agregado: Panini',
    'Pedido #1021 entregado',
  ]

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard Cafetería
        </h1>
        <p className="mt-2 text-slate-600">
          Panel principal del sistema de pedidos.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pedidosResumen.map((item) => (
          <div key={item.titulo} className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-slate-500">{item.titulo}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-800">
              {item.valor}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow xl:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Resumen operativo
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-slate-500">Ventas estimadas</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">$1,850</p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4">
              <p className="text-sm text-slate-500">Productos con poco stock</p>
              <p className="mt-2 text-2xl font-bold text-yellow-700">3</p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-slate-500">Órdenes completadas</p>
              <p className="mt-2 text-2xl font-bold text-green-700">16</p>
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
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Actividad reciente
          </h2>

          <div className="space-y-3">
            {actividadReciente.map((actividad, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600"
              >
                {actividad}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard