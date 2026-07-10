import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, School, Calendar, Users, Trophy, Zap,
  Medal, Target, Star, Settings, Share2,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, Tabs } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'

export function Profile() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('about')

  const tabs = [
    { id: 'about', label: 'Sobre' },
    { id: 'badges', label: 'Conquistas' },
    { id: 'events', label: 'Eventos' },
  ]

  const achievements = [
    { id: 'a1', name: 'Primeiro Evento', description: 'Participou do primeiro evento', icon: Star, unlocked: true },
    { id: 'a2', name: 'Social Butterly', description: 'Conectou-se com 50 pessoas', icon: Users, unlocked: true, progress: 34 },
    { id: 'a3', name: 'Veterano', description: 'Participou de 10 eventos', icon: Trophy, unlocked: true, progress: 7 },
    { id: 'a4', name: 'Engajado', description: 'Publicou 100 posts no feed', icon: Zap, unlocked: false, progress: 42 },
    { id: 'a5', name: 'Líder', description: 'Criou uma equipe com 10+ membros', icon: Medal, unlocked: false, progress: 3 },
    { id: 'a6', name: 'Explorador', description: 'Participou de 5 categorias diferentes', icon: Target, unlocked: false, progress: 3 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card padding="none" hover={false}>
        <div className="relative h-32 rounded-t-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-tertiary-500 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right, rgba(255,255,255,0.2), transparent)]" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <Avatar src={user.avatar} alt={user.name} size="xl" className="ring-4 ring-white shadow-lg" />
            <div className="flex-1 pt-2 sm:pt-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <Badge variant="primary" size="sm">
                  <Trophy className="w-3 h-3" />
                  Nível {user.level}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{user.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" icon={<Settings className="w-4 h-4" />}>
                Editar
              </Button>
              <Button size="sm" variant="ghost" icon={<Share2 className="w-4 h-4" />} />
            </div>
          </div>

          {/* Info Row */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user.city}
            </span>
            {user.university && (
              <span className="flex items-center gap-1.5">
                <School className="w-4 h-4" />
                {user.university}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {user.age} anos
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              {user.xp} XP
            </span>
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.interests.map((interest) => (
              <Badge key={interest} variant="primary">{interest}</Badge>
            ))}
          </div>

          {/* Badges */}
          <div className="flex gap-2 mt-3">
            {user.badges.map((badge) => (
              <Badge key={badge.id} variant="secondary">{badge.name}</Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="space-y-3">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">XP e Progresso</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Nível {user.level}</span>
                  <span className="text-gray-400">{user.xp} / 5000 XP</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-tertiary-500 rounded-full transition-all duration-500"
                    style={{ width: `${(user.xp / 5000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold gradient-text">12</p>
                  <p className="text-xs text-gray-400">Eventos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">48</p>
                  <p className="text-xs text-gray-400">Amigos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">6</p>
                  <p className="text-xs text-gray-400">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{badge.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={!achievement.unlocked ? 'opacity-60' : ''}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  achievement.unlocked ? 'bg-gradient-to-br from-cyan-100 to-tertiary-100' : 'bg-gray-100'
                }`}>
                  <achievement.icon className={`w-5 h-5 ${
                    achievement.unlocked ? 'text-cyan-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{achievement.name}</h4>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                  {achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-tertiary-400 rounded-full"
                          style={{ width: `${(achievement.progress / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Eventos Participados</h3>
          <p className="text-sm text-gray-500">Em breve...</p>
        </Card>
      )}
    </div>
  )
}
