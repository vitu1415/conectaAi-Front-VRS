import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, UserMinus, Users, Calendar } from 'lucide-react'
import { Avatar, Badge, Button, EmptyState } from '@/components/ui'
import type { Connection } from '@/types'

interface ConnectionListProps {
  connections: Connection[]
  onRemoveConnection?: (id: string) => void
}

export function ConnectionList({
  connections,
  onRemoveConnection,
}: ConnectionListProps) {
  const navigate = useNavigate()

  const grouped = useMemo(() => {
    const groups: Record<string, Connection[]> = {}
    for (const conn of connections) {
      const key = conn.eventoOrigem || 'Outras conexões'
      if (!groups[key]) groups[key] = []
      groups[key].push(conn)
    }
    return groups
  }, [connections])

  if (connections.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-8 h-8" />}
        title="Nenhuma conexão"
        description="Conecte-se com pessoas nos eventos para ver sua lista aqui"
      />
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([evento, conns]) => (
        <div key={evento}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {evento === 'Outras conexões' ? evento : `Conheceu no ${evento}`}
          </h3>
          <div className="space-y-2">
            {conns.map((conn, i) => (
              <motion.div
                key={conn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 hover:border-cyan-200 transition-colors cursor-pointer"
                onClick={() => navigate(`/app/profile/${conn.usuarioId}`)}
              >
                <Avatar src={conn.usuario.avatar} alt={conn.usuario.name} size="md" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{conn.usuario.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{conn.usuario.city}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {conn.eventosComuns} eventos
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {conn.interessesComuns.map((interest) => (
                      <Badge key={interest} variant="primary" size="sm">{interest}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<MessageCircle className="w-4 h-4" />}
                    onClick={(e) => { e.stopPropagation(); navigate(`/app/profile/${conn.usuarioId}`) }}
                  />
                  {onRemoveConnection && (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<UserMinus className="w-4 h-4 text-red-400" />}
                      onClick={(e) => { e.stopPropagation(); onRemoveConnection(conn.id) }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
