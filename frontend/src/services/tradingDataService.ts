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
import type { ApiClient } from '../api/client'

export type TradingDataset = {
  dashboardSummary: MetricCard[]
  calendarRecords: CalendarRecord[]
  openPositions: Position[]
  tradeRows: TradeRow[]
  journalEntries: JournalEntry[]
  analyticsTrades: AnalyticsTrade[]
}

export type TradingDataService = {
  getDataset(): Promise<TradingDataset>
  getDashboardData(): Promise<{
    dashboardSummary: MetricCard[]
    calendarRecords: CalendarRecord[]
  }>
  getPositions(): Promise<Position[]>
  getTrades(): Promise<TradeRow[]>
  getJournalEntries(): Promise<JournalEntry[]>
  getAnalyticsTrades(): Promise<AnalyticsTrade[]>
}

export function createTradingDataService(client: ApiClient): TradingDataService {
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

  const mockTradingDataService: TradingDataService = {
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

  const liveTradingDataService: TradingDataService = {
    getDataset() {
      return client.get<TradingDataset>('/trading/dataset')
    },
    async getDashboardData() {
      const dataset = await client.get<TradingDataset>('/trading/dataset')
      return {
        dashboardSummary: dataset.dashboardSummary,
        calendarRecords: dataset.calendarRecords,
      }
    },
    async getPositions() {
      const dataset = await client.get<TradingDataset>('/trading/dataset')
      return dataset.openPositions
    },
    async getTrades() {
      const dataset = await client.get<TradingDataset>('/trading/dataset')
      return dataset.tradeRows
    },
    async getJournalEntries() {
      const dataset = await client.get<TradingDataset>('/trading/dataset')
      return dataset.journalEntries
    },
    async getAnalyticsTrades() {
      const dataset = await client.get<TradingDataset>('/trading/dataset')
      return dataset.analyticsTrades
    },
  }

  return client.useMockData ? mockTradingDataService : liveTradingDataService
}
