import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { TokenResponse } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const TOKEN_KEY = '@conectaai:token'
const REFRESH_TOKEN_KEY = '@conectaai:refreshToken'

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('Sem refresh token disponível')
  }
  const { data } = await refreshClient.post<TokenResponse>('/auth/refresh-token', {
    refreshToken,
  })
  tokenStorage.setTokens(data.token, data.refreshToken)
  return data.token
}

interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function isAuthRoute(url?: string) {
  return typeof url === 'string' && url.startsWith('/auth/')
}

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: RetriableRequest | undefined = error.config
    const status = error.response?.status

    if (status !== 401 || !original || original._retry || isAuthRoute(original.url)) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      const newToken = isRefreshing
        ? await new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject })
          })
        : (() => {
            isRefreshing = true
            return refreshAccessToken()
              .then((token) => {
                pendingQueue.forEach(({ resolve }) => resolve(token))
                pendingQueue = []
                return token
              })
              .catch((refreshError) => {
                pendingQueue.forEach(({ reject }) => reject(refreshError))
                pendingQueue = []
                throw refreshError
              })
              .finally(() => {
                isRefreshing = false
              })
          })()

      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch {
      tokenStorage.clear()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  },
)