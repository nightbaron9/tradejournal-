import {
  analyticsTrades,
  calendarRecords,
  dashboardSummary,
  journalEntries,
  openPositions,
  tradeRows,
  type AnalyticsTrade,
  type CalendarRecord,
  type JournalEntry,
  type MetricCard,
  type Position,
  type TradeRow,
} from '../data/mockData'

export type TradingDataset = {
  dashboardSummary: MetricCard[]
  calendarRecords: CalendarRecord[]
  openPositions: Position[]
  tradeRows: TradeRow[]
  journalEntries: JournalEntry[]
  analyticsTrades: AnalyticsTrade[]
}

const mockDataset: TradingDataset = {
  dashboardSummary,
  calendarRecords,
  openPositions,
  tradeRows,
  journalEntries,
  analyticsTrades,
}

async function cloneDataset(): Promise<TradingDataset> {
  await new Promise((resolve) => window.setTimeout(resolve, 150))
  return structuredClone(mockDataset)
}

export const tradingDataService = {
  getDataset() {
    return cloneDataset()
  },
  async getDashboardData() {
    const dataset = await cloneDataset()
    return {
      dashboardSummary: dataset.dashboardSummary,
      calendarRecords: dataset.calendarRecords,
    }
  },
  async getPositions() {
    const dataset = await cloneDataset()
    return dataset.openPositions
  },
  async getTrades() {
    const dataset = await cloneDataset()
    return dataset.tradeRows
  },
  async getJournalEntries() {
    const dataset = await cloneDataset()
    return dataset.journalEntries
  },
  async getAnalyticsTrades() {
    const dataset = await cloneDataset()
    return dataset.analyticsTrades
  },
}
