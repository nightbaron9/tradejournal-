import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../api/contracts'
import { createApiClient } from '../api/client'

type AuthService = {
  signIn(input: SignInRequest): Promise<SignInResponse>
  signUp(input: SignUpRequest): Promise<SignUpResponse>
  requestPasswordReset(input: ResetPasswordRequest): Promise<ResetPasswordResponse>
}

const client = createApiClient()

const mockAuthService: AuthService = {
  async signIn(input) {
    await new Promise((resolve) => window.setTimeout(resolve, 800))

    if (input.email === 'demo@tradelog.io' && input.password === 'Demo1234!pass') {
      return {
        userId: 'user-demo',
        emailVerified: true,
        redirectTo: '/app/dashboard',
      }
    }

    throw new Error('Invalid email or password.')
  },

  async signUp(input) {
    await new Promise((resolve) => window.setTimeout(resolve, 900))

    return {
      userId: `signup-${input.email}`,
      verificationRequired: true,
    }
  },

  async requestPasswordReset() {
    await new Promise((resolve) => window.setTimeout(resolve, 800))

    return {
      accepted: true,
    }
  },
}

const liveAuthService: AuthService = {
  signIn(input) {
    return client.post<SignInResponse, SignInRequest>('/auth/sign-in', input)
  },
  signUp(input) {
    return client.post<SignUpResponse, SignUpRequest>('/auth/sign-up', input)
  },
  requestPasswordReset(input) {
    return client.post<ResetPasswordResponse, ResetPasswordRequest>(
      '/auth/reset-password',
      input,
    )
  },
}

export const authService =
  client.useMockData ? mockAuthService : liveAuthService

export const signIn = authService.signIn.bind(authService)
export const signUp = authService.signUp.bind(authService)
export const requestPasswordReset = authService.requestPasswordReset.bind(authService)
