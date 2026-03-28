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

export type CalendarTrade = {
  symbol: string
  setup: string
  time: string
  side: 'Long' | 'Short'
  pnl: string
}

export type CalendarRecord = {
  date: string
  pnl: number
  wins: number
  losses: number
  note: string
  tags: string[]
  trades: CalendarTrade[]
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

export const calendarRecords: CalendarRecord[] = [
  {
    date: '2026-03-02',
    pnl: 420,
    wins: 2,
    losses: 1,
    note: 'Followed the opening game plan and sized into strength instead of chasing.',
    tags: ['Momentum', 'A setup'],
    trades: [
      { symbol: 'NVDA', setup: 'Opening range', time: '9:41 AM', side: 'Long', pnl: '+$280' },
      { symbol: 'AAPL', setup: 'Trend continuation', time: '10:12 AM', side: 'Long', pnl: '+$190' },
      { symbol: 'TSLA', setup: 'VWAP fade', time: '11:06 AM', side: 'Short', pnl: '-$50' },
    ],
  },
  {
    date: '2026-03-03',
    pnl: -180,
    wins: 1,
    losses: 2,
    note: 'Entered too early on breakdown confirmations and lost discipline after the first red trade.',
    tags: ['Risk'],
    trades: [
      { symbol: 'TSLA', setup: 'Failed breakdown', time: '9:52 AM', side: 'Short', pnl: '-$120' },
      { symbol: 'SPY', setup: 'VWAP reclaim', time: '10:37 AM', side: 'Long', pnl: '+$70' },
      { symbol: 'AMD', setup: 'Late chase', time: '2:14 PM', side: 'Long', pnl: '-$130' },
    ],
  },
  {
    date: '2026-03-04',
    pnl: 72,
    wins: 1,
    losses: 0,
    note: 'Light trading day. Took one clean SPY setup and stayed patient the rest of the session.',
    tags: ['Process'],
    trades: [
      { symbol: 'SPY', setup: 'VWAP reclaim', time: '11:02 AM', side: 'Long', pnl: '+$72' },
    ],
  },
  {
    date: '2026-03-06',
    pnl: 420,
    wins: 2,
    losses: 1,
    note: 'The calendar drawer should eventually show synced notes and edits for this realized trade date.',
    tags: ['Process', 'Review'],
    trades: [
      { symbol: 'AAPL', setup: 'Trend continuation', time: '9:48 AM', side: 'Long', pnl: '+$280' },
      { symbol: 'SPY', setup: 'Range breakout', time: '10:19 AM', side: 'Long', pnl: '+$170' },
      { symbol: 'QQQ', setup: 'Pullback entry', time: '1:11 PM', side: 'Long', pnl: '-$30' },
    ],
  },
  {
    date: '2026-03-09',
    pnl: -1180,
    wins: 1,
    losses: 3,
    note: 'Largest losing day of the month. Need tighter rules on short confirmation and daily max loss.',
    tags: ['Risk', 'Shorts'],
    trades: [
      { symbol: 'TSLA', setup: 'Failed breakdown', time: '9:44 AM', side: 'Short', pnl: '-$880' },
      { symbol: 'NVDA', setup: 'Countertrend scalp', time: '11:07 AM', side: 'Short', pnl: '-$190' },
      { symbol: 'SPY', setup: 'Reversal', time: '1:26 PM', side: 'Long', pnl: '+$140' },
      { symbol: 'META', setup: 'Late fade', time: '2:32 PM', side: 'Short', pnl: '-$250' },
    ],
  },
  {
    date: '2026-03-10',
    pnl: 210,
    wins: 2,
    losses: 1,
    note: 'Recovery day. Better pacing and fewer impulsive entries.',
    tags: ['Recovery'],
    trades: [
      { symbol: 'AAPL', setup: 'Gap continuation', time: '9:38 AM', side: 'Long', pnl: '+$120' },
      { symbol: 'SPY', setup: 'Lunch trend', time: '12:24 PM', side: 'Long', pnl: '+$140' },
      { symbol: 'TSLA', setup: 'Fade attempt', time: '2:08 PM', side: 'Short', pnl: '-$50' },
    ],
  },
  {
    date: '2026-03-11',
    pnl: 2340,
    wins: 4,
    losses: 1,
    note: 'Best day this month. High-conviction momentum names worked because I waited for clean continuation entries.',
    tags: ['Momentum', 'A+ day'],
    trades: [
      { symbol: 'NVDA', setup: 'Opening range', time: '9:41 AM', side: 'Long', pnl: '+$899' },
      { symbol: 'AMD', setup: 'Trend continuation', time: '10:18 AM', side: 'Long', pnl: '+$540' },
      { symbol: 'META', setup: 'Breakout pullback', time: '11:03 AM', side: 'Long', pnl: '+$420' },
      { symbol: 'AAPL', setup: 'VWAP reclaim', time: '12:14 PM', side: 'Long', pnl: '+$590' },
      { symbol: 'QQQ', setup: 'Scalp stopout', time: '2:06 PM', side: 'Long', pnl: '-$109' },
    ],
  },
  {
    date: '2026-03-12',
    pnl: 95,
    wins: 1,
    losses: 0,
    note: 'Small green day. Focused on process and avoided forcing volume after the open.',
    tags: ['Discipline'],
    trades: [
      { symbol: 'SPY', setup: 'Range breakout', time: '10:09 AM', side: 'Long', pnl: '+$95' },
    ],
  },
]
