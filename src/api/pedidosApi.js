import { apiFetch } from './index'

export const getPedidos = () => apiFetch('/pedidos/')

export const createPedido = (data) =>
  apiFetch('/pedidos/', {
    method: 'POST',
    body: JSON.stringify({ cliente: data.cliente, producto: data.producto }),
  })

export const avanzarEstado = (id) =>
  apiFetch(`/pedidos/${id}/avanzar`, { method: 'PATCH' })
