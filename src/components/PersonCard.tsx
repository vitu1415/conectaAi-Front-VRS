import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, School, Users, Heart, MessageCircle, X, Check,
  UserPlus, UserCheck, Clock,
} from 'lucide-react'
import { Avatar, Badge, Button } from '@/components/ui'
import type { PersonProfile } from '@/types'

interface PersonCardProps {
  person: PersonProfile
  onConnect?: (id: string) => void
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
}

export function PersonCard({ person, onConnect, onAccept, onReject }: PersonCardProps) {
  const navigate = useNavigate()

  const status = person.connectionStatus || 'NENHUM'

  const statusBadge = () => {
    switch (status) {
      case 'CONECTADO':
        return <Badge variant="primary" size="sm"><UserCheck className="w-3 h-3" /> Conectado</Badge>
      case 'PENDENTE_ENVIADA':
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3" /> Pendente</Badge>
      case 'PENDENTE_RECEBIDA':
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3" /> Solicitação</Badge>
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden cursor-pointer"
      onClick={() => navigate(`/profile/${person.id}`)}
    >
      <div className="relative h-32 bg-gradient-to-br from-cyan-400 to-tertiary-400">
        <div className="absolute -bottom-10 left-4">
          <Avatar src={person.avatar} alt={person.name} size="xl" className="ring-4 ring-white" />
        </div>
        <div className="absolute top-3 right-3">
          {statusBadge()}
        </div>
      </div>
      <div className="pt-12 p-4 space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{person.name}, {person.age}</h3>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {person.city}
          </p>
        </div>

        {person.university && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <School className="w-3 h-3" />
            {person.university}
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-2">{person.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {person.interests.map((interest) => (
            <Badge key={interest} variant="primary" size="sm">{interest}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {person.badges.map((badge) => (
            <Badge key={badge.id} variant="secondary" size="sm">{badge.name}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {person.friendsInCommon} amigos em comum
          </span>
          <span>{person.distance}</span>
        </div>

        <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          {status === 'NENHUM' && (
            <Button
              size="sm"
              variant="primary"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => onConnect?.(person.id)}
            >
              Conectar
            </Button>
          )}
          {status === 'PENDENTE_RECEBIDA' && (
            <>
              <Button
                size="sm"
                variant="primary"
                icon={<Check className="w-4 h-4" />}
                onClick={() => onAccept?.(person.id)}
              >
                Aceitar
              </Button>
              <Button
                size="sm"
                variant="outline"
                icon={<X className="w-4 h-4" />}
                onClick={() => onReject?.(person.id)}
              >
                Recusar
              </Button>
            </>
          )}
          {status === 'PENDENTE_ENVIADA' && (
            <Button size="sm" variant="secondary" disabled icon={<Clock className="w-4 h-4" />}>
              Aguardando resposta
            </Button>
          )}
          {status === 'CONECTADO' && (
            <>
              <Button size="sm" variant="secondary" icon={<UserCheck className="w-4 h-4" />} disabled>
                Conectado
              </Button>
              <Button size="sm" variant="ghost" icon={<MessageCircle className="w-4 h-4" />}>
                Conversar
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
