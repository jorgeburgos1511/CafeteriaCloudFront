import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getPedidos, createPedido, avanzarEstado } from '../api/pedidosApi'
import { getClientes } from '../api/clientesApi'
import { getProductos } from '../api/productosApi'

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [clienteSeleccionado, setClienteSeleccionado] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getPedidos(), getClientes(), getProductos()])
      .then(([pedidosData, clientesData, productosData]) => {
        setPedidos(pedidosData)
        setClientes(clientesData)
        setProductos(productosData.filter((p) => p.available))
      })
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [])

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Recibido': return 'bg-gray-200 text-gray-800'
      case 'En preparación': return 'bg-yellow-200 text-yellow-800'
      case 'Listo': return 'bg-green-200 text-green-800'
      case 'Entregado': return 'bg-blue-200 text-blue-800'
      case 'Cancelado': return 'bg-red-200 text-red-800'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleAvanzar = async (id) => {
    try {
      await avanzarEstado(id)
      const data = await getPedidos()
      setPedidos(data)
    } catch {
      alert('Error al actualizar estado')
    }
  }

  const crearPedido = async () => {
    if (!clienteSeleccionado || !productoSeleccionado) return
    try {
      const nuevo = await createPedido({ cliente: clienteSeleccionado, producto: productoSeleccionado })
      setPedidos([nuevo, ...pedidos])
      setClienteSeleccionado('')
      setProductoSeleccionado('')
    } catch (e) {
      alert(e.message)
    }
  }

  const pedidosFiltrados =
    filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  if (loading) return <MainLayout><p>Cargando pedidos...</p></MainLayout>
  if (error) return <MainLayout><p className="text-red-500">{error}</p></MainLayout>

  return (
    <MainLayout>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">Pedidos</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <select
          value={clienteSeleccionado}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
          className="w-full rounded border p-2 md:w-1/3"
        >
          <option value="">Seleccionar cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          className="w-full rounded border p-2 md:w-1/3"
        >
          <option value="">Seleccionar producto...</option>
          {productos.map((p) => (
            <option key={p.id} value={p.name}>{p.name} — ${p.price}</option>
          ))}
        </select>

        <button
          onClick={crearPedido}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Crear Pedido
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['Todos', 'Recibido', 'En preparación', 'Listo', 'Entregado'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`rounded px-3 py-1 ${
              filtro === estado ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-200 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id} className="border-t">
                <td className="p-3 text-xs text-slate-400">{pedido.id}</td>
                <td className="p-3">{pedido.cliente}</td>
                <td className="p-3">{pedido.producto}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleAvanzar(pedido.id)}
                    disabled={pedido.estado === 'Entregado' || pedido.estado === 'Cancelado'}
                    className={`rounded px-3 py-1 text-white ${
                      pedido.estado === 'Entregado' || pedido.estado === 'Cancelado'
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Avanzar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  )
}

export default Pedidos
