import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin, School, Calendar, Users, Trophy, Zap,
  Settings, Share2, UserPlus, UserCheck,
  MessageCircle, ArrowLeft,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, Tabs, Modal, Input } from '@/components/ui'
import { ConnectionList } from '@/components/ConnectionList'
import { useApp } from '@/contexts/AppContext'
import * as usuarioService from '@/services/usuarios'
import * as conexoesService from '@/services/conexoes'
import { mapEventoResponse, mapUsuarioResponse, mapConexaoResponse, mapRelacionamento } from '@/services/mappers'
import { INTEREST_CATEGORIES } from '@/constants'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import { getErrorMessage } from '@/utils/error'
import type { Connection, User } from '@/types'
import type { AtualizarUsuarioRequest, MeuEventoResponse } from '@/types/api'

export function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser, refreshUser } = useApp()

  const isOwnProfile = Boolean(currentUser && (!userId || userId === currentUser.id))

  const [connections, setConnections] = useState<Connection[]>([])
  const [activeTab, setActiveTab] = useState('about')
  const [connectionStatus, setConnectionStatus] = useState('NENHUM')
  const [publicUser, setPublicUser] = useState<User | null>(null)
  const [loadingPublic, setLoadingPublic] = useState(false)
  const [interests, setInterests] = useState<string[]>([])
  const [meusEventos, setMeusEventos] = useState<MeuEventoResponse[]>([])

  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editCidade, setEditCidade] = useState('')
  const [editEstado, setEditEstado] = useState('')
  const [editFoto, setEditFoto] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const activeConnections = useMemo(
    () => connections.filter((c) => c.status === 'CONECTADO'),
    [connections],
  )

  useEffect(() => {
    if (!currentUser) return
    const targetId = isOwnProfile ? currentUser.id : userId
    if (!targetId) return
    let cancelled = false
    conexoesService
      .listar(targetId)
      .then((data) => {
        if (!cancelled) setConnections(data.map((c) => mapConexaoResponse(c, currentUser.id)))
      })
      .catch(() => {
        if (!cancelled) setConnections([])
      })
    return () => {
      cancelled = true
    }
  }, [isOwnProfile, userId, currentUser])

  useEffect(() => {
    if (isOwnProfile || !userId) return
    let cancelled = false
    const loadStatus = async () => {
      try {
        const rel = await conexoesService.relacao(userId)
        if (cancelled) return
        if (rel.status === 'PENDENTE') {
          const recebidas = await conexoesService.recebidas()
          if (cancelled) return
          const isReceived = recebidas.some((r) => r.usuarioOrigem.id === userId)
          setConnectionStatus(isReceived ? 'PENDENTE_RECEBIDA' : 'PENDENTE_ENVIADA')
        } else {
          setConnectionStatus(mapRelacionamento(rel))
        }
      } catch {
        if (!cancelled) setConnectionStatus('NENHUM')
      }
    }
    loadStatus()
    return () => {
      cancelled = true
    }
  }, [userId, isOwnProfile])

  useEffect(() => {
    if (isOwnProfile || !userId) return
    setLoadingPublic(true)
    setPublicUser(null)
    usuarioService
      .getById(userId)
      .then((data) => setPublicUser(mapUsuarioResponse(data)))
      .catch(() => setPublicUser(null))
      .finally(() => setLoadingPublic(false))
  }, [userId, isOwnProfile])

  useEffect(() => {
    if (!isOwnProfile) return
    usuarioService
      .getInteresses()
      .then((data) => setInterests(data.map((i) => i.nome)))
      .catch(() => setInterests([]))
    usuarioService
      .getMeusEventos()
      .then(setMeusEventos)
      .catch(() => setMeusEventos([]))
  }, [isOwnProfile])

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    )
  }

  const profileUser = isOwnProfile
    ? { ...currentUser, interests }
    : publicUser
  const isOtherUser = !isOwnProfile && Boolean(profileUser)
  const isNotFound = !isOwnProfile && !loadingPublic && !profileUser

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
    await conexoesService.enviar(userId)
    setConnectionStatus('PENDENTE_ENVIADA')
  }

  const openEdit = () => {
    const [cidade, estado] = currentUser.city.split(', ').map((s) => s.trim())
    setEditNome(currentUser.name)
    setEditBio(currentUser.description || '')
    setEditCidade(cidade || '')
    setEditEstado(estado || '')
    setEditFoto(currentUser.avatar)
    setSelectedInterests(interests)
    setEditError(null)
    setEditOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setEditError(null)
    try {
      const payload: AtualizarUsuarioRequest = {}
      if (editNome !== currentUser.name) payload.nome = editNome
      if ((editBio || '') !== (currentUser.description || '')) payload.bio = editBio
      const [cidade, estado] = currentUser.city.split(', ').map((s) => s.trim())
      if ((editCidade || '') !== (cidade || '')) payload.cidade = editCidade
      if ((editEstado || '') !== (estado || '')) payload.estado = editEstado
      if (Object.keys(payload).length > 0) await usuarioService.updateMe(payload)

      if (editFoto !== currentUser.avatar) {
        await usuarioService.updateFoto({ fotoPerfil: editFoto })
      }

      const interestsChanged = selectedInterests.join(',') !== interests.join(',')
      if (interestsChanged) await usuarioService.updateInteresses(selectedInterests)

      await refreshUser()
      setInterests(selectedInterests)
      setEditOpen(false)
    } catch (err) {
      setEditError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (isNotFound) {
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

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const commonConnections = activeConnections.filter(
    (c) => c.usuarioId !== profileUser.id,
  )

  const actionButtons = isOwnProfile ? (
    <>
      <Button size="sm" variant="outline" icon={<Settings className="w-4 h-4" />} onClick={openEdit}>
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
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600 hover:border-cyan-400 hover:text-cyan-600 hover:shadow transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <Card padding="none" hover={false} className="overflow-hidden">
        {/* Banner */}
        <div className="relative h-40 bg-gradient-to-br from-cyan-400 via-cyan-500 to-tertiary-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute -top-10 -left-8 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 right-4 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="px-5 sm:px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-3 -mt-14">
            <Avatar
              src={profileUser.avatar}
              alt={profileUser.name}
              size="xl"
              className="ring-4 ring-white shadow-xl"
            />
            <div className="flex-1 text-center sm:text-left sm:pb-1.5 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{profileUser.name}</h1>
                {'level' in profileUser && profileUser.level > 0 && (
                  <Badge variant="primary" size="sm">
                    <Trophy className="w-3 h-3" />
                    Nível {profileUser.level}
                  </Badge>
                )}
              </div>
              {'description' in profileUser && profileUser.description && (
                <p className="text-sm text-gray-500 mt-1">{profileUser.description}</p>
              )}
            </div>
            <div className="flex gap-2 sm:pb-1">
              {actionButtons}
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
            {profileUser.city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {profileUser.city}
              </span>
            )}
            {'university' in profileUser && profileUser.university && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600">
                <School className="w-3.5 h-3.5 text-gray-400" />
                {profileUser.university}
              </span>
            )}
            {'age' in profileUser && profileUser.age > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {profileUser.age} anos
              </span>
            )}
            {'xp' in profileUser && profileUser.xp > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600">
                <Zap className="w-3.5 h-3.5 text-gray-400" />
                {profileUser.xp} XP
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={() => setActiveTab('connections')}
              className="flex items-center gap-1.5 text-sm hover:text-cyan-600 transition-colors"
            >
              <span className="font-bold text-gray-900">{activeConnections.length}</span>
              <span className="text-gray-500">conexões</span>
            </button>

            {!isOwnProfile && commonConnections.length > 0 && (
              <p className="text-sm text-gray-500">
                <Users className="w-3.5 h-3.5 inline mr-1" />
                Você e {profileUser.name} têm <strong>{commonConnections.length}</strong> conexão(ões) em comum
              </p>
            )}
          </div>

          {'interests' in profileUser && profileUser.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {profileUser.interests.map((interest: string) => (
                <Badge key={interest} variant="primary">{interest}</Badge>
              ))}
            </div>
          )}

          {'badges' in profileUser && profileUser.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
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
                  <span className="text-gray-500">Nível {profileUser.level}</span>
                  <span className="text-gray-400">{profileUser.xp} / 5000 XP</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-tertiary-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (profileUser.xp / 5000) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold gradient-text">{meusEventos.length}</p>
                  <p className="text-xs text-gray-400">Eventos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">{activeConnections.length}</p>
                  <p className="text-xs text-gray-400">Conexões</p>
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">{profileUser.badges.length}</p>
                  <p className="text-xs text-gray-400">Badges</p>
                </div>
              </div>
            </div>
          </Card>

          {profileUser.badges.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.badges.map((badge: { id: string; name: string }) => (
                  <div key={badge.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{badge.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'about' && isOtherUser && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Sobre</h3>
          <p className="text-sm text-gray-600">{profileUser.description || 'Sem descrição.'}</p>
          {profileUser.interests.length > 0 && (
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
            await conexoesService.remover(id)
            setConnections((prev) => prev.filter((c) => c.id !== id))
          } : undefined}
        />
      )}

      {activeTab === 'events' && isOwnProfile && (
        <div className="space-y-3">
          {meusEventos.length === 0 ? (
            <Card>
              <p className="text-sm text-gray-500">Nenhum evento participado ainda.</p>
            </Card>
          ) : (
            meusEventos.map((meu) => {
              const ev = mapEventoResponse(meu.evento)
              return (
                <Card key={ev.id} padding="md" hover={false}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{ev.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatDate(ev.date)} {ev.city ? `• ${ev.city}` : ''}
                      </p>
                    </div>
                    <Badge variant="secondary">{meu.papel}</Badge>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Editar perfil">
        <div className="space-y-4">
          <Input
            label="Nome"
            value={editNome}
            onChange={(e) => setEditNome(e.target.value)}
          />
          <Input
            label="Bio"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cidade"
              value={editCidade}
              onChange={(e) => setEditCidade(e.target.value)}
            />
            <Input
              label="Estado"
              value={editEstado}
              onChange={(e) => setEditEstado(e.target.value)}
            />
          </div>
          <Input
            label="URL da foto de perfil"
            value={editFoto}
            onChange={(e) => setEditFoto(e.target.value)}
          />
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Interesses</p>
            <div className="space-y-4">
              {INTEREST_CATEGORIES.map((category) => {
                const categoryCount = category.items.filter((interest) =>
                  selectedInterests.includes(interest),
                ).length
                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {categoryCount}/{category.items.length}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((interest) => {
                        const active = selectedInterests.includes(interest)
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() =>
                              setSelectedInterests((prev) =>
                                active ? prev.filter((x) => x !== interest) : [...prev, interest],
                              )
                            }
                            className={cn(
                              'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200',
                              active
                                ? 'bg-gradient-to-r from-cyan-500 to-tertiary-500 text-white border-transparent'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-cyan-300',
                            )}
                          >
                            {interest}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {editError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {editError}
            </p>
          )}

          <Button fullWidth loading={saving} onClick={handleSave}>
            Salvar alterações
          </Button>
        </div>
      </Modal>
    </div>
  )
}