import { api } from './api'
import { cursorParams } from '@/utils/cursor'
import type {
  CursorPaginacao,
  EventoRequest,
  EventoResponse,
  PageResponse,
  ParticipanteResponse,
} from '@/types/api'

export async function list(cursor: CursorPaginacao | null = null): Promise<PageResponse<EventoResponse>> {
  const { data } = await api.get<PageResponse<EventoResponse>>('/eventos', {
    params: cursorParams(cursor),
  })
  return data
}

export async function proximos(cursor: CursorPaginacao | null = null): Promise<PageResponse<EventoResponse>> {
  const { data } = await api.get<PageResponse<EventoResponse>>('/eventos/proximos', {
    params: cursorParams(cursor),
  })
  return data
}

export async function getById(id: string): Promise<EventoResponse> {
  const { data } = await api.get<EventoResponse>(`/eventos/${id}`)
  return data
}

export async function create(payload: EventoRequest): Promise<EventoResponse> {
  const { data } = await api.post<EventoResponse>('/eventos', payload)
  return data
}

export async function update(id: string, payload: EventoRequest): Promise<EventoResponse> {
  const { data } = await api.put<EventoResponse>(`/eventos/${id}`, payload)
  return data
}

export async function remove(id: string): Promise<void> {
  await api.delete(`/eventos/${id}`)
}

export async function participar(id: string): Promise<ParticipanteResponse> {
  const { data } = await api.post<ParticipanteResponse>(`/eventos/${id}/participar`)
  return data
}

export async function cancelarInscricao(id: string): Promise<void> {
  await api.delete(`/eventos/${id}/participar`)
}

export async function participantes(
  id: string,
  cursor: CursorPaginacao | null = null,
): Promise<PageResponse<ParticipanteResponse>> {
  const { data } = await api.get<PageResponse<ParticipanteResponse>>(`/eventos/${id}/participantes`, {
    params: cursorParams(cursor),
  })
  return data
}