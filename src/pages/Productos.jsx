import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { getProductos, createProducto } from '../api/productosApi'

function Productos() {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('Bebida')
  const [precio, setPrecio] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false))
  }, [])

  const crearProducto = async () => {
    if (!nombre || !precio) return
    try {
      const nuevo = await createProducto({ nombre, categoria, precio })
      setProductos([nuevo, ...productos])
      setNombre('')
      setCategoria('Bebida')
      setPrecio('')
    } catch (e) {
      alert(e.message)
    }
  }

  const productosFiltrados =
    filtro === 'Todos'
      ? productos
      : productos.filter((p) => p.category === filtro)

  return (
    <MainLayout>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">Productos</h1>

      <div className="mb-8 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded border p-2 md:w-1/4"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full rounded border p-2 md:w-1/5"
        >
          <option value="Bebida">Bebida</option>
          <option value="Comida">Comida</option>
        </select>

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full rounded border p-2 md:w-1/5"
        />

        <button
          onClick={crearProducto}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Agregar producto
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['Todos', 'Bebida', 'Comida'].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`rounded px-3 py-1 ${
              filtro === tipo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="overflow-hidden rounded-xl bg-white shadow">
              <div className="flex h-48 items-center justify-center bg-slate-200 text-slate-500">
                {producto.category}
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-slate-800">{producto.name}</h2>

                <p className="mt-2 text-sm text-slate-500">
                  Categoría: {producto.category}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Disponible: {producto.available ? 'Sí' : 'No'}
                </p>

                <p className="mt-3 text-lg font-semibold text-green-700">
                  ${producto.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}

export default Productos
