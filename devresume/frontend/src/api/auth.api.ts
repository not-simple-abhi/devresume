import { apiClient, unwrap } from './client'
import type { AuthResponse, LoginRequest, RefreshResponse, SignupRequest, User } from '@/types/auth.types'

export const authApi = {
  signup: (body: SignupRequest) =>
    apiClient.post<{ data: User }>('/auth/signup', body).then(unwrap),

  login: (body: LoginRequest) =>
    apiClient.post<{ data: AuthResponse }>('/auth/login', body).then(unwrap),

  refresh: (refreshToken: string) =>
    apiClient
      .post<{ data: RefreshResponse }>('/auth/refresh', { refreshToken })
      .then(unwrap),
}
