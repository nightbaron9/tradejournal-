import { brokerConnection, settingsNotificationPreferences, settingsProfile } from '../data/mockData'
import type {
  BrokerConnectRequest,
  BrokerConnectResponse,
  BrokerDisconnectResponse,
  BrokerRefreshResponse,
  BrokerSyncStatus,
  BrokerSyncUpdateRequest,
  SettingsPayload,
} from '../api/contracts'
import type { ApiClient } from '../api/client'

export type BrokerService = {
  connectBroker(request: BrokerConnectRequest): Promise<BrokerConnectResponse>
  refreshBroker(): Promise<BrokerRefreshResponse>
  disconnectBroker(): Promise<BrokerDisconnectResponse>
  getSettings(): Promise<SettingsPayload>
  updateSettings(request: BrokerSyncUpdateRequest): Promise<SettingsPayload>
}

export function createBrokerService(client: ApiClient): BrokerService {
  const mockPreferences = {
    timezone: settingsProfile.timezone,
    currency: settingsProfile.currency,
    dateFormat: settingsProfile.dateFormat,
    requireTags: true,
    showOpenPositionSummary: true,
  }

  let mockBrokerStatus: BrokerSyncStatus = {
    connected: brokerConnection.connected,
    brokerName: brokerConnection.brokerName,
    lastSync: brokerConnection.lastSync,
    syncFrequency: brokerConnection.syncFrequency,
    autoImportTrades: brokerConnection.autoImportTrades,
    statusLabel: brokerConnection.statusLabel,
  }

  let mockSettingsPayload: SettingsPayload = {
    profile: {
      name: settingsProfile.name,
      email: settingsProfile.email,
    },
    preferences: { ...mockPreferences },
    notifications: { ...settingsNotificationPreferences },
  }

  const mockBrokerService: BrokerService = {
    async connectBroker(request) {
      await new Promise((resolve) => window.setTimeout(resolve, 700))
      mockBrokerStatus = {
        ...mockBrokerStatus,
        connected: true,
        brokerName: request.brokerName,
        statusLabel: 'Connected',
        lastSync: 'Just now',
      }
      return {
        authorizationUrl: '/app/settings?connected=1',
        status: mockBrokerStatus,
      }
    },

    async refreshBroker() {
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      mockBrokerStatus = {
        ...mockBrokerStatus,
        lastSync: 'Just now',
      }
      return { status: mockBrokerStatus }
    },

    async disconnectBroker() {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      mockBrokerStatus = {
        ...mockBrokerStatus,
        connected: false,
        statusLabel: 'Disconnected',
        lastSync: 'Sync paused',
      }
      return { status: mockBrokerStatus }
    },

    async getSettings() {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      return structuredClone(mockSettingsPayload)
    },

    async updateSettings(request) {
      await new Promise((resolve) => window.setTimeout(resolve, 350))
      mockSettingsPayload = {
        profile: {
          ...mockSettingsPayload.profile,
          ...request.profile,
        },
        preferences: {
          ...mockSettingsPayload.preferences,
          ...request.preferences,
        },
        notifications: {
          ...mockSettingsPayload.notifications,
          ...request.notifications,
        },
      }

      if (request.broker) {
        mockBrokerStatus = {
          ...mockBrokerStatus,
          ...request.broker,
        }
      }

      return structuredClone(mockSettingsPayload)
    },
  }

  const liveBrokerService: BrokerService = {
    connectBroker(request) {
      return client.post<BrokerConnectResponse, BrokerConnectRequest>('/broker/connect', request)
    },
    refreshBroker() {
      return client.post<BrokerRefreshResponse, Record<string, never>>('/broker/refresh', {})
    },
    disconnectBroker() {
      return client.post<BrokerDisconnectResponse, Record<string, never>>('/broker/disconnect', {})
    },
    getSettings() {
      return client.get<SettingsPayload>('/settings')
    },
    updateSettings(request) {
      return client.post<SettingsPayload, BrokerSyncUpdateRequest>('/settings', request)
    },
  }

  return client.useMockData ? mockBrokerService : liveBrokerService
}
