import axios, { type InternalAxiosRequestConfig } from 'axios'
import { env } from '../app/config/env'
import type { AuthResponse, RefreshTokenRequest } from '../features/auth/types/auth.types'
import { useAuthStore } from '../stores/authStore'
import type { ApiResponse } from '../types/api'

const clientConfig = {
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
}

// Các feature gọi API qua hai client này, không tạo Axios instance riêng.
export const http = axios.create(clientConfig)
export const publicHttp = axios.create(clientConfig)

// Tách client refresh để lỗi 401 của refresh không chạy lại interceptor vô hạn.
const refreshClient = axios.create(clientConfig)

interface AuthRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _sessionVersion?: number
  _accessToken?: string
}

let refreshing: { version: number; promise: Promise<AuthResponse> } | null = null

async function refreshSession(version: number, refreshToken: string) {
  try {
    // BE hiện nhận refreshToken trong JSON body, không đọc refresh cookie như SWP.
    const body: RefreshTokenRequest = { refreshToken }
    const response = await refreshClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/refresh',
      body,
    )
    const session = response.data.data

    if (!session.accessToken || !session.refreshToken || !session.user) {
      throw new Error('Backend returned an invalid authentication session.')
    }

    if (!useAuthStore.getState().updateSession(version, session)) {
      throw new axios.CanceledError('Authentication session changed.')
    }

    return session
  } catch (error: unknown) {
    // Mất mạng/5xx vẫn giữ phiên để thử lại sau; refresh bị từ chối mới xóa phiên.
    if (axios.isAxiosError(error) && useAuthStore.getState().sessionVersion === version) {
      const status = error.response?.status
      if (status === 400 || status === 401 || status === 403) {
        useAuthStore.getState().clearSession()
      }
    }
    throw error
  }
}

http.interceptors.request.use((config: AuthRequestConfig) => {
  const state = useAuthStore.getState()

  if (config._retry && config._sessionVersion !== state.sessionVersion) {
    throw new axios.CanceledError('Authentication session changed.')
  }

  config._sessionVersion = state.sessionVersion
  config._accessToken = state.session?.accessToken

  if (state.session) {
    config.headers.set('Authorization', `Bearer ${state.session.accessToken}`)
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw error
    }

    const request = error.config as AuthRequestConfig | undefined
    if (error.response?.status !== 401 || !request || request._retry) {
      throw error
    }

    const state = useAuthStore.getState()
    const session = state.session

    // Chỉ refresh request đã dùng phiên đăng nhập này, không tự đăng nhập lại cho Guest.
    if (!session || !request._accessToken || request._sessionVersion !== state.sessionVersion) {
      throw error
    }

    request._retry = true

    // Một request khác có thể đã refresh xong trước khi lỗi 401 này trả về.
    if (request._accessToken !== session.accessToken) {
      return http(request)
    }

    // Nhiều request 401 cùng phiên dùng chung một lần refresh, không đổi token nhiều lần.
    if (!refreshing || refreshing.version !== state.sessionVersion) {
      const version = state.sessionVersion
      const promise = refreshSession(version, session.refreshToken).finally(() => {
        if (refreshing?.version === version) {
          refreshing = null
        }
      })
      refreshing = { version, promise }
    }

    await refreshing.promise

    if (useAuthStore.getState().sessionVersion !== state.sessionVersion) {
      throw new axios.CanceledError('Authentication session changed.')
    }

    return http(request)
  },
)

// Login/register/verify-otp/activate dùng publicHttp: không tự gắn token hoặc refresh.
// Khi activate, service sẽ truyền token từ bước verify-otp vào header của riêng request đó.
