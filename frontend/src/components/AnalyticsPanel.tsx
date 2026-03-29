import { useMemo, useState } from 'react'
import type { AnalyticsTrade } from '../data/mockData'
import { useAnalyticsTrades } from '../hooks/useTradingData'

type FilterState = {
  side: 'all' | 'Long' | 'Short'
  result: 'all' | 'win' | 'loss'
  symbol: string
  session: string
}

function formatCurrency(amount: number) {
  if (amount === 0) return '$0'

  const absolute = Math.abs(amount)
  const value = absolute >= 1000 ? `$${(absolute / 1000).toFixed(2)}K` : `$${absolute.toFixed(0)}`
  return `${amount > 0 ? '+' : '-'}${value}`
}

function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function percentage(part: number, total: number) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}

function segmentWidth(value: number, total: number) {
  if (!total) return '0%'
  return `${Math.max((value / total) * 100, 6)}%`
}

function getWeekdayLabel(dateValue: string) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const date = new Date(`${dateValue}T00:00:00`)
  return labels[date.getDay()] ?? '—'
}

export function AnalyticsPanel() {
  const { data: analyticsTrades, loading } = useAnalyticsTrades()
  const [filters, setFilters] = useState<FilterState>({
    side: 'all',
    result: 'all',
    symbol: 'all',
    session: 'all',
  })

  const symbols = useMemo(
    () => ['all', ...new Set(analyticsTrades.map((trade: AnalyticsTrade) => trade.symbol))],
    [analyticsTrades],
  )
  const sessions = useMemo(
    () => ['all', ...new Set(analyticsTrades.map((trade: AnalyticsTrade) => trade.session))],
    [analyticsTrades],
  )

  const filteredTrades = useMemo(() => {
    return analyticsTrades.filter((trade: AnalyticsTrade) => {
      if (filters.side !== 'all' && trade.side !== filters.side) return false
      if (filters.result === 'win' && trade.pnl <= 0) return false
      if (filters.result === 'loss' && trade.pnl > 0) return false
      if (filters.symbol !== 'all' && trade.symbol !== filters.symbol) return false
      if (filters.session !== 'all' && trade.session !== filters.session) return false
      return true
    })
  }, [analyticsTrades, filters])

  const activeFilterCount = Object.values(filters).filter((value) => value !== 'all').length

  const summary = useMemo(() => {
    const wins = filteredTrades.filter((trade: AnalyticsTrade) => trade.pnl > 0)
    const losses = filteredTrades.filter((trade: AnalyticsTrade) => trade.pnl <= 0)
    const net = filteredTrades.reduce((sum: number, trade: AnalyticsTrade) => sum + trade.pnl, 0)
    const grossProfit = wins.reduce((sum: number, trade: AnalyticsTrade) => sum + trade.pnl, 0)
    const grossLoss = Math.abs(
      losses.reduce((sum: number, trade: AnalyticsTrade) => sum + trade.pnl, 0),
    )
    const bestTrade = filteredTrades.reduce(
      (best: number, trade: AnalyticsTrade) => (trade.pnl > best ? trade.pnl : best),
      0,
    )
    const worstTrade = filteredTrades.reduce(
      (worst: number, trade: AnalyticsTrade) => (trade.pnl < worst ? trade.pnl : worst),
      0,
    )

    return {
      totalTrades: filteredTrades.length,
      winRate: percentage(wins.length, filteredTrades.length),
      net,
      averageWin: average(wins.map((trade: AnalyticsTrade) => trade.pnl)),
      averageLoss: average(losses.map((trade: AnalyticsTrade) => trade.pnl)),
      profitFactor: grossLoss ? (grossProfit / grossLoss).toFixed(2) : '—',
      bestTrade,
      worstTrade,
    }
  }, [filteredTrades])

  const sessionBreakdown = useMemo(() => {
    const totals = new Map<string, number>()
    filteredTrades.forEach((trade: AnalyticsTrade) => {
      totals.set(trade.session, (totals.get(trade.session) ?? 0) + trade.pnl)
    })

    return Array.from(totals.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
  }, [filteredTrades])

  const symbolBreakdown = useMemo(() => {
    const totals = new Map<string, number>()
    filteredTrades.forEach((trade: AnalyticsTrade) => {
      totals.set(trade.symbol, (totals.get(trade.symbol) ?? 0) + trade.pnl)
    })

    return Array.from(totals.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 5)
  }, [filteredTrades])

  const longShortBreakdown = useMemo(() => {
    return (['Long', 'Short'] as const).map((side) => ({
      label: side,
      value: filteredTrades
        .filter((trade: AnalyticsTrade) => trade.side === side)
        .reduce((sum: number, trade: AnalyticsTrade) => sum + trade.pnl, 0),
      count: filteredTrades.filter((trade: AnalyticsTrade) => trade.side === side).length,
    }))
  }, [filteredTrades])

  const weekdayBreakdown = useMemo(() => {
    const totals = new Map<string, number>()
    filteredTrades.forEach((trade: AnalyticsTrade) => {
      const weekday = getWeekdayLabel(trade.date)
      totals.set(weekday, (totals.get(weekday) ?? 0) + trade.pnl)
    })

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label) => ({
      label,
      value: totals.get(label) ?? 0,
    }))
  }, [filteredTrades])

  const maxSessionMagnitude = Math.max(
    1,
    ...sessionBreakdown.map((item) => Math.abs(item.value)),
    ...symbolBreakdown.map((item) => Math.abs(item.value)),
    ...weekdayBreakdown.map((item) => Math.abs(item.value)),
    ...longShortBreakdown.map((item) => Math.abs(item.value)),
  )

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function resetFilters() {
    setFilters({ side: 'all', result: 'all', symbol: 'all', session: 'all' })
  }

  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="panel-heading analytics-header">
          <div>
            <h2>Analytics</h2>
            <p>Derived mock metrics replicate the prototype&apos;s filterable performance dashboard.</p>
          </div>

          <div className="analytics-filter-actions">
            <div className="analytics-filter-count">
              {activeFilterCount ? `${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}` : 'All trades'}
            </div>
            <button className="settings-button" type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        </div>

        <div className="analytics-filter-grid">
          <label className="settings-field">
            <span>Side</span>
            <select value={filters.side} onChange={(event) => updateFilter('side', event.target.value as FilterState['side'])}>
              <option value="all">All</option>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </label>

          <label className="settings-field">
            <span>Result</span>
            <select value={filters.result} onChange={(event) => updateFilter('result', event.target.value as FilterState['result'])}>
              <option value="all">All</option>
              <option value="win">Winning trades</option>
              <option value="loss">Losing trades</option>
            </select>
          </label>

          <label className="settings-field">
            <span>Symbol</span>
            <select value={filters.symbol} onChange={(event) => updateFilter('symbol', event.target.value)}>
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol === 'all' ? 'All symbols' : symbol}
                </option>
              ))}
            </select>
          </label>

          <label className="settings-field">
            <span>Session</span>
            <select value={filters.session} onChange={(event) => updateFilter('session', event.target.value)}>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session === 'all' ? 'All sessions' : session}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <section className="panel"><p>Loading analytics...</p></section>
      ) : (
        <>
          <section className="analytics-summary-grid">
            <article className="metric-card">
              <span className="metric-label">Net P/L</span>
              <strong className={`metric-value ${summary.net >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(summary.net)}</strong>
              <span className="metric-detail">Filtered trade set</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Win rate</span>
              <strong className="metric-value neutral">{summary.winRate}%</strong>
              <span className="metric-detail">{summary.totalTrades} trades in scope</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Average win</span>
              <strong className="metric-value positive">{formatCurrency(summary.averageWin)}</strong>
              <span className="metric-detail">Profitable trades only</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Average loss</span>
              <strong className="metric-value negative">{formatCurrency(summary.averageLoss)}</strong>
              <span className="metric-detail">Losing trades only</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Profit factor</span>
              <strong className="metric-value neutral">{summary.profitFactor}</strong>
              <span className="metric-detail">Gross profit / gross loss</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Best trade</span>
              <strong className="metric-value positive">{formatCurrency(summary.bestTrade)}</strong>
              <span className="metric-detail">Filtered range</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Worst trade</span>
              <strong className="metric-value negative">{formatCurrency(summary.worstTrade)}</strong>
              <span className="metric-detail">Filtered range</span>
            </article>
          </section>

          <section className="analytics-content-grid">
            {[{ title: 'Session breakdown', copy: 'Performance grouped by trading session, mirroring the prototype analytics view.', items: sessionBreakdown },
              { title: 'P&L by symbol', copy: 'Top contributors in the filtered set.', items: symbolBreakdown },
              { title: 'Long vs Short', copy: 'Keep directional performance clearly separated.', items: longShortBreakdown.map((item) => ({ label: `${item.label} · ${item.count} trades`, value: item.value })) },
              { title: 'Weekday performance', copy: 'Daily rhythm overview from the current filters.', items: weekdayBreakdown }].map((section) => (
              <article className="panel analytics-card" key={section.title}>
                <div className="panel-heading">
                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.copy}</p>
                  </div>
                </div>
                <div className="analytics-bar-list">
                  {section.items.map((item) => (
                    <div className="analytics-bar-row" key={item.label}>
                      <div className="analytics-bar-header">
                        <span>{item.label}</span>
                        <strong className={item.value >= 0 ? 'positive' : 'negative'}>{formatCurrency(item.value)}</strong>
                      </div>
                      <div className="analytics-bar-track">
                        <div
                          className={`analytics-bar-fill ${item.value >= 0 ? 'positive' : 'negative'}`}
                          style={{ width: segmentWidth(Math.abs(item.value), maxSessionMagnitude) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="panel analytics-card">
            <div className="panel-heading">
              <div>
                <h3>Filtered trades</h3>
                <p>Mock rows that feed the derived analytics metrics above.</p>
              </div>
            </div>
            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Symbol</th>
                    <th>Side</th>
                    <th>Session</th>
                    <th>Setup</th>
                    <th>P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade: AnalyticsTrade) => (
                    <tr key={`${trade.date}-${trade.symbol}-${trade.session}-${trade.pnl}`}>
                      <td>{trade.date}</td>
                      <td>{trade.symbol}</td>
                      <td>{trade.side}</td>
                      <td>{trade.session}</td>
                      <td>{trade.setup}</td>
                      <td className={trade.pnl >= 0 ? 'positive' : 'negative'}>{formatCurrency(trade.pnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
