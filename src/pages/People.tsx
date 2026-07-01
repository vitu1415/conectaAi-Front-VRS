import { motion } from 'framer-motion'
import { PersonCard } from '@/components/PersonCard'
import { mockPeople } from '@/mocks/people'

export function People() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
        <p className="text-sm text-gray-500 mt-1">Conecte-se com participantes do evento</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPeople.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PersonCard person={person} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
