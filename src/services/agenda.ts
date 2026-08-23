import { api } from './api'
import type { AgendaRequest, AgendaResponse } from '@/types/api'

export async function listar(eventoId: string): Promise<AgendaResponse[]> {
  const { data } = await api.get<AgendaResponse[]>('/agenda', { params: { eventoId } })
  return data
}

export async function criar(payload: AgendaRequest): Promise<AgendaResponse> {
  const { data } = await api.post<AgendaResponse>('/agenda', payload)
  return data
}

export async function atualizar(id: string, payload: AgendaRequest): Promise<AgendaResponse> {
  const { data } = await api.put<AgendaResponse>(`/agenda/${id}`, payload)
  return data
}

export async function excluir(id: string): Promise<void> {
  await api.delete(`/agenda/${id}`)
}