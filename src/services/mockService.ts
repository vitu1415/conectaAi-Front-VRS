import { mockEvents } from '@/mocks/events'
import { mockPosts } from '@/mocks/posts'
import { mockPeople } from '@/mocks/people'
import { mockGroups } from '@/mocks/groups'
import { mockAgenda } from '@/mocks/agenda'
import {
  mockConnections,
  mockConnectionRequests,
  mockPeopleWithStatus,
  mockConnectionsStats,
} from '@/mocks/connections'
import { MOCK_USER } from '@/constants'
import type {
  Event, Post, PersonProfile, Group, AgendaItem, User,
  Connection, ConnectionRequest, ConnectionStatus,
} from '@/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let connectionsState = [...mockConnections]
let connectionRequestsState = [...mockConnectionRequests]

export const mockService = {
  async getEvents(): Promise<Event[]> {
    await delay(300)
    return mockEvents
  },

  async getEvent(id: string): Promise<Event | undefined> {
    await delay(200)
    return mockEvents.find((e) => e.id === id)
  },

  async getPosts(eventId?: string): Promise<Post[]> {
    await delay(300)
    if (eventId) return mockPosts.filter((p) => p.eventId === eventId)
    return mockPosts
  },

  async getPeople(): Promise<PersonProfile[]> {
    await delay(300)
    return mockPeopleWithStatus(mockPeople) as PersonProfile[]
  },

  async getGroups(): Promise<Group[]> {
    await delay(200)
    return mockGroups
  },

  async getAgenda(): Promise<AgendaItem[]> {
    await delay(200)
    return mockAgenda
  },

  async getUser(): Promise<User> {
    await delay(100)
    return MOCK_USER
  },

  async getConnections(): Promise<Connection[]> {
    await delay(200)
    return connectionsState
  },

  async getConnectionRequests(): Promise<ConnectionRequest[]> {
    await delay(200)
    return connectionRequestsState
  },

  async getCommonConnections(userId: string): Promise<Connection[]> {
    await delay(200)
    return connectionsState.filter((c) => c.usuarioId !== userId && c.status === 'CONECTADO')
  },

  async getConnectionsByEvent(eventName: string): Promise<Connection[]> {
    await delay(200)
    return connectionsState.filter((c) => c.eventoOrigem === eventName && c.status === 'CONECTADO')
  },

  async getConnectionsStats(): Promise<typeof mockConnectionsStats> {
    await delay(100)
    return {
      connectionsCount: connectionsState.length,
      pendingRequestsCount: connectionRequestsState.length,
    }
  },

  async sendConnectionRequest(userId: string): Promise<ConnectionRequest> {
    await delay(300)
    const person = mockPeople.find((p) => p.id === userId)
    if (!person) throw new Error('Usuário não encontrado')
    const request: ConnectionRequest = {
      id: `req-${Date.now()}`,
      solicitante: MOCK_USER,
      interessesComuns: person.interests.slice(0, 2),
      eventoComum: 'Tech Summit 2026',
      criadoEm: new Date().toISOString(),
    }
    connectionRequestsState = [request, ...connectionRequestsState]
    return request
  },

  async acceptConnection(requestId: string): Promise<Connection> {
    await delay(200)
    const reqIndex = connectionRequestsState.findIndex((r) => r.id === requestId)
    if (reqIndex === -1) throw new Error('Solicitação não encontrada')
    const req = connectionRequestsState[reqIndex]
    connectionRequestsState = connectionRequestsState.filter((r) => r.id !== requestId)
    const connection: Connection = {
      id: `conn-${Date.now()}`,
      usuarioId: req.solicitante.id,
      usuario: req.solicitante,
      status: 'CONECTADO',
      interessesComuns: req.interessesComuns,
      eventosComuns: 1,
      criadoEm: new Date().toISOString(),
    }
    connectionsState = [connection, ...connectionsState]
    return connection
  },

  async rejectConnection(requestId: string): Promise<void> {
    await delay(200)
    const exists = connectionRequestsState.some((r) => r.id === requestId)
    if (!exists) throw new Error('Solicitação não encontrada')
    connectionRequestsState = connectionRequestsState.filter((r) => r.id !== requestId)
  },

  async removeConnection(connectionId: string): Promise<void> {
    await delay(200)
    connectionsState = connectionsState.filter((c) => c.id !== connectionId)
  },

  async getConnectionStatus(userId: string): Promise<{ conectado: boolean; solicitacaoPendente: boolean }> {
    await delay(100)
    const isConnected = connectionsState.some((c) => c.usuarioId === userId && c.status === 'CONECTADO')
    const hasPending = connectionRequestsState.some(
      (r) => r.solicitante.id === userId,
    )
    return {
      conectado: isConnected,
      solicitacaoPendente: hasPending,
    }
  },
}
