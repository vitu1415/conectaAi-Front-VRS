import { api } from './api'
import type { ComentarioRequest, ComentarioResponse } from '@/types/api'

export async function listar(postId: string): Promise<ComentarioResponse[]> {
  const { data } = await api.get<ComentarioResponse[]>(`/comentarios/post/${postId}`)
  return data
}

export async function criar(postId: string, payload: ComentarioRequest): Promise<ComentarioResponse> {
  const { data } = await api.post<ComentarioResponse>(`/comentarios/post/${postId}`, payload)
  return data
}

export async function atualizar(id: string, payload: ComentarioRequest): Promise<ComentarioResponse> {
  const { data } = await api.put<ComentarioResponse>(`/comentarios/${id}`, payload)
  return data
}

export async function excluir(id: string): Promise<void> {
  await api.delete(`/comentarios/${id}`)
}