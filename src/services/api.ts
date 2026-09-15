import axios, { type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function clearAccessToken() {
  accessToken = null
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

async function refreshAccessToken(): Promise<string> {
  const { data } = await refreshClient.post<{ accessToken: string }>('/auth/refresh-token')
  setAccessToken(data.accessToken)
  return data.accessToken
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
      clearAccessToken()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  },
)
