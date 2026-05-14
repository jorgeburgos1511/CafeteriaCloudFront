import { apiFetch } from './index'

export const getPedidos = () => apiFetch('/pedidos/')

export const createPedido = (data) =>
  apiFetch('/pedidos/', {
    method: 'POST',
    body: JSON.stringify({ cliente_nombre: data.cliente_nombre, cliente_email: data.cliente_email }),
  })

export const addItemToPedido = (pedidoId, productoId) =>
  apiFetch(`/pedidos/${pedidoId}/items`, {
    method: 'POST',
    body: JSON.stringify({ producto_id: productoId }),
  })

export const removeItemFromPedido = (pedidoId, itemId) =>
  apiFetch(`/pedidos/${pedidoId}/items/${itemId}`, { method: 'DELETE' })

export const confirmarPedido = (pedidoId) =>
  apiFetch(`/pedidos/${pedidoId}/confirmar`, { method: 'PATCH' })

export const avanzarItem = (pedidoId, itemId) =>
  apiFetch(`/pedidos/${pedidoId}/items/${itemId}/avanzar`, { method: 'PATCH' })

export const finalizarPedido = (pedidoId) =>
  apiFetch(`/pedidos/${pedidoId}/finalizar`, { method: 'PATCH' })

export const cancelarPedido = (pedidoId) =>
  apiFetch(`/pedidos/${pedidoId}/cancelar`, { method: 'PATCH' })
