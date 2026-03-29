import { useEffect, useMemo, useState } from 'react'
import type {
  AnalyticsTrade,
  CalendarRecord,
  JournalEntry,
  MetricCard,
  Position,
  TradeRow,
} from '../data/mockData'
import { useAppContext } from '../app/AppContext'

type TradingDataState<T> = {
  data: T
  loading: boolean
}

function useAsyncData<T>(load: () => Promise<T>, initialData: T): TradingDataState<T> {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
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
  const { tradingDataService } = useAppContext()

  return useAsyncData<{ dashboardSummary: MetricCard[]; calendarRecords: CalendarRecord[] }>(
    () => tradingDataService.getDashboardData(),
    {
      dashboardSummary: [],
      calendarRecords: [],
    },
  )
}

export function usePositionsData() {
  const { tradingDataService } = useAppContext()
  return useAsyncData<Position[]>(() => tradingDataService.getPositions(), [])
}

export function useTradesData() {
  const { tradingDataService } = useAppContext()
  return useAsyncData<TradeRow[]>(() => tradingDataService.getTrades(), [])
}

export function useJournalEntries() {
  const { tradingDataService } = useAppContext()
  return useAsyncData<JournalEntry[]>(() => tradingDataService.getJournalEntries(), [])
}

export function useAnalyticsTrades() {
  const { tradingDataService } = useAppContext()
  return useAsyncData<AnalyticsTrade[]>(() => tradingDataService.getAnalyticsTrades(), [])
}

export function useTradeSymbols(trades: TradeRow[]) {
  return useMemo(() => Array.from(new Set(trades.map((trade) => trade.symbol))), [trades])
}
