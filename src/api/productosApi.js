import { apiFetch } from './index'

export const getProductos = () => apiFetch('/products/')

export const createProducto = (data) =>
  apiFetch('/products/', {
    method: 'POST',
    body: JSON.stringify({
      name: data.nombre,
      price: parseFloat(data.precio),
      category: data.categoria,
      available: true,
    }),
  })

export const deleteProducto = (id) =>
  apiFetch(`/products/${id}`, { method: 'DELETE' })
