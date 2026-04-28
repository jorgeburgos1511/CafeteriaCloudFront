let pedidos = [
  {
    id: 1,
    cliente: 'Juan Pérez',
    producto: 'Café Latte',
    estado: 'Recibido',
  },
  {
    id: 2,
    cliente: 'María López',
    producto: 'Sandwich',
    estado: 'En preparación',
  },
  {
    id: 3,
    cliente: 'Carlos Ruiz',
    producto: 'Capuccino',
    estado: 'Listo',
  },
]

export const getPedidos = () => {
  return Promise.resolve(pedidos)
}

export const createPedido = (nuevo) => {
  const pedido = {
    ...nuevo,
    id: Date.now(), // simulación backend
    estado: 'Recibido',
  }

  pedidos = [pedido, ...pedidos]
  return Promise.resolve(pedido)
}

export const updatePedidoEstado = (id) => {
  pedidos = pedidos.map((p) => {
    if (p.id !== id) return p

    let nuevoEstado = p.estado

    if (p.estado === 'Recibido') nuevoEstado = 'En preparación'
    else if (p.estado === 'En preparación') nuevoEstado = 'Listo'
    else if (p.estado === 'Listo') nuevoEstado = 'Entregado'

    return { ...p, estado: nuevoEstado }
  })

  return Promise.resolve()
}