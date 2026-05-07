import { apiFetch } from './index'

export const getClientes = () => apiFetch('/customers/')

export const createCliente = (data) =>
  apiFetch('/customers/', {
    method: 'POST',
    body: JSON.stringify({ name: data.nombre, email: data.correo }),
  })

export const deleteCliente = (id) =>
  apiFetch(`/customers/${id}`, { method: 'DELETE' })
