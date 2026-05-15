import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getClientes, createCliente, deleteCliente } from '../api/clientesApi'

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  const colors = [
    'bg-amber-500', 'bg-blue-500', 'bg-purple-500',
    'bg-green-500', 'bg-rose-500', 'bg-teal-500',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]

  return (
    <div className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch(() => setError('Error al cargar clientes'))
      .finally(() => setLoading(false))
  }, [])

  const crearCliente = async () => {
    if (!nombre || !correo) return
    try {
      const nuevo = await createCliente({ nombre, correo })
      setClientes([nuevo, ...clientes])
      setNombre('')
      setCorreo('')
    } catch (e) {
      alert(e.message)
    }
  }

  const eliminarCliente = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return
    try {
      await deleteCliente(id)
      setClientes(clientes.filter((c) => c.id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  const clientesFiltrados = clientes.filter((c) => {
    const texto = busqueda.toLowerCase()
    return c.name.toLowerCase().includes(texto) || c.email.toLowerCase().includes(texto)
  })

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestiona los clientes registrados</p>
        </div>
        <span className="text-sm text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Formulario */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Registrar cliente
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="text-xs font-medium text-slate-500">Nombre completo</label>
            <input
              type="text"
              placeholder="Ej. María García"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
            <label className="text-xs font-medium text-slate-500">Correo electrónico</label>
            <input
              type="email"
              placeholder="Ej. maria@iteso.mx"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={crearCliente}
              disabled={!nombre || !correo}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors shadow-sm"
            >
              + Registrar
            </button>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-5 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 md:w-1/2"
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-8">
          <span className="animate-spin text-xl">⟳</span>
          Cargando clientes...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-3">⚠️</span>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : clientesFiltrados.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-3">👥</span>
          <p className="text-slate-500 font-medium">
            {busqueda ? 'Sin resultados para esa búsqueda' : 'No hay clientes registrados'}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {busqueda ? 'Intenta con otro término' : 'Registra el primero con el formulario de arriba'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  SNS
                </th>
                <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente, idx) => (
                <tr
                  key={cliente.id}
                  className={`border-t border-slate-50 hover:bg-amber-50/40 transition-colors ${
                    idx % 2 === 0 ? '' : 'bg-slate-50/40'
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={cliente.name} />
                      <span className="font-medium text-slate-800 text-sm">{cliente.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{cliente.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        cliente.sns_topic_arn
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cliente.sns_topic_arn ? '● Activo' : '○ Sin SNS'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => eliminarCliente(cliente.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  )
}

export default Clientes
