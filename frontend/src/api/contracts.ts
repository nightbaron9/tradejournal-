export type SignInRequest = {
  email: string
  password: string
  rememberMe: boolean
}

export type SignInResponse = {
  userId: string
  user: SessionUser
  emailVerified: boolean
  redirectTo: string
}

export type SignUpRequest = {
  name: string
  email: string
  password: string
  acceptedTerms: boolean
}

export type SignUpResponse = {
  userId: string
  user: SessionUser
  verificationRequired: boolean
  redirectTo: string
}

export type ResetPasswordRequest = {
  email: string
}

export type ResetPasswordResponse = {
  accepted: boolean
}

export type SessionUser = {
  id: string
  name: string
  email: string
}

export type SessionResponse = {
  authenticated: boolean
  user: SessionUser | null
}

export type SignOutResponse = {
  success: boolean
}

export type BrokerSyncStatus = {
  connected: boolean
  brokerName: string
  lastSync: string
  syncFrequency: string
  autoImportTrades: boolean
  statusLabel: string
}

export type BrokerConnectRequest = {
  brokerName: string
}

export type BrokerConnectResponse = {
  authorizationUrl: string
  status: BrokerSyncStatus
}

export type BrokerRefreshResponse = {
  status: BrokerSyncStatus
}

export type BrokerDisconnectResponse = {
  status: BrokerSyncStatus
}

export type SettingsPreferences = {
  timezone: string
  currency: string
  dateFormat: string
  requireTags: boolean
  showOpenPositionSummary: boolean
}

export type NotificationPreferences = {
  journalReminder: boolean
  weeklyReview: boolean
  brokerSyncErrors: boolean
}

export type SettingsPayload = {
  profile: {
    name: string
    email: string
  }
  preferences: SettingsPreferences
  notifications: NotificationPreferences
}

export type SettingsStatePayload = SettingsPayload & {
  broker: BrokerSyncStatus
}

export type BrokerSyncUpdateRequest = Partial<SettingsStatePayload>
