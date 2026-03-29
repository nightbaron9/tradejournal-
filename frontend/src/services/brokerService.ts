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
import { apiClient } from '../api/client'

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

async function mockConnectBroker(request: BrokerConnectRequest): Promise<BrokerConnectResponse> {
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
}

async function mockRefreshBroker(): Promise<BrokerRefreshResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, 600))
  mockBrokerStatus = {
    ...mockBrokerStatus,
    lastSync: 'Just now',
  }
  return { status: mockBrokerStatus }
}

async function mockDisconnectBroker(): Promise<BrokerDisconnectResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, 500))
  mockBrokerStatus = {
    ...mockBrokerStatus,
    connected: false,
    statusLabel: 'Disconnected',
    lastSync: 'Sync paused',
  }
  return { status: mockBrokerStatus }
}

async function mockGetSettings(): Promise<SettingsPayload> {
  await new Promise((resolve) => window.setTimeout(resolve, 250))
  return structuredClone(mockSettingsPayload)
}

async function mockUpdateSettings(request: BrokerSyncUpdateRequest): Promise<SettingsPayload> {
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
}

async function liveConnectBroker(request: BrokerConnectRequest) {
  return apiClient.post<BrokerConnectResponse, BrokerConnectRequest>('/broker/connect', request)
}

async function liveRefreshBroker() {
  return apiClient.post<BrokerRefreshResponse, Record<string, never>>('/broker/refresh', {})
}

async function liveDisconnectBroker() {
  return apiClient.post<BrokerDisconnectResponse, Record<string, never>>('/broker/disconnect', {})
}

async function liveGetSettings() {
  return apiClient.get<SettingsPayload>('/settings')
}

async function liveUpdateSettings(request: BrokerSyncUpdateRequest) {
  return apiClient.post<SettingsPayload, BrokerSyncUpdateRequest>('/settings', request)
}

export const brokerService = {
  connectBroker(request: BrokerConnectRequest) {
    return apiClient.mode === 'live' ? liveConnectBroker(request) : mockConnectBroker(request)
  },
  refreshBroker() {
    return apiClient.mode === 'live' ? liveRefreshBroker() : mockRefreshBroker()
  },
  disconnectBroker() {
    return apiClient.mode === 'live' ? liveDisconnectBroker() : mockDisconnectBroker()
  },
  getSettings() {
    return apiClient.mode === 'live' ? liveGetSettings() : mockGetSettings()
  },
  updateSettings(request: BrokerSyncUpdateRequest) {
    return apiClient.mode === 'live' ? liveUpdateSettings(request) : mockUpdateSettings(request)
  },
}
