import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/trades', label: 'Trade Log' },
  { to: '/app/positions', label: 'Open Positions' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/journal', label: 'Notes & Journal' },
  { to: '/app/settings', label: 'Settings' },
]

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/trades': 'Trade Log',
  '/app/positions': 'Open Positions',
  '/app/analytics': 'Analytics',
  '/app/journal': 'Notes & Journal',
  '/app/settings': 'Settings',
}

export function AppShell() {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Dashboard'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-mark">TL</div>
          <div>
            <div className="logo-text">TradeLog</div>
            <div className="logo-subtext">Calendar journal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">BL</div>
          <div>
            <div className="user-name">Brian Lin</div>
            <div className="user-plan">Prototype workspace</div>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div>
            <div className="topbar-eyebrow">Calendar-Based Trading Journal</div>
            <h1>{title}</h1>
          </div>

          <div className="period-switcher" aria-label="Reporting period">
            <button type="button" className="period-button active">
              MTD
            </button>
            <button type="button" className="period-button">
              YTD
            </button>
            <button type="button" className="period-button">
              All
            </button>
          </div>
        </header>

        <section className="app-content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
