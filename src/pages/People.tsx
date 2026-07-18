import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PersonCard } from '@/components/PersonCard'
import { mockService } from '@/services/mockService'
import { CardSkeleton } from '@/components/ui'
import type { PersonProfile } from '@/types'

export function People() {
  const [people, setPeople] = useState<PersonProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockService.getPeople().then((data) => {
      setPeople(data as PersonProfile[])
      setLoading(false)
    })
  }, [])

  const handleConnect = async (userId: string) => {
    await mockService.sendConnectionRequest(userId)
    setPeople((prev) =>
      prev.map((p) =>
        p.id === userId ? { ...p, connectionStatus: 'PENDENTE_ENVIADA' as const } : p,
      ),
    )
  }

  const handleAccept = async (userId: string) => {
    const request = await mockService.getConnectionRequests()
    const found = request.find((r) => r.solicitante.id === userId)
    if (found) {
      await mockService.acceptConnection(found.id)
      setPeople((prev) =>
        prev.map((p) =>
          p.id === userId ? { ...p, connectionStatus: 'CONECTADO' as const } : p,
        ),
      )
    }
  }

  const handleReject = async (userId: string) => {
    const requests = await mockService.getConnectionRequests()
    const found = requests.find((r) => r.solicitante.id === userId)
    if (found) {
      await mockService.rejectConnection(found.id)
      setPeople((prev) =>
        prev.map((p) =>
          p.id === userId ? { ...p, connectionStatus: 'NENHUM' as const } : p,
        ),
      )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
        <p className="text-sm text-gray-500 mt-1">Conecte-se com participantes do evento</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PersonCard
                person={person}
                onConnect={handleConnect}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
