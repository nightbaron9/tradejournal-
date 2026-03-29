import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type {
  ResetPasswordRequest,
  SessionResponse,
  SignInRequest,
  SignUpRequest,
} from '../api/contracts'
import { createApiClient } from '../api/client'
import { createAuthService } from '../services/authService'
import { createBrokerService } from '../services/brokerService'
import { createTradingDataService } from '../services/tradingDataService'
import type { AppConfig } from './config'

type AppContextValue = {
  config: AppConfig
  session: SessionResponse
  setSession: (session: SessionResponse) => void
  authService: ReturnType<typeof createAuthService>
  brokerService: ReturnType<typeof createBrokerService>
  tradingDataService: ReturnType<typeof createTradingDataService>
  signIn: (request: SignInRequest) => ReturnType<ReturnType<typeof createAuthService>['signIn']>
  signUp: (request: SignUpRequest) => ReturnType<ReturnType<typeof createAuthService>['signUp']>
  requestPasswordReset: (request: ResetPasswordRequest) => ReturnType<ReturnType<typeof createAuthService>['requestPasswordReset']>
  signOut: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({
  children,
  config,
}: PropsWithChildren<{ config: AppConfig }>) {
  const apiClient = useMemo(
    () => createApiClient({ baseUrl: config.apiBaseUrl, mode: config.apiMode }),
    [config.apiBaseUrl, config.apiMode],
  )

  const authService = useMemo(() => createAuthService(apiClient), [apiClient])
  const brokerService = useMemo(() => createBrokerService(apiClient), [apiClient])
  const tradingDataService = useMemo(() => createTradingDataService(apiClient), [apiClient])

  const [session, setSession] = useState<SessionResponse>({
    authenticated: false,
    user: null,
  })

  async function signIn(request: SignInRequest) {
    const response = await authService.signIn(request)
    setSession({
      authenticated: true,
      user: response.user,
    })
    return response
  }

  function signUp(request: SignUpRequest) {
    return authService.signUp(request)
  }

  function requestPasswordReset(request: ResetPasswordRequest) {
    return authService.requestPasswordReset(request)
  }

  async function signOut() {
    await authService.signOut()
    setSession({
      authenticated: false,
      user: null,
    })
  }

  const value = useMemo<AppContextValue>(
    () => ({
      config,
      session,
      setSession,
      authService,
      brokerService,
      tradingDataService,
      signIn,
      signUp,
      requestPasswordReset,
      signOut,
    }),
    [authService, brokerService, config, session, tradingDataService],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
