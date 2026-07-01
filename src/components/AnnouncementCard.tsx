import { motion } from 'framer-motion'
import { Megaphone, Calendar } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { formatRelativeTime } from '@/utils/format'

interface Announcement {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  timestamp: string
  type: 'info' | 'warning' | 'update'
}

const typeStyles = {
  info: 'border-l-4 border-l-cyan-400',
  warning: 'border-l-4 border-l-orange-400',
  update: 'border-l-4 border-l-green-400',
}

const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mudança de Horário',
    content: 'O show principal foi remarcado para às 22h. Fiquem atentos!',
    author: 'Organização',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Organizacao',
    timestamp: '2026-07-15T14:00:00',
    type: 'warning',
  },
  {
    id: 'ann-2',
    title: 'Nova Atração Confirmada',
    content: 'Temos uma surpresa! Banda XYZ confirmada para o evento.',
    author: 'Organização',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Organizacao',
    timestamp: '2026-07-14T10:00:00',
    type: 'update',
  },
  {
    id: 'ann-3',
    title: 'Mapa do Evento',
    content: 'O mapa atualizado do evento já está disponível. Confira os pontos de interesse.',
    author: 'Organização',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Organizacao',
    timestamp: '2026-07-13T18:00:00',
    type: 'info',
  },
]

export function AnnouncementCard({ announcement: ann }: { announcement: Announcement }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-gray-100 card-shadow p-4 ${typeStyles[ann.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm text-gray-900">{ann.title}</h3>
            <span className="text-xs text-gray-400 shrink-0">{formatRelativeTime(ann.timestamp)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <Avatar src={ann.authorAvatar} alt={ann.author} size="sm" />
            <span className="text-xs text-gray-400">{ann.author}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function AnnouncementsList() {
  return (
    <div className="space-y-3">
      {announcements.map((ann) => (
        <AnnouncementCard key={ann.id} announcement={ann} />
      ))}
    </div>
  )
}
