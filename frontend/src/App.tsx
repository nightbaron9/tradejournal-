import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppContext } from './app/AppContext'
import { AnalyticsPanel } from './components/AnalyticsPanel'
import { AppShell } from './components/AppShell'
import { CalendarDashboard } from './components/CalendarDashboard'
import { JournalPanel } from './components/JournalPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { TradeLogPanel } from './components/TradeLogPanel'
import { usePositionsData } from './hooks/useTradingData'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import './App.css'

const TradesPage = () => <TradeLogPanel />

const PositionsPage = () => {
  const { data: positions, loading } = usePositionsData()

  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Open positions</h2>
            <p>Unrealized P/L remains visually distinct from calendar-based realized results.</p>
          </div>
          <span className="sync-pill">Last sync {loading ? 'loading...' : '2 min ago'}</span>
        </div>
        <div className="position-grid">
          {positions.map((position) => (
            <article className="position-card" key={position.symbol}>
              <div className="position-head">
                <strong>{position.symbol}</strong>
                <span>{position.side}</span>
              </div>
              <dl>
                <div>
                  <dt>Qty</dt>
                  <dd>{position.quantity}</dd>
                </div>
                <div>
                  <dt>Avg entry</dt>
                  <dd>{position.avgEntry}</dd>
                </div>
                <div>
                  <dt>Market value</dt>
                  <dd>{position.marketValue}</dd>
                </div>
                <div>
                  <dt>Unrealized P/L</dt>
                  <dd className={position.unrealized.startsWith('-') ? 'negative' : 'positive'}>
                    {position.unrealized}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

const JournalPage = () => <JournalPanel />

const LoadingScreen = () => (
  <div className="screen-stack">
    <section className="panel">
      <p>Loading session...</p>
    </section>
  </div>
)

const ProtectedAppLayout = () => {
  const { session, sessionLoading } = useAppContext()

  if (sessionLoading) {
    return <LoadingScreen />
  }

  if (!session.authenticated) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return <AppShell />
}

const PublicAuthRoute = ({ children }: { children: ReactElement }) => {
  const { session, sessionLoading } = useAppContext()

  if (sessionLoading) {
    return <LoadingScreen />
  }

  if (session.authenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      <Route
        path="/auth/sign-in"
        element={
          <PublicAuthRoute>
            <SignInPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/auth/sign-up"
        element={
          <PublicAuthRoute>
            <SignUpPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <PublicAuthRoute>
            <ResetPasswordPage />
          </PublicAuthRoute>
        }
      />

      <Route path="/app" element={<ProtectedAppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<CalendarDashboard />} />
        <Route path="trades" element={<TradesPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route path="analytics" element={<AnalyticsPanel />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="settings" element={<SettingsPanel />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  )
}

export default App
