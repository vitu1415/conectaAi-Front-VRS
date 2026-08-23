import type {
  AgendaResponse,
  ComentarioResponse,
  ConexaoResponse,
  EventoResponse,
  ParticipanteResponse,
  PostResponse,
  RelacionamentoResponse,
  StatusConexao,
  UsuarioResponse,
  UsuarioResumo,
} from '@/types/api'
import type {
  AgendaItem,
  Comment,
  Connection,
  ConnectionRequest,
  ConnectionStatus,
  Event,
  PersonProfile,
  Post,
  User,
} from '@/types'

function calcAge(dataNascimento?: string): number {
  if (!dataNascimento) return 0
  const birth = new Date(dataNascimento)
  if (Number.isNaN(birth.getTime())) return 0
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

function formatTime(iso?: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function mapUsuarioResponse(usuario: UsuarioResponse): User {
  return {
    id: usuario.id,
    name: usuario.nome,
    email: usuario.email,
    avatar: usuario.fotoPerfil || '',
    age: calcAge(usuario.dataNascimento),
    city: [usuario.cidade, usuario.estado].filter(Boolean).join(', '),
    description: usuario.bio || undefined,
    interests: [],
    badges: [],
    friends: [],
    level: 0,
    xp: 0,
  }
}

export function mapUsuarioResumo(usuario: UsuarioResumo): User {
  return {
    id: usuario.id,
    name: usuario.nome,
    email: '',
    avatar: usuario.fotoPerfil || '',
    age: 0,
    city: [usuario.cidade, usuario.estado].filter(Boolean).join(', '),
    interests: [],
    badges: [],
    friends: [],
    level: 0,
    xp: 0,
  }
}

export function mapEventoResponse(evento: EventoResponse): Event {
  return {
    id: evento.id,
    title: evento.nome,
    description: evento.descricao,
    image: evento.banner || '',
    banner: evento.banner || '',
    date: evento.inicio,
    city: [evento.cidade, evento.estado].filter(Boolean).join(', '),
    category: '',
    participants: 0,
    maxParticipants: evento.capacidade,
    organizers: [evento.organizador.nome],
    highlights: [],
  }
}

export function mapPostResponse(post: PostResponse): Post {
  return {
    id: post.id,
    eventId: post.eventoId,
    userId: post.autor.id,
    userName: post.autor.nome,
    userAvatar: post.autor.fotoPerfil || '',
    content: post.texto,
    image: post.imagemUrl,
    likes: post.curtidasCount,
    comments: 0,
    shares: 0,
    liked: post.curtido,
    timestamp: post.criadoEm,
    type: 'post',
  }
}

export function mapComentarioResponse(comentario: ComentarioResponse): Comment {
  return {
    id: comentario.id,
    postId: comentario.postId,
    userId: comentario.usuario.id,
    userName: comentario.usuario.nome,
    userAvatar: comentario.usuario.fotoPerfil || '',
    content: comentario.texto,
    timestamp: comentario.criadoEm,
    likes: 0,
    replies: [],
  }
}

export function mapAgendaResponse(item: AgendaResponse): AgendaItem {
  return {
    id: item.id,
    time: formatTime(item.inicio),
    title: item.titulo,
    description: item.descricao || '',
    category: item.categoria,
    favorited: false,
  }
}

export function mapConexaoStatus(status: StatusConexao | 'NENHUM'): ConnectionStatus {
  switch (status) {
    case 'ACEITA':
      return 'CONECTADO'
    case 'RECUSADA':
      return 'RECUSADO'
    case 'BLOQUEADA':
      return 'BLOQUEADO'
    case 'PENDENTE':
    case 'NENHUM':
    default:
      return 'NENHUM'
  }
}

export function mapConexaoResponse(
  conexao: ConexaoResponse,
  currentUserId: string,
): Connection {
  const isOrigem = conexao.usuarioOrigem.id === currentUserId
  const status: ConnectionStatus = isOrigem
    ? mapConexaoStatus(conexao.status)
    : conexao.status === 'PENDENTE'
      ? 'PENDENTE_RECEBIDA'
      : mapConexaoStatus(conexao.status)

  return {
    id: conexao.id,
    usuarioId: isOrigem ? conexao.usuarioDestino.id : conexao.usuarioOrigem.id,
    usuario: isOrigem
      ? mapUsuarioResumo(conexao.usuarioDestino)
      : mapUsuarioResumo(conexao.usuarioOrigem),
    status,
    interessesComuns: [],
    eventosComuns: 0,
    criadoEm: conexao.criadoEm,
  }
}

export function mapRelacionamento(status: RelacionamentoResponse): ConnectionStatus {
  return mapConexaoStatus(status.status)
}

export function mapConexaoRecebida(conexao: ConexaoResponse): ConnectionRequest {
  return {
    id: conexao.id,
    solicitante: mapUsuarioResumo(conexao.usuarioOrigem),
    interessesComuns: [],
    eventoComum: undefined,
    criadoEm: conexao.criadoEm,
  }
}

export function mapParticipanteResponse(participante: ParticipanteResponse): PersonProfile {
  const u = participante.usuario
  return {
    id: u.id,
    name: u.nome,
    age: 0,
    avatar: u.fotoPerfil || '',
    city: [u.cidade, u.estado].filter(Boolean).join(', '),
    interests: [],
    badges: [],
    description: '',
    friendsInCommon: 0,
    distance: '',
  }
}