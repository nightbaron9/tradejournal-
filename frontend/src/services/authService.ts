import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
  SessionResponse,
  SessionUser,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../api/contracts'
import type { ApiClient } from '../api/client'

export type AuthService = {
  signIn(input: SignInRequest): Promise<SignInResponse>
  signUp(input: SignUpRequest): Promise<SignUpResponse>
  requestPasswordReset(input: ResetPasswordRequest): Promise<ResetPasswordResponse>
  signOut(): Promise<void>
  getSession(): Promise<SessionResponse>
}

export function createAuthService(client: ApiClient): AuthService {
  const demoUser: SessionUser = {
    id: 'user-demo',
    name: 'Brian Lin',
    email: 'demo@tradelog.io',
  }

  const mockAuthService: AuthService = {
    async signIn(input) {
      await new Promise((resolve) => window.setTimeout(resolve, 800))

      if (input.email === 'demo@tradelog.io' && input.password === 'Demo1234!pass') {
        return {
          userId: demoUser.id,
          user: demoUser,
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
        user: {
          id: `signup-${input.email}`,
          name: input.name,
          email: input.email,
        },
        verificationRequired: true,
        redirectTo: '/app/dashboard',
      }
    },

    async requestPasswordReset() {
      await new Promise((resolve) => window.setTimeout(resolve, 800))
      return { accepted: true }
    },

    async signOut() {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
    },

    async getSession() {
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      return {
        authenticated: false,
        user: null,
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
      return client.post<ResetPasswordResponse, ResetPasswordRequest>('/auth/reset-password', input)
    },
    async signOut() {
      await client.post<{ ok: true }, Record<string, never>>('/auth/sign-out', {})
    },
    getSession() {
      return client.get<SessionResponse>('/auth/session')
    },
  }

  return client.useMockData ? mockAuthService : liveAuthService
}
