import { mockEvents } from '@/mocks/events'
import { mockPosts } from '@/mocks/posts'
import { mockPeople } from '@/mocks/people'
import { mockGroups } from '@/mocks/groups'
import { mockAgenda } from '@/mocks/agenda'
import { mockTeams } from '@/mocks/teams'
import { MOCK_USER } from '@/constants'
import type { Event, Post, PersonProfile, Group, AgendaItem, Team, User } from '@/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
    return mockPeople
  },

  async getGroups(): Promise<Group[]> {
    await delay(200)
    return mockGroups
  },

  async getAgenda(): Promise<AgendaItem[]> {
    await delay(200)
    return mockAgenda
  },

  async getTeams(): Promise<Team[]> {
    await delay(200)
    return mockTeams
  },

  async getUser(): Promise<User> {
    await delay(100)
    return MOCK_USER
  },
}
