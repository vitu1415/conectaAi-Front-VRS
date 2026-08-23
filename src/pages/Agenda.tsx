import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { AgendaItemCard } from '@/components/AgendaItem'
import { CardSkeleton } from '@/components/ui'
import * as agendaService from '@/services/agenda'
import { mapAgendaResponse } from '@/services/mappers'
import { getErrorMessage } from '@/utils/error'
import { useOutletContext } from 'react-router-dom'
import type { AgendaItem, Event } from '@/types'

export function Agenda() {
  const { event } = useOutletContext<{ event: Event }>()
  const [items, setItems] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    agendaService
      .listar(event.id)
      .then((data) => setItems(data.map(mapAgendaResponse)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [event.id])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">Cronograma oficial do evento</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 card-shadow">
          <h3 className="text-sm font-semibold text-gray-900">Erro ao carregar agenda</h3>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      ) : items.length > 0 ? (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-3 relative">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AgendaItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 card-shadow">
          <h3 className="text-sm font-semibold text-gray-900">Agenda vazia</h3>
          <p className="text-xs text-gray-500 mt-1">Nenhum item de agenda divulgado ainda.</p>
        </div>
      )}
    </div>
  )
}