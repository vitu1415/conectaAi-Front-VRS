import { useState } from 'react'
import { motion } from 'framer-motion'
import { TeamCard } from '@/components/TeamCard'
import { Tabs } from '@/components/ui'
import { mockTeams } from '@/mocks/teams'

export function Teams() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'Todas' },
    { id: 'competicoes', label: 'Competições' },
    { id: 'social', label: 'Social' },
    { id: 'tecnologia', label: 'Tecnologia' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
        <p className="text-sm text-gray-500 mt-1">Organize-se com outros participantes</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TeamCard team={team} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
