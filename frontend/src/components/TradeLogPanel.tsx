import { useMemo, useState } from 'react'
import type { TradeRow } from '../data/mockData'
import { useTradesData } from '../hooks/useTradingData'
import { SectionCard } from './SectionCard'

type SortKey = 'symbol' | 'date' | 'entry' | 'exit' | 'quantity' | 'pnl'
type FilterResult = 'all' | 'win' | 'loss'

function parseCurrency(value: string) {
  return Number(value.replace(/[$,+]/g, '').replace(',', ''))
}

function parseQuantity(value: string) {
  return Number(value.replace(/,/g, ''))
}

function sortTrades(list: TradeRow[], sortKey: SortKey, sortDirection: 'asc' | 'desc') {
  const direction = sortDirection === 'asc' ? 1 : -1
  const sorted = [...list].sort((left, right) => {
    const valueLeft =
      sortKey === 'symbol'
        ? left.symbol
        : sortKey === 'date'
          ? left.date
          : sortKey === 'entry'
            ? parseCurrency(left.entry)
            : sortKey === 'exit'
              ? parseCurrency(left.exit)
              : sortKey === 'quantity'
                ? parseQuantity(left.quantity)
                : parseCurrency(left.pnl)

    const valueRight =
      sortKey === 'symbol'
        ? right.symbol
        : sortKey === 'date'
          ? right.date
          : sortKey === 'entry'
            ? parseCurrency(right.entry)
            : sortKey === 'exit'
              ? parseCurrency(right.exit)
              : sortKey === 'quantity'
                ? parseQuantity(right.quantity)
                : parseCurrency(right.pnl)

    if (valueLeft < valueRight) return -1 * direction
    if (valueLeft > valueRight) return 1 * direction
    return 0
  })

  return sorted
}

function summaryValue(label: string, value: string, tone: 'positive' | 'negative' | 'neutral') {
  return (
    <article className="metric-card" key={label}>
      <span className="metric-label">{label}</span>
      <strong className={`metric-value ${tone}`}>{value}</strong>
    </article>
  )
}

export function TradeLogPanel() {
  const { data: tradeRows, loading } = useTradesData()
  const [search, setSearch] = useState('')
  const [side, setSide] = useState<'all' | 'Long' | 'Short'>('all')
  const [result, setResult] = useState<FilterResult>('all')
  const [setup, setSetup] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const setupOptions = useMemo(
    () => ['all', ...new Set(tradeRows.map((trade) => trade.setup))],
    [],
  )

  const filteredTrades = useMemo(() => {
    return tradeRows.filter((trade) => {
      if (search && !trade.symbol.toLowerCase().includes(search.toLowerCase())) return false
      if (side !== 'all' && trade.side !== side) return false
      if (result === 'win' && !trade.pnl.startsWith('+')) return false
      if (result === 'loss' && !trade.pnl.startsWith('-')) return false
      if (setup !== 'all' && trade.setup !== setup) return false
      return true
    })
  }, [result, search, setup, side])

  const sortedTrades = useMemo(
    () => sortTrades(filteredTrades, sortKey, sortDirection),
    [filteredTrades, sortDirection, sortKey],
  )

  const summary = useMemo(() => {
    const pnlValues = filteredTrades.map((trade) => parseCurrency(trade.pnl))
    const total = pnlValues.reduce((sum, value) => sum + value, 0)
    const wins = pnlValues.filter((value) => value > 0)
    const losses = pnlValues.filter((value) => value <= 0)
    const totalTrades = filteredTrades.length
    const winRate = totalTrades ? Math.round((wins.length / totalTrades) * 100) : 0
    const averageWin = wins.length
      ? wins.reduce((sum, value) => sum + value, 0) / wins.length
      : 0
    const averageLoss = losses.length
      ? losses.reduce((sum, value) => sum + value, 0) / losses.length
      : 0

    return { total, totalTrades, winRate, averageWin, averageLoss }
  }, [filteredTrades])

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(nextKey)
    setSortDirection(nextKey === 'date' ? 'desc' : 'asc')
  }

  function sortIndicator(nextKey: SortKey) {
    if (sortKey !== nextKey) return '↕'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="screen-stack">
      <SectionCard
        title="Trade log"
        description="Filter, sort, and review closed trades using the same interaction model as the prototype."
      >
        {loading ? <div className="panel-empty-state">Loading trade log…</div> : null}
        <div className="trade-toolbar">
          <label className="trade-search">
            <span className="sr-only">Search symbol</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search symbol…"
            />
          </label>

          <label className="trade-filter">
            <span>Side</span>
            <select value={side} onChange={(event) => setSide(event.target.value as typeof side)}>
              <option value="all">All</option>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </label>

          <label className="trade-filter">
            <span>Result</span>
            <select
              value={result}
              onChange={(event) => setResult(event.target.value as FilterResult)}
            >
              <option value="all">All</option>
              <option value="win">Winning</option>
              <option value="loss">Losing</option>
            </select>
          </label>

          <label className="trade-filter">
            <span>Setup</span>
            <select value={setup} onChange={(event) => setSetup(event.target.value)}>
              {setupOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All setups' : option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="trade-summary-grid">
          {summaryValue('Net P/L', `${summary.total >= 0 ? '+' : '-'}$${Math.abs(summary.total).toLocaleString()}`, summary.total >= 0 ? 'positive' : 'negative')}
          {summaryValue('Trades', `${summary.totalTrades}`, 'neutral')}
          {summaryValue('Win rate', `${summary.winRate}%`, 'neutral')}
          {summaryValue('Avg win', `+$${Math.round(summary.averageWin).toLocaleString()}`, 'positive')}
          {summaryValue('Avg loss', `-$${Math.abs(Math.round(summary.averageLoss)).toLocaleString()}`, 'negative')}
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>
                  <button type="button" className="table-sort-button" onClick={() => toggleSort('symbol')}>
                    Symbol <span>{sortIndicator('symbol')}</span>
                  </button>
                </th>
                <th>
                  <button type="button" className="table-sort-button" onClick={() => toggleSort('date')}>
                    Date <span>{sortIndicator('date')}</span>
                  </button>
                </th>
                <th>Side</th>
                <th>
                  <button type="button" className="table-sort-button" onClick={() => toggleSort('entry')}>
                    Entry <span>{sortIndicator('entry')}</span>
                  </button>
                </th>
                <th>
                  <button type="button" className="table-sort-button" onClick={() => toggleSort('exit')}>
                    Exit <span>{sortIndicator('exit')}</span>
                  </button>
                </th>
                <th>
                  <button type="button" className="table-sort-button" onClick={() => toggleSort('quantity')}>
                    Qty <span>{sortIndicator('quantity')}</span>
                  </button>
                </th>
                <th>
                  <button type="button" className="table-sort-button" onClick={() => toggleSort('pnl')}>
                    P&amp;L <span>{sortIndicator('pnl')}</span>
                  </button>
                </th>
                <th>Setup</th>
                <th>Session</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => (
                <tr key={trade.id}>
                  <td>{trade.symbol}</td>
                  <td>{trade.date}</td>
                  <td>{trade.side}</td>
                  <td>{trade.entry}</td>
                  <td>{trade.exit}</td>
                  <td>{trade.quantity}</td>
                  <td className={trade.pnl.startsWith('-') ? 'negative' : 'positive'}>{trade.pnl}</td>
                  <td>{trade.setup}</td>
                  <td>{trade.session}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
