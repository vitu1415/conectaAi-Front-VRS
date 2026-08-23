import { api } from './api'
import type { ConexaoResponse, RelacionamentoResponse } from '@/types/api'

export async function enviar(usuarioId: string): Promise<ConexaoResponse> {
  const { data } = await api.post<ConexaoResponse>(`/usuarios/${usuarioId}/conexoes`)
  return data
}

export async function recebidas(): Promise<ConexaoResponse[]> {
  const { data } = await api.get<ConexaoResponse[]>('/usuarios/me/conexoes/recebidas')
  return data
}

export async function enviadas(): Promise<ConexaoResponse[]> {
  const { data } = await api.get<ConexaoResponse[]>('/usuarios/me/conexoes/enviadas')
  return data
}

export async function listar(usuarioId: string): Promise<ConexaoResponse[]> {
  const { data } = await api.get<ConexaoResponse[]>(`/usuarios/${usuarioId}/conexoes`)
  return data
}

export async function relacao(usuarioId: string): Promise<RelacionamentoResponse> {
  const { data } = await api.get<RelacionamentoResponse>(`/usuarios/${usuarioId}/conexao`)
  return data
}

export async function aceitar(conexaoId: string): Promise<ConexaoResponse> {
  const { data } = await api.patch<ConexaoResponse>(`/conexoes/${conexaoId}/aceitar`)
  return data
}

export async function recusar(conexaoId: string): Promise<ConexaoResponse> {
  const { data } = await api.patch<ConexaoResponse>(`/conexoes/${conexaoId}/recusar`)
  return data
}

export async function remover(conexaoId: string): Promise<void> {
  await api.delete(`/conexoes/${conexaoId}`)
}