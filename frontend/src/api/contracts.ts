export type SignInRequest = {
  email: string
  password: string
  rememberMe: boolean
}

export type SignInResponse = {
  userId: string
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
  verificationRequired: boolean
}

export type ResetPasswordRequest = {
  email: string
}

export type ResetPasswordResponse = {
  accepted: boolean
}

export type BrokerSyncStatus = {
  connected: boolean
  brokerName: string
  lastSync: string
  syncFrequency: string
  autoImportTrades: boolean
}

export type BrokerConnectRequest = {
  brokerName: string
}

export type BrokerConnectResponse = {
  authorizationUrl: string
}

export type BrokerRefreshResponse = {
  status: BrokerSyncStatus
}
