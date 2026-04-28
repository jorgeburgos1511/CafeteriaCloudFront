import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { clientesIniciales } from '../data/clientes'

function Clientes() {
  const [clientes, setClientes] = useState(clientesIniciales)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const crearCliente = () => {
    if (!nombre || !correo || !telefono) return

    const nuevoCliente = {
      id: Date.now(),
      nombre,
      correo,
      telefono,
    }

    setClientes([nuevoCliente, ...clientes])
    setNombre('')
    setCorreo('')
    setTelefono('')
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = busqueda.toLowerCase()
    return (
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.correo.toLowerCase().includes(texto)
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

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
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

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-200 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Teléfono</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="border-t">
                <td className="p-3">{cliente.id}</td>
                <td className="p-3">{cliente.nombre}</td>
                <td className="p-3">{cliente.correo}</td>
                <td className="p-3">{cliente.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}

export default Clientes