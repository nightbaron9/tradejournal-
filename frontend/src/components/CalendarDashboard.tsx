import { useMemo, useState } from 'react'
import { calendarRecords, dashboardSummary, type CalendarRecord } from '../data/mockData'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

type CalendarCell = {
  key: string
  dayNumber: number
  currentMonth: boolean
  isToday: boolean
  record?: CalendarRecord
}

function formatCurrency(amount: number) {
  if (amount === 0) return '$0'

  const abs = Math.abs(amount)
  const value = `$${abs.toLocaleString()}`
  return `${amount > 0 ? '+' : '-'}${value}`
}

function recordTone(amount: number) {
  if (amount > 0) return 'positive'
  if (amount < 0) return 'negative'
  return 'neutral'
}

function formatLongDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return `${DAY_LABELS[date.getDay()]}, ${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function CalendarDashboard() {
  const initialMonth = new Date(2026, 2, 1)
  const [viewDate, setViewDate] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState('2026-03-11')

  const calendarRecordMap = useMemo(
    () => new Map(calendarRecords.map((record) => [record.date, record])),
    [],
  )

  const monthCells = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const firstWeekday = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPreviousMonth = new Date(year, month, 0).getDate()
    const cells: CalendarCell[] = []

    for (let index = 0; index < firstWeekday; index += 1) {
      const dayNumber = daysInPreviousMonth - firstWeekday + index + 1
      const cellDate = new Date(year, month - 1, dayNumber)
      const key = cellDate.toISOString().slice(0, 10)
      cells.push({
        key,
        dayNumber,
        currentMonth: false,
        isToday: key === '2026-03-21',
        record: calendarRecordMap.get(key),
      })
    }

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
      const cellDate = new Date(year, month, dayNumber)
      const key = cellDate.toISOString().slice(0, 10)
      cells.push({
        key,
        dayNumber,
        currentMonth: true,
        isToday: key === '2026-03-21',
        record: calendarRecordMap.get(key),
      })
    }

    while (cells.length % 7 !== 0) {
      const dayNumber = cells.length - (firstWeekday + daysInMonth) + 1
      const cellDate = new Date(year, month + 1, dayNumber)
      const key = cellDate.toISOString().slice(0, 10)
      cells.push({
        key,
        dayNumber,
        currentMonth: false,
        isToday: key === '2026-03-21',
        record: calendarRecordMap.get(key),
      })
    }

    return cells
  }, [calendarRecordMap, viewDate])

  const currentMonthRecords = useMemo(() => {
    const monthPrefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`
    return calendarRecords.filter((record) => record.date.startsWith(monthPrefix))
  }, [viewDate])

  const monthlyPnl = currentMonthRecords.reduce((sum, record) => sum + record.pnl, 0)
  const activeDays = currentMonthRecords.length
  const selectedRecord = calendarRecordMap.get(selectedDate)

  function goToPreviousMonth() {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  function goToNextMonth() {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  function goToCurrentMonth() {
    setViewDate(initialMonth)
    setSelectedDate('2026-03-11')
  }

  return (
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

      <section className="panel">
        <div className="calendar-toolbar">
          <div>
            <div className="section-label">This month</div>
            <h3>
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
          </div>

          <div className="calendar-toolbar-actions">
            <button className="calendar-nav" type="button" onClick={goToPreviousMonth}>
              ←
            </button>
            <button className="calendar-nav" type="button" onClick={goToNextMonth}>
              →
            </button>
            <button className="calendar-today" type="button" onClick={goToCurrentMonth}>
              This month
            </button>
          </div>
        </div>

        <div className="calendar-summary-bar">
          <div>
            <span className="calendar-summary-label">Realized P/L</span>
            <strong className={recordTone(monthlyPnl)}>{formatCurrency(monthlyPnl)}</strong>
          </div>
          <div>
            <span className="calendar-summary-label">Active trading days</span>
            <strong>{activeDays}</strong>
          </div>
          <div>
            <span className="calendar-summary-label">Calendar rule</span>
            <strong>Closed trades only</strong>
          </div>
        </div>

        <div className="calendar-board">
          <div className="calendar-weekdays">
            {DAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="calendar-month-grid">
            {monthCells.map((cell) => {
              const tone = cell.record ? recordTone(cell.record.pnl) : 'empty'
              const isSelected = cell.key === selectedDate

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={`calendar-cell ${tone} ${cell.currentMonth ? '' : 'other-month'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(cell.key)}
                >
                  <div className="calendar-cell-head">
                    <span className={`calendar-date-pill ${cell.isToday ? 'today' : ''}`}>
                      {cell.dayNumber}
                    </span>
                    {cell.record ? <span className="calendar-trade-count">{cell.record.trades.length}T</span> : null}
                  </div>

                  {cell.record ? (
                    <>
                      <strong>{formatCurrency(cell.record.pnl)}</strong>
                      <small>
                        {cell.record.wins}W / {cell.record.losses}L
                      </small>
                    </>
                  ) : (
                    <small>{cell.currentMonth ? 'No closed trades' : 'Outside month'}</small>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="detail-card detail-card-wide">
        <div className="detail-header">
          <div>
            <div className="section-label">Selected day</div>
            <h3>{formatLongDate(selectedDate)}</h3>
          </div>
          <strong className={`detail-pl ${selectedRecord ? recordTone(selectedRecord.pnl) : 'neutral'}`}>
            {selectedRecord ? formatCurrency(selectedRecord.pnl) : 'No trades'}
          </strong>
        </div>

        {selectedRecord ? (
          <div className="detail-grid">
            <div className="detail-section">
              <div className="detail-stats">
                <div>
                  <span className="calendar-summary-label">Closed trades</span>
                  <strong>{selectedRecord.trades.length}</strong>
                </div>
                <div>
                  <span className="calendar-summary-label">Wins / losses</span>
                  <strong>
                    {selectedRecord.wins} / {selectedRecord.losses}
                  </strong>
                </div>
                <div>
                  <span className="calendar-summary-label">Tags</span>
                  <strong>{selectedRecord.tags.join(', ')}</strong>
                </div>
              </div>

              <div className="trade-drawer-list">
                {selectedRecord.trades.map((trade) => (
                  <article className="trade-drawer-item" key={`${selectedRecord.date}-${trade.symbol}-${trade.time}`}>
                    <div>
                      <strong>{trade.symbol}</strong>
                      <p>
                        {trade.setup} · {trade.side} · {trade.time}
                      </p>
                    </div>
                    <span className={trade.pnl.startsWith('-') ? 'negative' : 'positive'}>{trade.pnl}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="detail-notes-card">
              <div className="section-label">Daily notes</div>
              <p>{selectedRecord.note}</p>
            </aside>
          </div>
        ) : (
          <div className="placeholder-card detail-empty-state">
            <p>No closed trades are recorded for this date yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
