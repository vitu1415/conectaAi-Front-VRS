import { useState, useMemo } from 'react'
import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Users, MessageCircle, Calendar,
  Megaphone, User, Menu, LogOut, ArrowLeft, ChevronLeft,
} from 'lucide-react'
import { Avatar, Badge } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/cn'
import { mockEvents } from '@/mocks/events'

const NAV_ITEMS = [
  { id: 'feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
  { id: 'people', label: 'Pessoas', icon: <Users className="w-5 h-5" /> },
  { id: 'groups', label: 'Grupos', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'agenda', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
  { id: 'announcements', label: 'Avisos', icon: <Megaphone className="w-5 h-5" /> },
  { id: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
]

export function EventLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { eventId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useApp()

  const event = useMemo(
    () => mockEvents.find((e) => e.id === eventId),
    [eventId],
  )

  const currentPath = location.pathname
  const currentSection = currentPath.split('/').pop() || 'feed'

  const handleNav = (section: string) => {
    navigate(`/event/${eventId}/${section}`)
    setSidebarOpen(false)
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Evento não encontrado</p>
          <button onClick={() => navigate('/events')} className="text-cyan-500 mt-2 underline">
            Voltar para eventos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100 lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-center px-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0">
              <img src="/src/assets/favicon.ico" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="text-sm font-semibold text-gray-800 truncate">{event.title}</span>
          </div>
          <div className="w-9" />
        </div>
        {/* Event quick info */}
        <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/5 to-tertiary-500/5 border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-1 text-xs text-cyan-600 shrink-0 hover:text-cyan-700"
          >
            <ArrowLeft className="w-3 h-3" />
            Eventos
          </button>
          <span className="text-xs text-gray-300 shrink-0">|</span>
          <span className="text-xs text-gray-500 truncate">{event.date}</span>
          <span className="text-xs text-gray-300 shrink-0">•</span>
          <span className="text-xs text-gray-500 truncate">{event.city}</span>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo + Event Name */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-600 mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Todos os eventos
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">{event.title}</h2>
              <p className="text-xs text-gray-400 truncate">{event.date} • {event.city.split(',')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="primary" size="sm">{event.participants} participantes</Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-50 to-tertiary-50 text-cyan-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                )}
              >
                <span className={cn(isActive ? 'text-cyan-500' : 'text-gray-400')}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User Area */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              handleNav('profile')
              setSidebarOpen(false)
            }}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Avatar src={user.avatar} alt={user.name} size="md" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400">Nível {user.level} • {user.xp} XP</p>
            </div>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-2 py-2 mt-1 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'transition-all duration-300 pt-[4.5rem] lg:pt-0',
        'lg:ml-64',
      )}>
        <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
          {/* Desktop Event Header */}
          <div className="hidden lg:block mb-6">
            <div className="relative h-36 rounded-2xl overflow-hidden">
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <button
                      onClick={() => navigate('/events')}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Eventos
                    </button>
                    <span>•</span>
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.city}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-sm">{event.title}</h1>
                </div>
                <Badge variant="primary" size="md">{event.participants} participantes</Badge>
              </div>
            </div>
          </div>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ event }} />
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = currentSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
                  isActive ? 'text-cyan-500' : 'text-gray-400',
                )}
              >
                <span className={cn('transition-transform', isActive && 'scale-110')}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
