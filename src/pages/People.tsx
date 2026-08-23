import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { PersonCard } from '@/components/PersonCard'
import { CardSkeleton } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import * as eventoService from '@/services/eventos'
import * as conexoesService from '@/services/conexoes'
import { mapConexaoResponse, mapParticipanteResponse } from '@/services/mappers'
import type { ConnectionStatus, Event, PersonProfile } from '@/types'

export function People() {
  const { event } = useOutletContext<{ event: Event }>()
  const { user } = useApp()
  const [connMap, setConnMap] = useState<Record<string, ConnectionStatus>>({})

  useEffect(() => {
    if (!user) return
    let cancelled = false
    Promise.all([
      conexoesService.recebidas(),
      conexoesService.enviadas(),
      conexoesService.listar(user.id),
    ])
      .then(([recebidas, enviadas, aceitas]) => {
        if (cancelled) return
        const map: Record<string, ConnectionStatus> = {}
        recebidas.forEach((r) => {
          map[r.usuarioOrigem.id] = 'PENDENTE_RECEBIDA'
        })
        enviadas.forEach((r) => {
          map[r.usuarioDestino.id] = 'PENDENTE_ENVIADA'
        })
        aceitas.forEach((c) => {
          const conn = mapConexaoResponse(c, user.id)
          if (conn.status === 'CONECTADO') map[conn.usuarioId] = 'CONECTADO'
        })
        setConnMap(map)
      })
      .catch(() => {
        if (!cancelled) setConnMap({})
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const {
    items: people,
    loading,
    loadingMore,
    error,
    sentinelRef,
    reload,
  } = useInfiniteScroll<PersonProfile>({
    fetchPage: (cursor) =>
      eventoService.participantes(event.id, cursor).then((page) => ({
        content: page.content
          .filter((p) => p.usuario.id !== user?.id)
          .map(mapParticipanteResponse),
        nextCursor: page.nextCursor,
      })),
    deps: [event.id, user?.id],
  })

  const patchPerson = (userId: string, status: ConnectionStatus) => {
    setConnMap((prev) => ({ ...prev, [userId]: status }))
  }

  const handleConnect = async (userId: string) => {
    try {
      await conexoesService.enviar(userId)
      patchPerson(userId, 'PENDENTE_ENVIADA')
    } catch {
      // falha silenciosa
    }
  }

  const handleAccept = async (userId: string) => {
    try {
      const recebidas = await conexoesService.recebidas()
      const found = recebidas.find((r) => r.usuarioOrigem.id === userId)
      if (found) {
        await conexoesService.aceitar(found.id)
        patchPerson(userId, 'CONECTADO')
      }
    } catch {
      // falha silenciosa
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const recebidas = await conexoesService.recebidas()
      const found = recebidas.find((r) => r.usuarioOrigem.id === userId)
      if (found) {
        await conexoesService.recusar(found.id)
        patchPerson(userId, 'NENHUM')
      }
    } catch {
      // falha silenciosa
    }
  }

  const withStatus = (person: PersonProfile): PersonProfile => ({
    ...person,
    connectionStatus: connMap[person.id] || 'NENHUM',
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
        <p className="text-sm text-gray-500 mt-1">Conecte-se com participantes do evento</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 card-shadow">
          <h3 className="text-sm font-semibold text-gray-900">Erro ao carregar participantes</h3>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
          <button
            onClick={reload}
            className="mt-3 text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : people.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 5) * 0.05 }}
            >
              <PersonCard
                person={withStatus(person)}
                onConnect={handleConnect}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 card-shadow">
          <h3 className="text-sm font-semibold text-gray-900">Nenhum participante ainda</h3>
          <p className="text-xs text-gray-500 mt-1">Os participantes deste evento aparecerão aqui.</p>
        </div>
      )}

      {loadingMore && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
        </div>
      )}
      <div ref={sentinelRef} className="h-px" />
    </div>
  )
}
