export const NAVIGATION_ITEMS = [
  { id: 'feed', label: 'Feed', icon: 'home', path: '/app/feed' },
  { id: 'people', label: 'Pessoas', icon: 'users', path: '/app/people' },
  { id: 'groups', label: 'Grupos', icon: 'message-circle', path: '/app/groups' },
  { id: 'teams', label: 'Equipes', icon: 'shield', path: '/app/teams' },
  { id: 'agenda', label: 'Agenda', icon: 'calendar', path: '/app/agenda' },
  { id: 'announcements', label: 'Avisos', icon: 'megaphone', path: '/app/announcements' },
  { id: 'profile', label: 'Perfil', icon: 'user', path: '/app/profile' },
] as const

export const EVENT_CATEGORIES = [
  'Todos',
  'Festas',
  'Tecnologia',
  'Música',
  'Esportes',
  'Networking',
  'Shows',
  'Feiras',
  'Congressos',
  'Festivais',
] as const

export const INTERESTS = [
  'Tecnologia', 'Música', 'Esportes', 'Arte', 'Fotografia',
  'Games', 'Cinema', 'Gastronomia', 'Viagem', 'Moda',
  'Dança', 'Teatro', 'Literatura', 'Natureza', 'Animais',
  'Voluntariado', 'Empreendedorismo', 'Inovação', 'Ciência', 'História',
] as const

export const GROUP_CATEGORIES = [
  { id: 'freshmen', name: '🎓 Calouros', description: 'Calouros e novatos' },
  { id: 'openbar', name: '🍺 Open Bar', description: 'Open Bar e bebidas' },
  { id: 'rides', name: '🚗 Caronas', description: 'Caronas compartilhadas' },
  { id: 'funk', name: '🎵 Funk', description: 'Amantes do Funk' },
  { id: 'rock', name: '🎸 Rock', description: 'Fãs de Rock' },
  { id: 'networking', name: '🤝 Networking', description: 'Networking profissional' },
  { id: 'photography', name: '📸 Fotografia', description: 'Fotografia do evento' },
  { id: 'games', name: '🎮 Games', description: 'Gamers unidos' },
  { id: 'running', name: '🏃 Corrida', description: 'Corredores do evento' },
] as const

export const MOCK_USER: import('@/types').User = {
  id: 'user-1',
  name: 'Rafael Silva',
  email: 'rafael@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
  age: 24,
  city: 'São Paulo, SP',
  university: 'USP',
  description: 'Apaixonado por tecnologia e música. Vamos nos conectar!',
  interests: ['Tecnologia', 'Música', 'Games', 'Fotografia'],
  badges: [
    { id: 'b1', name: 'Veterano', icon: 'trophy', color: 'yellow' },
    { id: 'b2', name: 'Conectado', icon: 'zap', color: 'cyan' },
    { id: 'b3', name: 'Social', icon: 'users', color: 'orange' },
  ],
  friends: ['user-2', 'user-3', 'user-4'],
  level: 7,
  xp: 2450,
}
