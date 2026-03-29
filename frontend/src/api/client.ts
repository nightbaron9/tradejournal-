const DEFAULT_BASE_URL = '/api'
const DEFAULT_MODE = (import.meta.env.VITE_API_MODE as 'mock' | 'live' | undefined) ?? 'mock'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class ApiClient {
  private readonly baseUrl: string
  readonly mode: 'mock' | 'live'
  readonly useMockData: boolean

  constructor({
    baseUrl = DEFAULT_BASE_URL,
    mode = DEFAULT_MODE,
  }: {
    baseUrl?: string
    mode?: 'mock' | 'live'
  } = {}) {
    this.baseUrl = baseUrl
    this.mode = mode
    this.useMockData = mode !== 'live'
  }

  async request<TResponse>(path: string, options: RequestOptions = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        payload?.message ?? `Request failed with status ${response.status}`,
        response.status,
      )
    }

    return payload as TResponse
  }

  get<TResponse>(path: string) {
    return this.request<TResponse>(path, { method: 'GET' })
  }

  post<TResponse, TBody = unknown>(path: string, body?: TBody) {
    return this.request<TResponse>(path, { method: 'POST', body })
  }
}

export function createApiClient(options?: {
  baseUrl?: string
  mode?: 'mock' | 'live'
}) {
  return new ApiClient(options)
}

export const apiClient = createApiClient()
