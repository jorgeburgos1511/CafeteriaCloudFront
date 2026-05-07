import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getClientes, createCliente } from '../api/clientesApi'

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

  const clientesFiltrados = clientes.filter((c) => {
    const texto = busqueda.toLowerCase()
    return (
      c.name.toLowerCase().includes(texto) ||
      c.email.toLowerCase().includes(texto)
    )
  })

  return (
    <MainLayout>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">Clientes</h1>

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded border p-2 md:w-1/4"
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full rounded border p-2 md:w-1/4"
        />

        <button
          onClick={crearCliente}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Agregar cliente
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded border bg-white p-3 shadow md:w-1/2"
        />
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando clientes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-slate-200 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="border-t">
                  <td className="p-3 text-xs text-slate-400">{cliente.id}</td>
                  <td className="p-3">{cliente.name}</td>
                  <td className="p-3">{cliente.email}</td>
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
