import { Link } from 'react-router-dom'

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h2 className="mb-6 text-xl font-bold">Cafetería</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/" className="rounded p-2 hover:bg-slate-700">
            Dashboard
          </Link>

          <Link to="/pedidos" className="rounded p-2 hover:bg-slate-700">
            Pedidos
          </Link>

          <Link to="/productos" className="rounded p-2 hover:bg-slate-700">
            Productos
          </Link>

          <Link to="/clientes" className="rounded p-2 hover:bg-slate-700">
            Clientes
          </Link>
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="bg-white p-4 shadow">
          <h1 className="text-lg font-semibold">Sistema de Cafetería</h1>
        </header>

        {/* Página */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout