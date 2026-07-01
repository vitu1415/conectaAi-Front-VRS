import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { AgendaItemCard } from '@/components/AgendaItem'
import { mockAgenda } from '@/mocks/agenda'
import { useOutletContext } from 'react-router-dom'
import type { Event } from '@/types'

export function Agenda() {
  const { event } = useOutletContext<{ event: Event }>()

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

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-3 relative">
          {mockAgenda.map((item, index) => (
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
    </div>
  )
}
