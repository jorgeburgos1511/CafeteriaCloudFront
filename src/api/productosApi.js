import { apiFetch } from './index'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

export const uploadImageProducto = async (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE_URL}/products/${id}/image`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Error ${res.status}`)
  }
  return res.json()
}

export const deleteProducto = (id) =>
  apiFetch(`/products/${id}`, { method: 'DELETE' })
