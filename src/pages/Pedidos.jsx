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
    case 'Recibido':      return 'bg-slate-100 text-slate-700'
    case 'En preparación': return 'bg-amber-100 text-amber-800'
    case 'Listo':         return 'bg-green-100 text-green-800'
    case 'Entregado':     return 'bg-blue-100 text-blue-800'
    default:              return 'bg-slate-100 text-slate-700'
  }
}

const colorPedido = (estado) => {
  switch (estado) {
    case 'Abierto':    return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Confirmado': return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'Finalizado': return 'bg-green-100 text-green-800 border-green-200'
    case 'Cancelado':  return 'bg-red-100 text-red-700 border-red-200'
    default:           return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

function PedidoModal({ clientes, productos, pedidoInicial, onClose, onActualizado, onCreado }) {
  const [clienteId, setClienteId] = useState('')
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [pedido, setPedido] = useState(pedidoInicial || null)
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
      onCreado(nuevo)
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
      onActualizado(actualizado)
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
      onActualizado(actualizado)
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
      onActualizado(confirmado)
      onClose()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelar = async () => {
    if (pedido) {
      try { await cancelarPedido(pedido.id); onActualizado({ ...pedido, estado: 'Cancelado' }) } catch {}
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            {pedido ? '📋 Editar Pedido' : '🆕 Nuevo Pedido'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
        </div>

        {!pedido ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Seleccionar cliente
              </label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">Elige un cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={iniciarPedido}
                disabled={!clienteId || loading}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors"
              >
                Iniciar pedido
              </button>
              <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-sm">
              <span className="text-slate-500">Cliente:</span>{' '}
              <span className="font-semibold text-slate-800">{pedido.cliente_nombre}</span>
            </div>

            <div className="flex gap-2">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">Agregar producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
                ))}
              </select>
              <button
                onClick={agregarProducto}
                disabled={!productoSeleccionado || loading}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors"
              >
                +
              </button>
            </div>

            {pedido.items.length > 0 ? (
              <div className="rounded-lg border border-slate-100 overflow-hidden">
                {pedido.items.map((item) => (
                  <div key={item.item_id} className="flex items-center justify-between border-b border-slate-50 last:border-b-0 px-3 py-2.5 hover:bg-slate-50">
                    <span className="text-sm font-medium text-slate-700">{item.producto_nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-600">${item.precio.toFixed(2)}</span>
                      <button
                        onClick={() => quitarProducto(item.item_id)}
                        disabled={loading}
                        className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-100 border border-red-100"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end bg-slate-50 px-3 py-2 font-bold text-slate-800 text-sm border-t border-slate-100">
                  Total: <span className="text-amber-600 ml-1">${pedido.total.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                <span className="text-3xl block mb-1">🛒</span>
                Sin productos aún
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={confirmar}
                disabled={pedido.items.length === 0 || loading}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors"
              >
                Confirmar pedido
              </button>
              <button
                onClick={cancelar}
                disabled={loading}
                className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 border border-red-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PedidoCard({ pedido, onActualizado, onEditar }) {
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
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{pedido.cliente_nombre}</p>
          <p className="text-xs text-slate-400 mt-0.5">{pedido.cliente_email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${colorPedido(pedido.estado)}`}>
            {pedido.estado}
          </span>
          <span className="text-sm font-bold text-amber-600">${pedido.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Items */}
      <div className="p-4">
        {pedido.items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">Sin productos</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 text-left">
                <th className="pb-2 font-semibold">Producto</th>
                <th className="pb-2 font-semibold">Precio</th>
                <th className="pb-2 font-semibold">Estado</th>
                {pedido.estado === 'Confirmado' && <th className="pb-2" />}
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item) => (
                <tr key={item.item_id} className="border-t border-slate-50">
                  <td className="py-1.5 font-medium text-slate-700">{item.producto_nombre}</td>
                  <td className="py-1.5 text-amber-600 font-semibold">${item.precio.toFixed(2)}</td>
                  <td className="py-1.5">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${colorItem(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>
                  {pedido.estado === 'Confirmado' && (
                    <td className="py-1.5 text-right">
                      {item.estado !== 'Entregado' && (
                        <button
                          onClick={() => handleAvanzarItem(item.item_id)}
                          disabled={loading}
                          className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 border border-blue-100 disabled:opacity-40"
                        >
                          Avanzar →
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

      {/* Actions */}
      {(pedido.estado === 'Confirmado' || pedido.estado === 'Abierto') && (
        <div className="flex gap-2 border-t border-slate-100 px-4 py-3 bg-slate-50">
          {pedido.estado === 'Abierto' && (
            <button
              onClick={() => onEditar(pedido)}
              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              ✏️ Editar
            </button>
          )}
          {pedido.estado === 'Confirmado' && todosEntregados && (
            <button
              onClick={handleFinalizar}
              disabled={loading}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40 transition-colors"
            >
              ✅ Finalizar
            </button>
          )}
          <button
            onClick={handleCancelar}
            disabled={loading}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 border border-red-100 disabled:opacity-40"
          >
            Cancelar
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
  const [modalPedido, setModalPedido] = useState(null)
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
    setPedidos((prev) => {
      if (prev.find((p) => p.id === nuevo.id)) return prev
      return [nuevo, ...prev]
    })
  }

  const abrirNuevo = () => { setModalPedido(null); setMostrarModal(true) }
  const abrirEditar = (pedido) => { setModalPedido(pedido); setMostrarModal(true) }
  const cerrarModal = () => { setMostrarModal(false); setModalPedido(null) }

  const FILTROS = ['Todos', 'Abierto', 'Confirmado', 'Finalizado', 'Cancelado']
  const pedidosFiltrados =
    filtro === 'Todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  if (loading) return <MainLayout><div className="flex items-center gap-3 text-slate-500 py-8"><span className="animate-spin text-xl">⟳</span> Cargando pedidos...</div></MainLayout>
  if (error) return <MainLayout><p className="text-red-500">{error}</p></MainLayout>

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pedidos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} en total</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors shadow-sm"
        >
          + Nuevo Pedido
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTROS.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filtro === estado
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pedidosFiltrados.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center py-16 text-center">
            <span className="text-5xl mb-3">📋</span>
            <p className="text-slate-500 font-medium">No hay pedidos con ese estado</p>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              onActualizado={handleActualizado}
              onEditar={abrirEditar}
            />
          ))
        )}
      </div>

      {mostrarModal && (
        <PedidoModal
          clientes={clientes}
          productos={productos}
          pedidoInicial={modalPedido}
          onClose={cerrarModal}
          onActualizado={handleActualizado}
          onCreado={handleCreado}
        />
      )}
    </MainLayout>
  )
}

export default Pedidos
