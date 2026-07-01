export interface User {
  id: string
  name: string
  email: string
  avatar: string
  age: number
  city: string
  university?: string
  description?: string
  interests: string[]
  badges: Badge[]
  friends: string[]
  friendsInCommon?: number
  distance?: string
  level: number
  xp: number
}

export interface Event {
  id: string
  title: string
  description: string
  image: string
  banner: string
  date: string
  city: string
  category: string
  participants: number
  maxParticipants?: number
  price?: string
  organizers: string[]
  highlights: string[]
}

export interface Post {
  id: string
  eventId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  image?: string
  gif?: string
  poll?: Poll
  likes: number
  comments: number
  shares: number
  liked: boolean
  timestamp: string
  type: 'post' | 'announcement'
}

export interface Poll {
  question: string
  options: PollOption[]
  totalVotes: number
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
}

export interface PersonProfile {
  id: string
  name: string
  age: number
  avatar: string
  city: string
  university?: string
  interests: string[]
  badges: Badge[]
  description: string
  friendsInCommon: number
  distance: string
  liked?: boolean
  connected?: boolean
}

export interface Group {
  id: string
  name: string
  description: string
  image: string
  members: number
  lastActivity: string
  category: string
}

export interface Team {
  id: string
  name: string
  description: string
  admin: string
  adminAvatar: string
  vacancies: number
  members: TeamMember[]
  objectives: string[]
}

export interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
}

export interface AgendaItem {
  id: string
  time: string
  title: string
  description: string
  category: string
  favorited: boolean
}

export interface Badge {
  id: string
  name: string
  icon: string
  color: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  path: string
}
