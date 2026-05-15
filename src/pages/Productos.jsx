import { useEffect, useRef, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getProductos, createProducto, uploadImageProducto, deleteProducto, updateProducto } from '../api/productosApi'

function CambiarImagenBtn({ productoId, onActualizado }) {
  const ref = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    try {
      const actualizado = await uploadImageProducto(productoId, file)
      onActualizado(actualizado)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
      ref.current.value = ''
    }
  }

  return (
    <>
      <input ref={ref} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      <button
        onClick={() => ref.current.click()}
        disabled={loading}
        className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
      >
        {loading ? 'Subiendo...' : '📷 Cambiar imagen'}
      </button>
    </>
  )
}

const CAT_STYLE = {
  Bebida: 'bg-blue-100 text-blue-700',
  Comida: 'bg-amber-100 text-amber-700',
}

function ProductoCard({ producto, onActualizado, onEliminar }) {
  const [editandoPrecio, setEditandoPrecio] = useState(false)
  const [nuevoPrecio, setNuevoPrecio] = useState(String(producto.price))
  const [guardando, setGuardando] = useState(false)
  const precioRef = useRef(null)

  const guardarPrecio = async () => {
    const val = parseFloat(nuevoPrecio)
    if (isNaN(val) || val <= 0) {
      setNuevoPrecio(String(producto.price))
      setEditandoPrecio(false)
      return
    }
    if (val === producto.price) {
      setEditandoPrecio(false)
      return
    }
    setGuardando(true)
    try {
      const actualizado = await updateProducto(producto.id, {
        name: producto.name,
        price: val,
        category: producto.category,
        available: producto.available,
      })
      onActualizado(actualizado)
    } catch (e) {
      alert(e.message)
      setNuevoPrecio(String(producto.price))
    } finally {
      setGuardando(false)
      setEditandoPrecio(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all group">
      {producto.image_url ? (
        <img
          src={producto.image_url}
          alt={producto.name}
          className="h-44 w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      ) : (
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-slate-300">
          <span className="text-5xl">
            {producto.category === 'Bebida' ? '🥤' : '🍽'}
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-base font-bold text-slate-800 leading-tight">{producto.name}</h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                CAT_STYLE[producto.category] ?? 'bg-slate-100 text-slate-600'
              }`}
            >
              {producto.category}
            </span>
            <button
              onClick={() => onEliminar(producto)}
              title="Eliminar producto"
              className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
            >
              🗑
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          {editandoPrecio ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-amber-600">$</span>
              <input
                ref={precioRef}
                type="number"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                onBlur={guardarPrecio}
                onKeyDown={(e) => { if (e.key === 'Enter') precioRef.current.blur() }}
                disabled={guardando}
                autoFocus
                className="w-20 rounded border border-amber-400 px-2 py-0.5 text-sm font-bold text-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          ) : (
            <button
              onClick={() => { setNuevoPrecio(String(producto.price)); setEditandoPrecio(true) }}
              title="Editar precio"
              className="text-xl font-bold text-amber-600 hover:underline hover:text-amber-700 transition-colors"
            >
              ${producto.price}
            </button>
          )}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              producto.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {producto.available ? '● Disponible' : '● No disponible'}
          </span>
        </div>

        <CambiarImagenBtn productoId={producto.id} onActualizado={onActualizado} />
      </div>
    </div>
  )
}

function Productos() {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('Bebida')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState(null)
  const [filtro, setFiltro] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false))
  }, [])

  const actualizarProducto = (actualizado) => {
    setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)))
  }

  const eliminarProducto = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.name}" del menú?`)) return
    try {
      await deleteProducto(producto.id)
      setProductos((prev) => prev.filter((p) => p.id !== producto.id))
    } catch (e) {
      alert(e.message)
    }
  }

  const crearProducto = async () => {
    if (!nombre || !precio) return
    try {
      const nuevo = await createProducto({ nombre, categoria, precio })
      if (imagen) {
        try {
          const actualizado = await uploadImageProducto(nuevo.id, imagen)
          setProductos((prev) => [actualizado, ...prev])
        } catch {
          setProductos((prev) => [nuevo, ...prev])
        }
      } else {
        setProductos((prev) => [nuevo, ...prev])
      }
      setNombre('')
      setCategoria('Bebida')
      setPrecio('')
      setImagen(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (e) {
      alert(e.message)
    }
  }

  const productosFiltrados =
    filtro === 'Todos' ? productos : productos.filter((p) => p.category === filtro)

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestiona el menú de la cafetería</p>
        </div>
        <span className="text-sm text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Formulario */}
      <div className="mb-8 rounded-xl bg-white p-5 shadow-sm border border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Agregar producto
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
            <label className="text-xs font-medium text-slate-500">Nombre</label>
            <input
              type="text"
              placeholder="Ej. Café latte"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="Bebida">Bebida</option>
              <option value="Comida">Comida</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Precio ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="text-xs font-medium text-slate-500">Imagen (opcional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0] || null)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-0.5 file:text-xs"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={crearProducto}
              disabled={!nombre || !precio}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition-colors shadow-sm"
            >
              + Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['Todos', 'Bebida', 'Comida'].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filtro === tipo
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700'
            }`}
          >
            {tipo === 'Bebida' ? '🥤 ' : tipo === 'Comida' ? '🍽 ' : ''}
            {tipo}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 py-8">
          <span className="animate-spin text-xl">⟳</span>
          Cargando productos...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-3">⚠️</span>
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-slate-400 text-sm mt-1">Verifica que el backend esté corriendo</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-5xl mb-3">🍽</span>
          <p className="text-slate-500 font-medium">No hay productos en esta categoría</p>
          <p className="text-slate-400 text-sm mt-1">Agrega el primero con el formulario de arriba</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onActualizado={actualizarProducto}
              onEliminar={eliminarProducto}
            />
          ))}
        </div>
      )}
    </MainLayout>
  )
}

export default Productos
