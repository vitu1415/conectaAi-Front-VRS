import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, School, Calendar, Users, Trophy, Zap,
  Settings, Share2, UserPlus, UserCheck,
  MessageCircle, ArrowLeft,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, Tabs } from '@/components/ui'
import { ConnectionList } from '@/components/ConnectionList'
import { useApp } from '@/contexts/AppContext'
import { mockService } from '@/services/mockService'
import { mockPeople } from '@/mocks/people'
import type { Connection } from '@/types'

export function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useApp()

  const isOwnProfile = !userId || userId === currentUser.id
  const profileUser = isOwnProfile
    ? currentUser
    : mockPeople.find((p) => p.id === userId)
  const isOtherUser = !isOwnProfile && profileUser

  const [connections, setConnections] = useState<Connection[]>([])
  const [activeTab, setActiveTab] = useState('about')
  const [connectionStatus, setConnectionStatus] = useState('NENHUM')
  const [stats, setStats] = useState({ connectionsCount: 0, pendingRequestsCount: 0 })

  const activeConnections = useMemo(
    () => connections.filter((c) => c.status === 'CONECTADO'),
    [connections],
  )

  useEffect(() => {
    mockService.getConnections().then(setConnections)
    mockService.getConnectionsStats().then(setStats)
    if (userId && !isOwnProfile) {
      mockService.getConnectionStatus(userId).then((status) => {
        setConnectionStatus(status.conectado ? 'CONECTADO' : status.solicitacaoPendente ? 'PENDENTE_ENVIADA' : 'NENHUM')
      })
    }
  }, [userId, isOwnProfile])

  const tabs = isOwnProfile
    ? [
        { id: 'about', label: 'Sobre' },
        { id: 'connections', label: `Conexões (${activeConnections.length})` },
        { id: 'events', label: 'Eventos' },
      ]
    : [
        { id: 'about', label: 'Sobre' },
        { id: 'connections', label: 'Conexões' },
      ]

  const handleConnect = async () => {
    if (!userId) return
    await mockService.sendConnectionRequest(userId)
    setConnectionStatus('PENDENTE_ENVIADA')
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Usuário não encontrado</p>
          <button onClick={() => navigate('/events')} className="text-cyan-500 mt-2 underline">
            Voltar para eventos
          </button>
        </div>
      </div>
    )
  }

  const commonConnections = activeConnections.filter(
    (c) => c.usuarioId !== profileUser.id,
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {isOtherUser && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      )}

      <Card padding="none" hover={false}>
        <div className="relative h-32 rounded-t-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-tertiary-500 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right, rgba(255,255,255,0.2), transparent)]" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <Avatar src={profileUser.avatar} alt={profileUser.name} size="xl" className="ring-4 ring-white shadow-lg" />
            <div className="flex-1 pt-2 sm:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{profileUser.name}</h1>
                {'level' in profileUser && (
                  <Badge variant="primary" size="sm">
                    <Trophy className="w-3 h-3" />
                    Nível {profileUser.level}
                  </Badge>
                )}
              </div>
              {'description' in profileUser && (
                <p className="text-sm text-gray-500 mt-0.5">{profileUser.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <Button size="sm" variant="outline" icon={<Settings className="w-4 h-4" />}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Share2 className="w-4 h-4" />} />
                </>
              ) : (
                <>
                  {connectionStatus === 'NENHUM' && (
                    <Button size="sm" variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={handleConnect}>
                      Conectar
                    </Button>
                  )}
                  {connectionStatus === 'PENDENTE_ENVIADA' && (
                    <Button size="sm" variant="secondary" disabled icon={<UserPlus className="w-4 h-4" />}>
                      Pendente
                    </Button>
                  )}
                  {connectionStatus === 'CONECTADO' && (
                    <>
                      <Button size="sm" variant="secondary" icon={<UserCheck className="w-4 h-4" />} disabled>
                        Conectado
                      </Button>
                      <Button size="sm" variant="ghost" icon={<MessageCircle className="w-4 h-4" />}>
                        Conversar
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {profileUser.city}
            </span>
            {'university' in profileUser && profileUser.university && (
              <span className="flex items-center gap-1.5">
                <School className="w-4 h-4" />
                {profileUser.university}
              </span>
            )}
            {'age' in profileUser && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {profileUser.age} anos
              </span>
            )}
            {'xp' in profileUser && (
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                {profileUser.xp} XP
              </span>
            )}
          </div>

          <div className="flex gap-6 mt-4">
            <button
              onClick={() => setActiveTab('connections')}
              className="flex items-center gap-1.5 text-sm hover:text-cyan-600 transition-colors"
            >
              <span className="font-bold text-gray-900">{activeConnections.length}</span>
              <span className="text-gray-500">conexões</span>
            </button>
          </div>

          {!isOwnProfile && commonConnections.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              <Users className="w-3.5 h-3.5 inline mr-1" />
              Você e {profileUser.name} têm <strong>{commonConnections.length}</strong> conexão(ões) em comum
            </p>
          )}

          {'interests' in profileUser && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profileUser.interests.map((interest: string) => (
                <Badge key={interest} variant="primary">{interest}</Badge>
              ))}
            </div>
          )}

          {'badges' in profileUser && (
            <div className="flex gap-2 mt-3">
              {profileUser.badges.map((badge: { id: string; name: string }) => (
                <Badge key={badge.id} variant="secondary">{badge.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'about' && isOwnProfile && (
        <div className="space-y-3">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">XP e Progresso</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Nível {'level' in profileUser ? profileUser.level : 0}</span>
                  <span className="text-gray-400">{'xp' in profileUser ? profileUser.xp : 0} / 5000 XP</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-tertiary-500 rounded-full transition-all duration-500"
                    style={{ width: `${('xp' in profileUser ? (profileUser.xp / 5000) * 100 : 0)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold gradient-text">12</p>
                  <p className="text-xs text-gray-400">Eventos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">{activeConnections.length}</p>
                  <p className="text-xs text-gray-400">Conexões</p>
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">{'badges' in profileUser ? profileUser.badges.length : 0}</p>
                  <p className="text-xs text-gray-400">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {'badges' in profileUser && profileUser.badges.map((badge: { id: string; name: string }) => (
                <div key={badge.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">{badge.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'about' && isOtherUser && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Sobre</h3>
          <p className="text-sm text-gray-600">{'description' in profileUser ? profileUser.description : ''}</p>
          {'interests' in profileUser && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profileUser.interests.map((interest: string) => (
                <Badge key={interest} variant="primary">{interest}</Badge>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'connections' && (
        <ConnectionList
          connections={activeConnections}
          onRemoveConnection={isOwnProfile ? async (id) => {
            await mockService.removeConnection(id)
            setConnections((prev) => prev.filter((c) => c.id !== id))
          } : undefined}
        />
      )}

      {activeTab === 'events' && isOwnProfile && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Eventos Participados</h3>
          <p className="text-sm text-gray-500">Em breve...</p>
        </Card>
      )}
    </div>
  )
}
