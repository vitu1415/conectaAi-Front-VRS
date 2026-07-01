import type { Team } from '@/types'

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Beer Pong Masters',
    description: 'Equipe de Beer Pong - Os melhores no jogo!',
    admin: 'Rafael Silva',
    adminAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
    vacancies: 3,
    members: [
      { id: 't1-u1', name: 'Rafael Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael', role: 'admin' },
      { id: 't1-u2', name: 'Lucas Oliveira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', role: 'member' },
      { id: 't1-u3', name: 'Julia Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia', role: 'member' },
    ],
    objectives: ['Vencer o campeonato', 'Treinar toda semana', 'Conhecer novas equipes'],
  },
  {
    id: 'team-2',
    name: 'Trucão Universitário',
    description: 'Equipe de Truco - Vamo trucar!',
    admin: 'Gabriel Torres',
    adminAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel',
    vacancies: 2,
    members: [
      { id: 't2-u1', name: 'Gabriel Torres', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel', role: 'admin' },
      { id: 't2-u2', name: 'Pedro Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro', role: 'member' },
    ],
    objectives: ['Ser campeão do torneio', 'Ensinar novos jogadores'],
  },
  {
    id: 'team-3',
    name: 'Vôlei Arena',
    description: 'Equipe de vôlei de praia.',
    admin: 'Marina Oliveira',
    adminAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina',
    vacancies: 4,
    members: [
      { id: 't3-u1', name: 'Marina Oliveira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina', role: 'admin' },
      { id: 't3-u2', name: 'Thiago Almeida', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thiago', role: 'member' },
    ],
    objectives: ['Formar time completo', 'Treinar para o torneio', 'Fazer amizades'],
  },
  {
    id: 'team-4',
    name: 'Churrasqueiros',
    description: 'Equipe responsável pelo churrasco do evento.',
    admin: 'Carla Mendes',
    adminAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla',
    vacancies: 5,
    members: [
      { id: 't4-u1', name: 'Carla Mendes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla', role: 'admin' },
      { id: 't4-u2', name: 'Rafael Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael', role: 'member' },
      { id: 't4-u3', name: 'Larissa Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Larissa', role: 'member' },
    ],
    objectives: ['Preparar o melhor churrasco', 'Organizar escala de tarefas'],
  },
  {
    id: 'team-5',
    name: 'Hackathon Coders',
    description: 'Equipe de desenvolvimento para o hackathon.',
    admin: 'Pedro Santos',
    adminAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    vacancies: 2,
    members: [
      { id: 't5-u1', name: 'Pedro Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro', role: 'admin' },
      { id: 't5-u2', name: 'Gabriel Torres', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel', role: 'member' },
    ],
    objectives: ['Vencer o hackathon', 'Criar um MVP funcional', 'Fazer networking'],
  },
]
