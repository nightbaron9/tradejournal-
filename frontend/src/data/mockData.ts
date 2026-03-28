export type MetricCard = {
  label: string
  value: string
  detail: string
  tone?: 'positive' | 'negative' | 'neutral'
}

export type TradeRow = {
  symbol: string
  date: string
  side: 'Long' | 'Short'
  entry: string
  exit: string
  quantity: string
  pnl: string
  setup: string
}

export type Position = {
  symbol: string
  side: 'Long' | 'Short'
  quantity: string
  avgEntry: string
  marketValue: string
  unrealized: string
}

export type JournalEntry = {
  date: string
  tag: string
  lesson: string
  note: string
}

export const dashboardSummary: MetricCard[] = [
  {
    label: 'Total realized P/L',
    value: '+$4,230',
    detail: 'Closed trades only',
    tone: 'positive',
  },
  {
    label: 'Win rate',
    value: '63%',
    detail: '24 wins / 38 trades',
    tone: 'neutral',
  },
  {
    label: 'Average win',
    value: '+$312',
    detail: 'Profitable closed trades',
    tone: 'positive',
  },
  {
    label: 'Average loss',
    value: '-$184',
    detail: 'Losing closed trades',
    tone: 'negative',
  },
]

export const tradeRows: TradeRow[] = [
  {
    symbol: 'NVDA',
    date: '2026-03-11',
    side: 'Long',
    entry: '$846.22',
    exit: '$891.18',
    quantity: '20',
    pnl: '+$899',
    setup: 'Opening range',
  },
  {
    symbol: 'TSLA',
    date: '2026-03-09',
    side: 'Short',
    entry: '$181.14',
    exit: '$189.94',
    quantity: '100',
    pnl: '-$880',
    setup: 'Failed breakdown',
  },
  {
    symbol: 'AAPL',
    date: '2026-03-06',
    side: 'Long',
    entry: '$188.10',
    exit: '$191.60',
    quantity: '80',
    pnl: '+$280',
    setup: 'Trend continuation',
  },
  {
    symbol: 'SPY',
    date: '2026-03-04',
    side: 'Long',
    entry: '$520.50',
    exit: '$523.40',
    quantity: '25',
    pnl: '+$72',
    setup: 'VWAP reclaim',
  },
]

export const openPositions: Position[] = [
  {
    symbol: 'NVDA',
    side: 'Long',
    quantity: '20',
    avgEntry: '$843.14',
    marketValue: '$17,482',
    unrealized: '+$620',
  },
  {
    symbol: 'AAPL',
    side: 'Long',
    quantity: '45',
    avgEntry: '$186.22',
    marketValue: '$8,622',
    unrealized: '+$241',
  },
  {
    symbol: 'TSLA',
    side: 'Short',
    quantity: '10',
    avgEntry: '$178.05',
    marketValue: '$1,711',
    unrealized: '-$69',
  },
  {
    symbol: 'SPY',
    side: 'Long',
    quantity: '8',
    avgEntry: '$521.11',
    marketValue: '$4,176',
    unrealized: '+$56',
  },
]

export const journalEntries: JournalEntry[] = [
  {
    date: 'Mar 11, 2026',
    tag: 'Momentum',
    lesson: 'The best day of the month came from waiting for clean continuation entries.',
    note: 'Stayed selective, kept size consistent, and avoided revenge trades after lunch.',
  },
  {
    date: 'Mar 09, 2026',
    tag: 'Risk',
    lesson: 'Short entries without confirmation led to oversized losses.',
    note: 'Need a firmer rule for failed breakdowns and a hard stop after two red trades.',
  },
  {
    date: 'Mar 06, 2026',
    tag: 'Process',
    lesson: 'Simple setups worked when I avoided overmanaging winners.',
    note: 'Calendar-linked notes should remain tied to the realized trade date for review.',
  },
]
