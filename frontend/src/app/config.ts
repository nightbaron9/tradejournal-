export type AppMode = 'mock' | 'live'

function normalizeMode(value: string | undefined): AppMode {
  return value === 'live' ? 'live' : 'mock'
}

export type AppConfig = {
  apiBaseUrl: string
  apiMode: AppMode
}

export function createAppConfig(): AppConfig {
  const env = import.meta.env

  return {
    apiBaseUrl: env.VITE_API_BASE_URL ?? '/api',
    apiMode: normalizeMode(env.VITE_APP_MODE),
  }
}
