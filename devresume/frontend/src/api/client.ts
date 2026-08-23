import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/lib/constants'

// Extend config to track retry state
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach access token
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const token: string | null = parsed?.state?.accessToken ?? null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // ignore malformed storage
    }
  }
  return config
})

// Response interceptor — refresh token on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    const data = error.response?.data as { message?: string } | undefined

    if (
      error.response?.status === 401 &&
      data?.message === 'Token expired' &&
      original &&
      !original._retry
    ) {
      original._retry = true
      try {
        const raw = localStorage.getItem('auth-storage')
        if (!raw) throw new Error('No auth storage')
        const parsed = JSON.parse(raw)
        const refreshToken: string = parsed?.state?.refreshToken

        const { data: refreshData } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        )
        const newToken: string = refreshData.data.accessToken

        // Update stored token
        parsed.state.accessToken = newToken
        localStorage.setItem('auth-storage', JSON.stringify(parsed))

        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch {
        // Refresh failed — clear auth and redirect to login
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Generic response unwrapper
export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data
}
