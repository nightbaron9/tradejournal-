import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { dashboardSummary, journalEntries, openPositions, tradeRows } from './data/mockData'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import './App.css'

const DashboardHome = () => (
  <div className="screen-stack">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Calendar performance overview</h2>
          <p>Daily realized P/L stays separate from open position performance.</p>
        </div>
        <button className="secondary-btn" type="button">
          Connect broker
        </button>
      </div>

      <div className="metrics-grid">
        {dashboardSummary.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span className="metric-label">{metric.label}</span>
            <strong className={`metric-value ${metric.tone ?? 'neutral'}`}>{metric.value}</strong>
            <span className="metric-detail">{metric.detail}</span>
          </article>
        ))}
      </div>
    </section>

    <section className="panel split-panel">
      <div>
        <div className="section-label">This month</div>
        <h3>March 2026 calendar snapshot</h3>
        <p className="section-copy">
          The React shell keeps the prototype&apos;s calendar-first layout while preparing for
          real aggregation and drill-down behavior.
        </p>
        <div className="calendar-grid">
          {['Mon 2', 'Tue 3', 'Wed 4', 'Thu 5', 'Fri 6', 'Mon 9'].map((day, index) => (
            <div
              className={`calendar-day ${
                index % 3 === 0 ? 'positive' : index % 3 === 1 ? 'negative' : ''
              }`}
              key={day}
            >
              <span>{day}</span>
              <strong>{index % 3 === 1 ? '-$180' : '+$420'}</strong>
              <small>{index + 1} trades</small>
            </div>
          ))}
        </div>
      </div>

      <aside className="detail-card">
        <div className="section-label">Selected day</div>
        <h3>Friday, Mar 6</h3>
        <strong className="detail-pl positive">+$420</strong>
        <ul className="detail-list">
          <li>3 closed trades</li>
          <li>2 wins / 1 loss</li>
          <li>Notes and tags available</li>
        </ul>
      </aside>
    </section>
  </div>
)

const TradesPage = () => (
  <div className="screen-stack">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Trade log</h2>
          <p>Mock data mirrors the prototype table and prepares this view for filtering.</p>
        </div>
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Date</th>
              <th>Side</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Qty</th>
              <th>P/L</th>
              <th>Setup</th>
            </tr>
          </thead>
          <tbody>
            {tradeRows.map((trade) => (
              <tr key={`${trade.symbol}-${trade.date}`}>
                <td>{trade.symbol}</td>
                <td>{trade.date}</td>
                <td>{trade.side}</td>
                <td>{trade.entry}</td>
                <td>{trade.exit}</td>
                <td>{trade.quantity}</td>
                <td className={trade.pnl.startsWith('-') ? 'negative' : 'positive'}>{trade.pnl}</td>
                <td>{trade.setup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)

const PositionsPage = () => (
  <div className="screen-stack">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Open positions</h2>
          <p>Unrealized P/L remains visually distinct from calendar-based realized results.</p>
        </div>
        <span className="sync-pill">Last sync 3 min ago</span>
      </div>
      <div className="position-grid">
        {openPositions.map((position) => (
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

const JournalPage = () => (
  <div className="screen-stack">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Notes and journal</h2>
          <p>The journal will stay connected to trading dates, notes, lessons, and mood.</p>
        </div>
      </div>
      <div className="journal-list">
        {journalEntries.map((entry) => (
          <article className="journal-card" key={entry.date}>
            <div className="journal-top">
              <div>
                <strong>{entry.date}</strong>
                <p>{entry.lesson}</p>
              </div>
              <span className="tag">{entry.tag}</span>
            </div>
            <p>{entry.note}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
)

const PlaceholderPage = ({
  title,
  copy,
}: {
  title: string
  copy: string
}) => (
  <div className="screen-stack">
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>
      </div>
      <div className="placeholder-card">
        <p>This screen is scaffolded in the React app shell and ready for deeper implementation.</p>
      </div>
    </section>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="trades" element={<TradesPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route
          path="analytics"
          element={
            <PlaceholderPage
              title="Analytics"
              copy="This routed shell is ready for the next move: porting charts and filter interactions from the prototype."
            />
          }
        />
        <Route path="journal" element={<JournalPage />} />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Settings"
              copy="Settings will eventually cover broker connection, sync status, profile, and account controls."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  )
}

export default App
