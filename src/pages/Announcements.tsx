import { motion } from 'framer-motion'
import { Megaphone, Shield, MapPin, AlertTriangle, Clock } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { AnnouncementsList } from '@/components/AnnouncementCard'

const quickInfo = [
  { icon: Shield, label: 'Organizadores', value: 'Equipe ConectaAí' },
  { icon: MapPin, label: 'Portão Principal', value: 'Entrada A - Rua Principal' },
  { icon: AlertTriangle, label: 'Emergência', value: 'Ligue 190' },
  { icon: Clock, label: 'Funcionamento', value: '18h - 02h' },
]

export function Announcements() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Avisos</h1>
        <p className="text-sm text-gray-500 mt-1">Comunicados oficiais do evento</p>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickInfo.map((info) => (
          <Card key={info.label} padding="md" hover={false}>
            <div className="flex flex-col items-center text-center gap-1.5">
              <info.icon className="w-5 h-5 text-cyan-500" />
              <span className="text-xs text-gray-400">{info.label}</span>
              <span className="text-xs font-semibold text-gray-800">{info.value}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-orange-500" />
          <h2 className="font-semibold text-gray-900">Comunicados</h2>
          <Badge variant="warning" size="sm">3 novos</Badge>
        </div>
        <AnnouncementsList />
      </div>
    </div>
  )
}
