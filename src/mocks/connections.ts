import type { Connection, ConnectionRequest } from '@/types'
import { MOCK_USER } from '@/constants'

export const mockConnections: Connection[] = [
  {
    id: 'conn-1',
    usuarioId: 'person-1',
    usuario: {
      id: 'person-1',
      name: 'Julia Costa',
      email: 'julia@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
      age: 22,
      city: 'São Paulo, SP',
      university: 'USP',
      description: 'Amo festivais e conhecer pessoas novas!',
      interests: ['Música', 'Fotografia', 'Viagem'],
      badges: [{ id: 'b1', name: 'Fotógrafa', icon: 'camera', color: 'cyan' }],
      friends: [],
      level: 5,
      xp: 1200,
    },
    status: 'CONECTADO',
    interessesComuns: ['Música', 'Fotografia'],
    eventosComuns: 3,
    eventoOrigem: 'Lollapalooza',
    criadoEm: '2026-07-10T14:30:00Z',
  },
  {
    id: 'conn-2',
    usuarioId: 'person-3',
    usuario: {
      id: 'person-3',
      name: 'Marina Oliveira',
      email: 'marina@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina',
      age: 23,
      city: 'São Paulo, SP',
      university: 'FGV',
      description: 'Dançarina e apaixonada por arte.',
      interests: ['Dança', 'Teatro', 'Moda'],
      badges: [{ id: 'b4', name: 'Dancer', icon: 'music', color: 'pink' }],
      friends: [],
      level: 4,
      xp: 980,
    },
    status: 'CONECTADO',
    interessesComuns: ['Teatro'],
    eventosComuns: 1,
    eventoOrigem: 'Rock in Rio',
    criadoEm: '2026-07-08T10:00:00Z',
  },
  {
    id: 'conn-3',
    usuarioId: 'person-6',
    usuario: {
      id: 'person-6',
      name: 'Rafael Lima',
      email: 'rafael@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
      age: 26,
      city: 'São Paulo, SP',
      university: 'Mackenzie',
      description: 'Músico e produtor.',
      interests: ['Música', 'Produção', 'Tecnologia'],
      badges: [{ id: 'b7', name: 'Músico', icon: 'music', color: 'blue' }],
      friends: [],
      level: 7,
      xp: 2800,
    },
    status: 'CONECTADO',
    interessesComuns: ['Música'],
    eventosComuns: 2,
    eventoOrigem: 'Lollapalooza',
    criadoEm: '2026-07-06T15:00:00Z',
  },
]

export const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req-1',
    solicitante: {
      id: 'person-2',
      name: 'Gabriel Torres',
      email: 'gabriel@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel',
      age: 25,
      city: 'Campinas, SP',
      university: 'UNICAMP',
      description: 'Dev e gamer nas horas vagas.',
      interests: ['Tecnologia', 'Games', 'Esportes'],
      badges: [{ id: 'b3', name: 'Gamer', icon: 'gamepad-2', color: 'purple' }],
      friends: [],
      level: 8,
      xp: 3200,
    },
    interessesComuns: ['Tecnologia', 'Games'],
    eventoComum: 'Tech Summit 2026',
    criadoEm: '2026-07-13T20:15:00Z',
  },
  {
    id: 'req-2',
    solicitante: {
      id: 'person-5',
      name: 'Larissa Santos',
      email: 'larissa@email.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Larissa',
      age: 21,
      city: 'Belo Horizonte, MG',
      university: 'UFMG',
      description: 'Foodie e fotógrafa amadora.',
      interests: ['Fotografia', 'Cinema', 'Gastronomia'],
      badges: [{ id: 'b6', name: 'Foodie', icon: 'utensils-crossed', color: 'orange' }],
      friends: [],
      level: 3,
      xp: 650,
    },
    interessesComuns: ['Fotografia'],
    eventoComum: 'Festival de Inverno',
    criadoEm: '2026-07-12T09:30:00Z',
  },
]

export const mockPeopleWithStatus = (mockPeople: { id: string }[]) =>
  mockPeople.map((p) => ({
    ...p,
    connectionStatus: (p.id === 'person-1' || p.id === 'person-3'
      ? 'CONECTADO'
      : p.id === 'person-2'
        ? 'PENDENTE_RECEBIDA'
        : p.id === 'person-5'
          ? 'PENDENTE_ENVIADA'
          : 'NENHUM') as Connection['status'],
    liked: p.id === 'person-1',
  }))

export const mockConnectionsStats = {
  connectionsCount: mockConnections.length,
  pendingRequestsCount: mockConnectionRequests.length,
}
