export type StatusUsuario = 'ATIVO' | 'INATIVO' | 'BLOQUEADO'
export type StatusEvento = 'RASCUNHO' | 'PUBLICADO' | 'ENCERRADO' | 'CANCELADO'
export type StatusInscricao = 'INSCRITO' | 'CHECKIN' | 'SAIU'
export type PapelInscricao = 'PARTICIPANTE' | 'ORGANIZADOR' | 'STAFF' | 'PALESTRANTE'
export type StatusConexao = 'PENDENTE' | 'ACEITA' | 'RECUSADA' | 'BLOQUEADA'
export type TipoPost = 'TEXTO' | 'IMAGEM' | 'VIDEO'
export type VisibilidadePost = 'PUBLICO' | 'PRIVADO'

export interface LoginRequest {
  email: string
  senha: string
}

export interface RegisterRequest {
  nome: string
  email: string
  senha: string
  provider?: string
  providerId?: string
  dataNascimento?: string
  genero?: string
  bio?: string
  fotoPerfil?: string
  cidade?: string
  estado?: string
}

export interface TokenResponse {
  accessToken: string
}

export interface UsuarioResponse {
  id: string
  nome: string
  email: string
  provider: string
  dataNascimento?: string
  genero?: string
  bio?: string
  fotoPerfil?: string
  cidade?: string
  estado?: string
  status: StatusUsuario
  criadoEm: string
  ultimoLogin?: string
}

export interface UsuarioResumo {
  id: string
  nome: string
  fotoPerfil?: string
  cidade?: string
  estado?: string
}

export interface AtualizarUsuarioRequest {
  nome?: string
  email?: string
  senha?: string
  dataNascimento?: string
  genero?: string
  bio?: string
  cidade?: string
  estado?: string
}

export interface AtualizarFotoRequest {
  fotoPerfil: string
}

export interface InteresseResponse {
  id: string
  nome: string
  categoria: string
  icone?: string
}

export interface EventoRequest {
  nome: string
  descricao: string
  banner?: string
  cidade: string
  estado: string
  endereco?: string
  latitude?: number
  longitude?: number
  inicio: string
  fim: string
  capacidade?: number
  privado?: boolean
  status: StatusEvento
}

export interface EventoResponse {
  id: string
  organizador: UsuarioResumo
  nome: string
  descricao: string
  banner?: string
  cidade: string
  estado: string
  endereco?: string
  latitude?: number
  longitude?: number
  inicio: string
  fim: string
  capacidade?: number
  privado: boolean
  status: StatusEvento
  criadoEm: string
  atualizadoEm: string
}

export interface ParticipanteResponse {
  id: string
  usuario: UsuarioResumo
  papel: PapelInscricao
  status: StatusInscricao
  checkin?: boolean
  dataInscricao: string
}

export interface MeuEventoResponse {
  evento: EventoResponse
  papel: PapelInscricao
  status: StatusInscricao
  dataInscricao: string
}

export interface PostRequest {
  eventoId: string
  texto: string
  imagemUrl?: string
  tipo: TipoPost
  visibilidade: VisibilidadePost
}

export interface PostResponse {
  id: string
  eventoId: string
  autor: UsuarioResumo
  texto: string
  imagemUrl?: string
  tipo: TipoPost
  visibilidade: VisibilidadePost
  ativo: boolean
  curtidasCount: number
  curtido: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface FeedEventoResponse {
  evento: EventoResponse
  posts: PostResponse[]
}

export interface ComentarioRequest {
  texto: string
  comentarioPaiId?: string
}

export interface ComentarioResponse {
  id: string
  postId: string
  usuario: UsuarioResumo
  texto: string
  comentarioPaiId?: string
  criadoEm: string
  atualizadoEm: string
}

export interface AgendaRequest {
  eventoId: string
  titulo: string
  descricao?: string
  categoria: string
  local?: string
  inicio: string
  fim: string
  ativo: boolean
}

export interface AgendaResponse {
  id: string
  eventoId: string
  titulo: string
  descricao?: string
  categoria: string
  local?: string
  inicio: string
  fim: string
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface ConexaoResponse {
  id: string
  usuarioOrigem: UsuarioResumo
  usuarioDestino: UsuarioResumo
  status: StatusConexao
  criadoEm: string
}

export interface RelacionamentoResponse {
  status: StatusConexao | 'NENHUM'
}

export interface CursorPaginacao {
  id: string
  data: string
}

export interface PageResponse<T> {
  content: T[]
  nextCursor: CursorPaginacao | null
}