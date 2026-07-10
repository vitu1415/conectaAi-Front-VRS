import { motion } from 'framer-motion'
import { MapPin, School, Users, Heart, MessageCircle, X, Check } from 'lucide-react'
import { Avatar, Badge, Button } from '@/components/ui'
import type { PersonProfile } from '@/types'

interface PersonCardProps {
  person: PersonProfile
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden"
    >
      <div className="relative h-32 bg-gradient-to-br from-cyan-400 to-tertiary-400">
        <div className="absolute -bottom-10 left-4">
          <Avatar src={person.avatar} alt={person.name} size="xl" className="ring-4 ring-white" />
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

        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" icon={<X className="w-4 h-4" />}>
            Pular
          </Button>
          <Button size="sm" variant="primary" icon={<Heart className="w-4 h-4" />}>
            Curtir
          </Button>
          <Button size="sm" variant="secondary" icon={<MessageCircle className="w-4 h-4" />}>
            Conversar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
