import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, LogOut, Sparkles, CalendarDays } from 'lucide-react'
import { Input, Badge } from '@/components/ui'
import { EventCard } from '@/components/EventCard'
import { mockEvents } from '@/mocks/events'
import { EVENT_CATEGORIES } from '@/constants'
import { useApp } from '@/contexts/AppContext'

export function EventsDashboard() {
  const navigate = useNavigate()
  const { user, setSelectedEvent, logout } = useApp()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'Todos' || event.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleEnterEvent = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event)
    navigate(`/event/${event.id}/feed`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text font-bold text-lg">ConectaAí</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">
              Olá, {user.name.split(' ')[0]}
            </span>
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
                  ? 'bg-gradient-to-r from-cyan-500 to-orange-500 text-white shadow-lg shadow-cyan-500/20'
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
    </div>
  )
}
