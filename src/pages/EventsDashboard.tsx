import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, LogOut, CalendarDays, Bell, User } from 'lucide-react'
import { Input, Badge, Button, Modal } from '@/components/ui'
import { EventCard } from '@/components/EventCard'
import { ConnectionRequestCard } from '@/components/ConnectionRequestCard'
import { mockEvents } from '@/mocks/events'
import { EVENT_CATEGORIES } from '@/constants'
import { useApp } from '@/contexts/AppContext'
import { mockService } from '@/services/mockService'
import type { ConnectionRequest } from '@/types'

export function EventsDashboard() {
  const navigate = useNavigate()
  const { user, setSelectedEvent, logout } = useApp()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([])
  const [showRequests, setShowRequests] = useState(false)

  useEffect(() => {
    mockService.getConnectionRequests().then(setPendingRequests)
  }, [])

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'Todos' || event.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleEnterEvent = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event)
    navigate(`/event/${event.id}/feed`)
  }

  const handleAcceptRequest = async (id: string) => {
    await mockService.acceptConnection(id)
    setPendingRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleRejectRequest = async (id: string) => {
    await mockService.rejectConnection(id)
    setPendingRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/src/assets/favicon.ico" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="gradient-text font-bold text-lg">ConectaAí</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 hidden sm:block">
              Olá, {user.name.split(' ')[0]}
            </span>
            {/* Connection Requests Bell */}
            <button
              onClick={() => setShowRequests(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-cyan-600 transition-colors"
              aria-label="Solicitações de conexão"
            >
              <Bell className="w-4 h-4" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            {/* Avatar → Profile */}
            <button
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-cyan-400 transition-all"
              aria-label="Meu perfil"
            >
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 sm:py-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Escolha seu <span className="gradient-text">evento</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Selecione um evento para entrar na comunidade e começar a interagir
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Pesquisar eventos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-cyan-300 text-gray-400 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-cyan-500 to-tertiary-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-cyan-300 hover:text-cyan-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard event={event} onEnter={handleEnterEvent} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nenhum evento encontrado</h3>
            <p className="text-sm text-gray-500 mt-1">Tente ajustar sua pesquisa ou filtros</p>
          </div>
        )}
      </main>

      {/* Connection Requests Modal */}
      <Modal isOpen={showRequests} onClose={() => setShowRequests(false)} title="Solicitações de Conexão">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-6">
            <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Nenhuma solicitação pendente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <ConnectionRequestCard
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
