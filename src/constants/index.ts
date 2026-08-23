export const NAVIGATION_ITEMS = [
  { id: 'feed', label: 'Feed', icon: 'home', path: '/app/feed' },
  { id: 'people', label: 'Pessoas', icon: 'users', path: '/app/people' },
  { id: 'groups', label: 'Grupos', icon: 'message-circle', path: '/app/groups' },
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

export const INTEREST_CATEGORIES = [
  {
    id: 'esportes',
    name: 'Esportes',
    items: [
      'Futebol', 'Vôlei', 'Basquete', 'Tênis', 'Corrida',
      'Academia', 'Yoga', 'Surf', 'Skate', 'Ciclismo',
    ],
  },
  {
    id: 'musica',
    name: 'Música',
    items: [
      'Rock', 'Pop', 'Funk', 'Sertanejo', 'Eletrônica',
      'Hip Hop', 'MPB', 'Jazz', 'Clássica', 'Reggae',
    ],
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    items: [
      'Programação', 'Inteligência Artificial', 'Games', 'Startup', 'Design',
      'Dados', 'Cibersegurança',
    ],
  },
  {
    id: 'arte-cultura',
    name: 'Arte & Cultura',
    items: ['Cinema', 'Fotografia', 'Teatro', 'Dança', 'Pintura', 'Literatura', 'Museus'],
  },
  {
    id: 'gastronomia',
    name: 'Gastronomia',
    items: ['Culinária', 'Vinhos', 'Cerveja Artesanal', 'Café', 'Gastronomia Molecular'],
  },
  {
    id: 'lazer',
    name: 'Lazer',
    items: ['Viagem', 'Trilha', 'Praia', 'Campo', 'Pesca', 'Acampamento'],
  },
  {
    id: 'educacao',
    name: 'Educação',
    items: ['Cursos', 'Workshops', 'Palestras', 'Idiomas'],
  },
] as const

export const INTERESTS = INTEREST_CATEGORIES.flatMap((category) => category.items)
