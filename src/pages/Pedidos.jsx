import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import {
  getPedidos,
  createPedido,
  addItemToPedido,
  removeItemFromPedido,
  confirmarPedido,
  avanzarItem,
  finalizarPedido,
  cancelarPedido,
} from '../api/pedidosApi'
import { getClientes } from '../api/clientesApi'
import { getProductos } from '../api/productosApi'

const ESTADOS_ITEM = ['Recibido', 'En preparación', 'Listo', 'Entregado']

const colorItem = (estado) => {
  switch (estado) {
    case 'Recibido': return 'bg-gray-200 text-gray-800'
    case 'En preparación': return 'bg-yellow-200 text-yellow-800'
    case 'Listo': return 'bg-green-200 text-green-800'
    case 'Entregado': return 'bg-blue-200 text-blue-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const colorPedido = (estado) => {
  switch (estado) {
    case 'Abierto': return 'bg-orange-100 text-orange-800'
    case 'Confirmado': return 'bg-yellow-100 text-yellow-800'
    case 'Finalizado': return 'bg-green-100 text-green-800'
    case 'Cancelado': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function NuevoPedidoModal({ clientes, productos, onClose, onCreado }) {
  const [clienteId, setClienteId] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(false)

  const clienteActual = clientes.find((c) => c.id === clienteId)

  const iniciarPedido = async () => {
    if (!clienteActual) return
    setLoading(true)
    try {
      const nuevo = await createPedido({
        cliente_nombre: clienteActual.name,
        cliente_email: clienteActual.email,
      })
      setPedido(nuevo)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const agregarProducto = async () => {
    if (!pedido || !productoSeleccionado) return
    setLoading(true)
    try {
      const actualizado = await addItemToPedido(pedido.id, productoSeleccionado)
      setPedido(actualizado)
      setProductoSeleccionado('')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const quitarProducto = async (itemId) => {
    if (!pedido) return
    setLoading(true)
    try {
      const actualizado = await removeItemFromPedido(pedido.id, itemId)
      setPedido(actualizado)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmar = async () => {
    if (!pedido || pedido.items.length === 0) return
    setLoading(true)
    try {
      const confirmado = await confirmarPedido(pedido.id)
      onCreado(confirmado)
      onClose()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Nuevo Pedido</h2>

        {!pedido ? (
          <div className="space-y-3">
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.email}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={iniciarPedido}
                disabled={!clienteId || loading}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                Iniciar pedido
              </button>
              <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 text-gray-700">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Cliente: <span className="font-medium text-slate-800">{pedido.cliente_nombre}</span>
            </p>

            <div className="flex gap-2">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="flex-1 rounded border p-2"
              >
                <option value="">Agregar producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price}
                  </option>
                ))}
              </select>
              <button
                onClick={agregarProducto}
                disabled={!productoSeleccionado || loading}
                className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                +
              </button>
            </div>

            {pedido.items.length > 0 ? (
              <div className="rounded border">
                {pedido.items.map((item) => (
                  <div key={item.item_id} className="flex items-center justify-between border-b p-2 last:border-b-0">
                    <span className="text-sm">{item.producto_nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-700">${item.precio.toFixed(2)}</span>
                      <button
                        onClick={() => quitarProducto(item.item_id)}
                        disabled={loading}
                        className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 hover:bg-red-200"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end p-2 font-semibold text-slate-800">
                  Total: ${pedido.total.toFixed(2)}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Sin productos aún</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={confirmar}
                disabled={pedido.items.length === 0 || loading}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                Confirmar pedido
              </button>
              <button
                onClick={async () => {
                  try { await cancelarPedido(pedido.id) } catch {}
                  onClose()
                }}
                disabled={loading}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Cancelar pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PedidoCard({ pedido, onActualizado }) {
  const [loading, setLoading] = useState(false)

  const todosEntregados =
    pedido.items.length > 0 && pedido.items.every((i) => i.estado === 'Entregado')

  const handleAvanzarItem = async (itemId) => {
    setLoading(true)
    try {
      const actualizado = await avanzarItem(pedido.id, itemId)
      onActualizado(actualizado)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizar = async () => {
    setLoading(true)
    try {
      const finalizado = await finalizarPedido(pedido.id)
      onActualizado(finalizado)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = async () => {
    if (!confirm('¿Cancelar este pedido?')) return
    setLoading(true)
    try {
      const cancelado = await cancelarPedido(pedido.id)
      onActualizado(cancelado)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl bg-white shadow overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-slate-50">
        <div>
          <p className="font-semibold text-slate-800">{pedido.cliente_nombre}</p>
          <p className="text-xs text-slate-400">{pedido.cliente_email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${colorPedido(pedido.estado)}`}>
            {pedido.estado}
          </span>
          <span className="text-sm font-semibold text-green-700">${pedido.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-4">
        {pedido.items.length === 0 ? (
          <p className="text-sm text-slate-400">Sin productos</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="pb-2">Producto</th>
                <th className="pb-2">Precio</th>
                <th className="pb-2">Estado</th>
                {pedido.estado === 'Confirmado' && <th className="pb-2"></th>}
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item) => (
                <tr key={item.item_id} className="border-t">
                  <td className="py-1.5">{item.producto_nombre}</td>
                  <td className="py-1.5 text-green-700">${item.precio.toFixed(2)}</td>
                  <td className="py-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorItem(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>
                  {pedido.estado === 'Confirmado' && (
                    <td className="py-1.5">
                      {item.estado !== 'Entregado' && (
                        <button
                          onClick={() => handleAvanzarItem(item.item_id)}
                          disabled={loading}
                          className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          Avanzar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(pedido.estado === 'Confirmado' || pedido.estado === 'Abierto') && (
        <div className="flex gap-2 border-t p-4">
          {pedido.estado === 'Confirmado' && todosEntregados && (
            <button
              onClick={handleFinalizar}
              disabled={loading}
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              Finalizar pedido
            </button>
          )}
          <button
            onClick={handleCancelar}
            disabled={loading}
            className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:bg-gray-400"
          >
            Cancelar pedido
          </button>
        </div>
      )}
    </div>
  )
}

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [mostrarModal, setMostrarModal] = useState(false)
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

  const handleActualizado = (actualizado) => {
    setPedidos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)))
  }

  const handleCreado = (nuevo) => {
    setPedidos((prev) => [nuevo, ...prev])
  }

  const FILTROS = ['Todos', 'Abierto', 'Confirmado', 'Finalizado', 'Cancelado']
  const pedidosFiltrados =
    filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  if (loading) return <MainLayout><p>Cargando pedidos...</p></MainLayout>
  if (error) return <MainLayout><p className="text-red-500">{error}</p></MainLayout>

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Pedidos</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          + Nuevo Pedido
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTROS.map((estado) => (
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pedidosFiltrados.length === 0 ? (
          <p className="text-slate-400">No hay pedidos con ese filtro.</p>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} onActualizado={handleActualizado} />
          ))
        )}
      </div>

      {mostrarModal && (
        <NuevoPedidoModal
          clientes={clientes}
          productos={productos}
          onClose={() => setMostrarModal(false)}
          onCreado={handleCreado}
        />
      )}
    </MainLayout>
  )
}

export default Pedidos
