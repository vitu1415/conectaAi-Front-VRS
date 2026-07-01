import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { AgendaItem as AgendaItemType } from '@/types'
import { cn } from '@/utils/cn'

interface AgendaItemCardProps {
  item: AgendaItemType
}

export function AgendaItemCard({ item }: AgendaItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      <div className="flex flex-col items-center w-16 shrink-0">
        <span className="text-lg font-bold text-cyan-600">{item.time.split(':')[0]}</span>
        <span className="text-xs text-gray-400 -mt-1">h</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
          </div>
          <button
            className={cn(
              'p-1.5 rounded-lg transition-colors shrink-0',
              item.favorited ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50',
            )}
          >
            <Star className={cn('w-4 h-4', item.favorited && 'fill-current')} />
          </button>
        </div>
        <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
          {item.category}
        </span>
      </div>
    </motion.div>
  )
}
