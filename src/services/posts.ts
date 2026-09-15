import { api } from './api'
import { cursorParams } from '@/utils/cursor'
import type {
  CursorPaginacao,
  FeedEventoResponse,
  PageResponse,
  PostRequest,
  PostResponse,
  TipoPost,
  VisibilidadePost,
} from '@/types/api'

export async function feed(
  usuarioId: string,
  cursor: CursorPaginacao | null = null,
): Promise<PageResponse<FeedEventoResponse>> {
  const { data } = await api.get<PageResponse<FeedEventoResponse>>(`/post/feed/${usuarioId}`, {
    params: cursorParams(cursor),
  })
  return data
}

export async function porEvento(
  eventoId: string,
  cursor: CursorPaginacao | null = null,
): Promise<PageResponse<PostResponse>> {
  const { data } = await api.get<PageResponse<PostResponse>>(`/post/eventos/${eventoId}`, {
    params: cursorParams(cursor),
  })
  return data
}

export async function porUsuario(
  usuarioId: string,
  cursor: CursorPaginacao | null = null,
): Promise<PageResponse<PostResponse>> {
  const { data } = await api.get<PageResponse<PostResponse>>(`/post/usuarios/${usuarioId}`, {
    params: cursorParams(cursor),
  })
  return data
}

export async function criar(
  params: { eventoId: string; texto: string; tipo: TipoPost; visibilidade: VisibilidadePost },
  midias?: File[],
): Promise<PostResponse> {
  const formData = new FormData()
  midias?.forEach((file) => {
    formData.append('midias', file)
  })

  const { data } = await api.post<PostResponse>('/post', formData, {
    params,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getById(id: string): Promise<PostResponse> {
  const { data } = await api.get<PostResponse>(`/post/${id}`)
  return data
}

export async function atualizar(id: string, payload: PostRequest): Promise<PostResponse> {
  const { data } = await api.put<PostResponse>(`/post/${id}`, payload)
  return data
}

export async function excluir(id: string): Promise<void> {
  await api.delete(`/post/${id}`)
}

export async function curtir(id: string): Promise<PostResponse> {
  const { data } = await api.post<PostResponse>(`/post/${id}/curtir`)
  return data
}

export async function descurtir(id: string): Promise<PostResponse> {
  const { data } = await api.delete<PostResponse>(`/post/${id}/curtir`)
  return data
}