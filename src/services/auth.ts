import { api } from './api'
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from '@/types/api'

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/login', credentials)
  return data
}

export async function register(payload: RegisterRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/register', payload)
  return data
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken })
}