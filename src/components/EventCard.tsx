import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import type { Event } from '@/types'
import { formatDate, formatParticipants } from '@/utils/format'

interface EventCardProps {
  event: Event
  onEnter?: (event: Event) => void
}

export function EventCard({ event, onEnter }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 border-0">
          {event.category}
        </Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-sm">
            {event.title}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.date).split(' de ').slice(0, 2).join(' de ')}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {event.city.split(',')[0]}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {formatParticipants(event.participants)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-cyan-600">
            {event.price}
          </span>
          <Button
            size="sm"
            onClick={() => onEnter?.(event)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Entrar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
