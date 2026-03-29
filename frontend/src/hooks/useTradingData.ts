import { useEffect, useMemo, useState } from 'react'
import type {
  AnalyticsTrade,
  CalendarRecord,
  JournalEntry,
  MetricCard,
  Position,
  TradeRow,
} from '../data/mockData'
import { tradingDataService } from '../services/tradingDataService'

type TradingDataState<T> = {
  data: T
  loading: boolean
}

function useAsyncData<T>(load: () => Promise<T>, initialData: T): TradingDataState<T> {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void load().then((result) => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [load])

  return { data, loading }
}

export function useDashboardData() {
  return useAsyncData<{ dashboardSummary: MetricCard[]; calendarRecords: CalendarRecord[] }>(
    () => tradingDataService.getDashboardData(),
    {
      dashboardSummary: [],
      calendarRecords: [],
    },
  )
}

export function usePositionsData() {
  return useAsyncData<Position[]>(() => tradingDataService.getPositions(), [])
}

export function useTradesData() {
  return useAsyncData<TradeRow[]>(() => tradingDataService.getTrades(), [])
}

export function useJournalEntries() {
  return useAsyncData<JournalEntry[]>(() => tradingDataService.getJournalEntries(), [])
}

export function useAnalyticsTrades() {
  return useAsyncData<AnalyticsTrade[]>(() => tradingDataService.getAnalyticsTrades(), [])
}

export function useTradeSymbols(trades: TradeRow[]) {
  return useMemo(
    () => Array.from(new Set(trades.map((trade) => trade.symbol))),
    [trades],
  )
}
