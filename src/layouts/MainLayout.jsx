import { Link, useLocation } from 'react-router-dom'
import ChatWidget from '../components/ChatWidget'

const NAV = [
  { to: '/',          label: 'Dashboard', icon: '📊' },
  { to: '/pedidos',   label: 'Pedidos',   icon: '📋' },
  { to: '/productos', label: 'Productos', icon: '☕' },
  { to: '/clientes',  label: 'Clientes',  icon: '👥' },
]

function MainLayout({ children }) {
  const { pathname } = useLocation()

  const fecha = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-lg shadow-md">
              ☕
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Cafetería</h2>
              <p className="text-xs text-slate-400 font-medium">ITESO · Nube</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-1">
            Menú
          </p>
          {NAV.map(({ to, label, icon }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-slate-700 text-white border-l-[3px] border-amber-400 pl-[9px]'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-[3px] border-transparent pl-[9px]'
                }`}
              >
                <span className="text-base w-5 text-center">{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-700/60">
          <p className="text-xs text-slate-500 text-center">v1.0 · Desarrollo en Nube</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white px-6 py-3.5 shadow-sm border-b border-slate-200 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-800">Sistema de Cafetería</h1>
          <p className="text-xs text-slate-400 capitalize hidden sm:block">{fecha}</p>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      <ChatWidget />
    </div>
  )
}

export default MainLayout
