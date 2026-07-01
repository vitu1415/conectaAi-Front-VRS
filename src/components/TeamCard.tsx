import { motion } from 'framer-motion'
import { Users, Award, ArrowRight } from 'lucide-react'
import { Avatar, Badge, Button } from '@/components/ui'
import type { Team } from '@/types'

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-100 card-shadow p-4 hover:card-shadow-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{team.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{team.description}</p>
        </div>
        <Badge variant="warning" size="sm">{team.vacancies} vagas</Badge>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {team.members.slice(0, 4).map((member) => (
          <Avatar key={member.id} src={member.avatar} alt={member.name} size="sm" className="-ml-1 first:ml-0 ring-2 ring-white" />
        ))}
        {team.members.length > 4 && (
          <span className="text-xs text-gray-400 ml-1">+{team.members.length - 4}</span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {team.members.length} membros
        </span>
        <span className="flex items-center gap-1">
          <Award className="w-3 h-3" />
          Admin: {team.admin.split(' ')[0]}
        </span>
      </div>

      <div className="space-y-1 mb-3">
        {team.objectives.slice(0, 2).map((obj, i) => (
          <p key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            {obj}
          </p>
        ))}
      </div>

      <Button size="sm" fullWidth variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
        Ver Equipe
      </Button>
    </motion.div>
  )
}
