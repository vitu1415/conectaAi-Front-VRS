import { motion } from 'framer-motion'
import { Check, X, Users, Calendar } from 'lucide-react'
import { Avatar, Badge, Button } from '@/components/ui'
import type { ConnectionRequest } from '@/types'

interface ConnectionRequestCardProps {
  request: ConnectionRequest
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export function ConnectionRequestCard({ request, onAccept, onReject }: ConnectionRequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Avatar src={request.solicitante.avatar} alt={request.solicitante.name} size="lg" className="shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {request.solicitante.name}
          </h4>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {request.interessesComuns.map((interest) => (
              <Badge key={interest} variant="primary" size="sm">{interest}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-400">
            {request.eventoComum && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {request.eventoComum}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {request.interessesComuns.length} interesses em comum
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto sm:shrink-0">
        <Button
          size="sm"
          variant="primary"
          icon={<Check className="w-4 h-4" />}
          className="flex-1 sm:flex-initial"
          onClick={() => onAccept(request.id)}
        >
          Aceitar
        </Button>
        <Button
          size="sm"
          variant="outline"
          icon={<X className="w-4 h-4" />}
          className="flex-1 sm:flex-initial"
          onClick={() => onReject(request.id)}
        >
          Recusar
        </Button>
      </div>
    </motion.div>
  )
}
