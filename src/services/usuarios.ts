import { api } from './api'
import type {
  AtualizarFotoRequest,
  AtualizarUsuarioRequest,
  InteresseResponse,
  MeuEventoResponse,
  UsuarioResponse,
} from '@/types/api'

export async function me(): Promise<UsuarioResponse> {
  const { data } = await api.get<UsuarioResponse>('/usuarios/me')
  return data
}

export async function getById(id: string): Promise<UsuarioResponse> {
  const { data } = await api.get<UsuarioResponse>(`/usuarios/${id}`)
  return data
}

export async function updateMe(payload: AtualizarUsuarioRequest): Promise<UsuarioResponse> {
  const { data } = await api.put<UsuarioResponse>('/usuarios/me', payload)
  return data
}

export async function updateFoto(payload: AtualizarFotoRequest): Promise<UsuarioResponse> {
  const { data } = await api.patch<UsuarioResponse>('/usuarios/me/foto', payload)
  return data
}

export async function getInteresses(): Promise<InteresseResponse[]> {
  const { data } = await api.get<InteresseResponse[]>('/usuarios/me/interesses')
  return data
}

export async function updateInteresses(interesses: string[]): Promise<InteresseResponse[]> {
  const { data } = await api.put<InteresseResponse[]>('/usuarios/me/interesses', interesses)
  return data
}

export async function getMeusEventos(): Promise<MeuEventoResponse[]> {
  const { data } = await api.get<MeuEventoResponse[]>('/usuarios/me/eventos')
  return data
}