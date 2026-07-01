import { motion } from 'framer-motion'
import { Users, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Group } from '@/types'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-100 card-shadow p-4 flex items-center gap-4 hover:card-shadow-hover transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">{group.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{group.description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {group.members}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {group.lastActivity}
          </span>
        </div>
      </div>
      <Button size="sm" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
        Entrar
      </Button>
    </motion.div>
  )
}
