export type MetricCard = {
  label: string
  value: string
  detail: string
  tone?: 'positive' | 'negative' | 'neutral'
}

export type TradeRow = {
  id: string
  symbol: string
  date: string
  side: 'Long' | 'Short'
  entry: string
  exit: string
  quantity: string
  pnl: string
  setup: string
  session: 'Open' | 'Midday' | 'Close'
  result: 'Win' | 'Loss'
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
  id: string
  date: string
  title: string
  lesson: string
  note: string
  mood: 'Focused' | 'Calm' | 'Frustrated' | 'Confident' | 'Reactive'
  tags: string[]
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

export type SettingsProfile = {
  name: string
  email: string
  timezone: string
  currency: string
  dateFormat: string
}

export type BrokerConnection = {
  brokerName: string
  connected: boolean
  statusLabel: string
  lastSync: string
  syncFrequency: string
  autoImportTrades: boolean
}

export type SettingsNotificationPreferences = {
  journalReminder: boolean
  weeklyReview: boolean
  brokerSyncErrors: boolean
}

export type AnalyticsTrade = {
  id: string
  date: string
  symbol: string
  side: 'Long' | 'Short'
  session: 'Open' | 'Midday' | 'Close'
  setup: string
  pnl: number
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
    id: 'trade-001',
    symbol: 'NVDA',
    date: '2026-03-11',
    side: 'Long',
    entry: '$846.22',
    exit: '$891.18',
    quantity: '20',
    pnl: '+$899',
    setup: 'Opening range',
    session: 'Open',
    result: 'Win',
  },
  {
    id: 'trade-002',
    symbol: 'TSLA',
    date: '2026-03-09',
    side: 'Short',
    entry: '$181.14',
    exit: '$189.94',
    quantity: '100',
    pnl: '-$880',
    setup: 'Failed breakdown',
    session: 'Open',
    result: 'Loss',
  },
  {
    id: 'trade-003',
    symbol: 'AAPL',
    date: '2026-03-06',
    side: 'Long',
    entry: '$188.10',
    exit: '$191.60',
    quantity: '80',
    pnl: '+$280',
    setup: 'Trend continuation',
    session: 'Open',
    result: 'Win',
  },
  {
    id: 'trade-004',
    symbol: 'SPY',
    date: '2026-03-04',
    side: 'Long',
    entry: '$520.50',
    exit: '$523.40',
    quantity: '25',
    pnl: '+$72',
    setup: 'VWAP reclaim',
    session: 'Midday',
    result: 'Win',
  },
  {
    id: 'trade-005',
    symbol: 'QQQ',
    date: '2026-03-06',
    side: 'Long',
    entry: '$438.40',
    exit: '$437.20',
    quantity: '30',
    pnl: '-$30',
    setup: 'Pullback entry',
    session: 'Close',
    result: 'Loss',
  },
  {
    id: 'trade-006',
    symbol: 'AMD',
    date: '2026-03-11',
    side: 'Long',
    entry: '$178.12',
    exit: '$188.92',
    quantity: '50',
    pnl: '+$540',
    setup: 'Trend continuation',
    session: 'Open',
    result: 'Win',
  },
  {
    id: 'trade-007',
    symbol: 'META',
    date: '2026-03-09',
    side: 'Short',
    entry: '$498.15',
    exit: '$503.15',
    quantity: '50',
    pnl: '-$250',
    setup: 'Late fade',
    session: 'Close',
    result: 'Loss',
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
    id: 'jnl-001',
    date: '2026-03-11',
    title: 'Momentum continuation review',
    lesson: 'The best day of the month came from waiting for clean continuation entries.',
    note: 'Stayed selective, kept size consistent, and avoided revenge trades after lunch.',
    mood: 'Confident',
    tags: ['Momentum', 'A+ day'],
  },
  {
    id: 'jnl-002',
    date: '2026-03-09',
    title: 'Risk review after failed shorts',
    lesson: 'Short entries without confirmation led to oversized losses.',
    note: 'Need a firmer rule for failed breakdowns and a hard stop after two red trades.',
    mood: 'Frustrated',
    tags: ['Risk', 'Shorts'],
  },
  {
    id: 'jnl-003',
    date: '2026-03-06',
    title: 'Process notes on clean execution',
    lesson: 'Simple setups worked when I avoided overmanaging winners.',
    note: 'Calendar-linked notes should remain tied to the realized trade date for review.',
    mood: 'Focused',
    tags: ['Process', 'Review'],
  },
  {
    id: 'jnl-004',
    date: '2026-03-04',
    title: 'Discipline over activity',
    lesson: 'One clean trade was enough; not every session needs more action.',
    note: 'Stayed patient after the first winner and protected mental capital.',
    mood: 'Calm',
    tags: ['Discipline'],
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

export const settingsProfile: SettingsProfile = {
  name: 'Brian Lin',
  email: 'brian@tradelog.io',
  timezone: 'America/New_York',
  currency: 'USD',
  dateFormat: 'MMM d, yyyy',
}

export const brokerConnection: BrokerConnection = {
  brokerName: 'Interactive Brokers',
  connected: true,
  statusLabel: 'Connected',
  lastSync: '2 min ago',
  syncFrequency: '2 minutes',
  autoImportTrades: true,
}

export const settingsNotificationPreferences: SettingsNotificationPreferences = {
  journalReminder: true,
  weeklyReview: true,
  brokerSyncErrors: true,
}

export const brokerOptions = [
  'Interactive Brokers',
  'Alpaca',
  'TradeStation',
]

export const timezoneOptions = [
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'UTC',
]

export const currencyOptions = ['USD', 'EUR', 'GBP']

export const dateFormatOptions = ['MMM d, yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd']

export const analyticsTrades: AnalyticsTrade[] = [
  {
    id: 'tr-001',
    date: '2026-03-02',
    symbol: 'NVDA',
    side: 'Long',
    session: 'Open',
    setup: 'Opening range',
    pnl: 280,
  },
  {
    id: 'tr-002',
    date: '2026-03-02',
    symbol: 'AAPL',
    side: 'Long',
    session: 'Open',
    setup: 'Trend continuation',
    pnl: 190,
  },
  {
    id: 'tr-003',
    date: '2026-03-02',
    symbol: 'TSLA',
    side: 'Short',
    session: 'Midday',
    setup: 'VWAP fade',
    pnl: -50,
  },
  {
    id: 'tr-004',
    date: '2026-03-03',
    symbol: 'TSLA',
    side: 'Short',
    session: 'Open',
    setup: 'Failed breakdown',
    pnl: -120,
  },
  {
    id: 'tr-005',
    date: '2026-03-03',
    symbol: 'SPY',
    side: 'Long',
    session: 'Midday',
    setup: 'VWAP reclaim',
    pnl: 70,
  },
  {
    id: 'tr-006',
    date: '2026-03-03',
    symbol: 'AMD',
    side: 'Long',
    session: 'Close',
    setup: 'Late chase',
    pnl: -130,
  },
  {
    id: 'tr-007',
    date: '2026-03-04',
    symbol: 'SPY',
    side: 'Long',
    session: 'Midday',
    setup: 'VWAP reclaim',
    pnl: 72,
  },
  {
    id: 'tr-008',
    date: '2026-03-06',
    symbol: 'AAPL',
    side: 'Long',
    session: 'Open',
    setup: 'Trend continuation',
    pnl: 280,
  },
  {
    id: 'tr-009',
    date: '2026-03-06',
    symbol: 'SPY',
    side: 'Long',
    session: 'Midday',
    setup: 'Range breakout',
    pnl: 170,
  },
  {
    id: 'tr-010',
    date: '2026-03-06',
    symbol: 'QQQ',
    side: 'Long',
    session: 'Close',
    setup: 'Pullback entry',
    pnl: -30,
  },
  {
    id: 'tr-011',
    date: '2026-03-09',
    symbol: 'TSLA',
    side: 'Short',
    session: 'Open',
    setup: 'Failed breakdown',
    pnl: -880,
  },
  {
    id: 'tr-012',
    date: '2026-03-09',
    symbol: 'NVDA',
    side: 'Short',
    session: 'Midday',
    setup: 'Countertrend scalp',
    pnl: -190,
  },
  {
    id: 'tr-013',
    date: '2026-03-09',
    symbol: 'SPY',
    side: 'Long',
    session: 'Midday',
    setup: 'Reversal',
    pnl: 140,
  },
  {
    id: 'tr-014',
    date: '2026-03-09',
    symbol: 'META',
    side: 'Short',
    session: 'Close',
    setup: 'Late fade',
    pnl: -250,
  },
  {
    id: 'tr-015',
    date: '2026-03-10',
    symbol: 'AAPL',
    side: 'Long',
    session: 'Open',
    setup: 'Gap continuation',
    pnl: 120,
  },
  {
    id: 'tr-016',
    date: '2026-03-10',
    symbol: 'SPY',
    side: 'Long',
    session: 'Midday',
    setup: 'Lunch trend',
    pnl: 140,
  },
  {
    id: 'tr-017',
    date: '2026-03-10',
    symbol: 'TSLA',
    side: 'Short',
    session: 'Close',
    setup: 'Fade attempt',
    pnl: -50,
  },
  {
    id: 'tr-018',
    date: '2026-03-11',
    symbol: 'NVDA',
    side: 'Long',
    session: 'Open',
    setup: 'Opening range',
    pnl: 899,
  },
  {
    id: 'tr-019',
    date: '2026-03-11',
    symbol: 'AMD',
    side: 'Long',
    session: 'Open',
    setup: 'Trend continuation',
    pnl: 540,
  },
  {
    id: 'tr-020',
    date: '2026-03-11',
    symbol: 'META',
    side: 'Long',
    session: 'Midday',
    setup: 'Breakout pullback',
    pnl: 420,
  },
  {
    id: 'tr-021',
    date: '2026-03-11',
    symbol: 'AAPL',
    side: 'Long',
    session: 'Midday',
    setup: 'VWAP reclaim',
    pnl: 590,
  },
  {
    id: 'tr-022',
    date: '2026-03-11',
    symbol: 'QQQ',
    side: 'Long',
    session: 'Close',
    setup: 'Scalp stopout',
    pnl: -109,
  },
  {
    id: 'tr-023',
    date: '2026-03-12',
    symbol: 'SPY',
    side: 'Long',
    session: 'Open',
    setup: 'Range breakout',
    pnl: 95,
  },
]
