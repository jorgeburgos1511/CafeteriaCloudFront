import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import latte from '../assets/images/latte.jpg'
import capuccino from '../assets/images/capuccino.jpg'
import sandwich from '../assets/images/sandwich.jpg'
import panini from '../assets/images/panini.jpg'

const productosIniciales = [
  {
    id: 1,
    nombre: 'Café Latte',
    categoria: 'Bebida',
    precio: '$45',
    stock: 12,
    imagen: latte,
  },
  {
    id: 2,
    nombre: 'Capuccino',
    categoria: 'Bebida',
    precio: '$40',
    stock: 8,
    imagen: capuccino,
  },
  {
    id: 3,
    nombre: 'Sandwich',
    categoria: 'Comida',
    precio: '$55',
    stock: 6,
    imagen: sandwich,
  },
  {
    id: 4,
    nombre: 'Panini',
    categoria: 'Comida',
    precio: '$60',
    stock: 10,
    imagen: panini,
  },
]

function Productos() {
  const [productos, setProductos] = useState(productosIniciales)
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('Bebida')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [filtro, setFiltro] = useState('Todos')

  const crearProducto = () => {
    if (!nombre || !precio || !stock) return

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      categoria,
      precio: `$${precio}`,
      stock: Number(stock),
      imagen: null,
    }

    setProductos([nuevoProducto, ...productos])
    setNombre('')
    setCategoria('Bebida')
    setPrecio('')
    setStock('')
  }

  const productosFiltrados =
    filtro === 'Todos'
      ? productos
      : productos.filter((producto) => producto.categoria === filtro)

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

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
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
              filtro === tipo
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="overflow-hidden rounded-xl bg-white shadow"
          >
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-slate-200 text-slate-500">
                Espacio para imagen
              </div>
            )}

            <div className="p-4">
              <h2 className="text-xl font-bold text-slate-800">
                {producto.nombre}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Categoría: {producto.categoria}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Stock: {producto.stock}
              </p>

              <p className="mt-3 text-lg font-semibold text-green-700">
                {producto.precio}
              </p>

              <button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Editar producto
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

export default Productos