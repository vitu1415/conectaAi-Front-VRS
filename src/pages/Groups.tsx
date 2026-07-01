import { useState } from 'react'
import { motion } from 'framer-motion'
import { GroupCard } from '@/components/GroupCard'
import { Tabs } from '@/components/ui'
import { mockGroups } from '@/mocks/groups'

export function Groups() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'social', label: 'Sociais' },
    { id: 'musica', label: 'Música' },
    { id: 'hobby', label: 'Hobbies' },
    { id: 'esporte', label: 'Esportes' },
  ]

  const filtered = activeTab === 'all'
    ? mockGroups
    : mockGroups.filter((g) => g.category === activeTab)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grupos</h1>
        <p className="text-sm text-gray-500 mt-1">Conheça pessoas com interesses em comum</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-3">
        {filtered.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <GroupCard group={group} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
