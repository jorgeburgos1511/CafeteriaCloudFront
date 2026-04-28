import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Pedidos from './pages/Pedidos'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/clientes" element={<Clientes />} />
    </Routes>
  )
}

export default App