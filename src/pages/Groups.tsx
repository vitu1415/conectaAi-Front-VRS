import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hammer, ArrowLeft } from 'lucide-react'

export function Groups() {
  const { eventId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-tertiary-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
          <Hammer className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Chats em grupos (em breve)</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          A funcionalidade de grupos está sendo preparada. Em breve você poderá encontrar e
          participar de grupos com interesses em comum.
        </p>
        <button
          onClick={() => navigate(`/event/${eventId}/feed`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600 hover:border-cyan-400 hover:text-cyan-600 mt-6 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao feed
        </button>
      </motion.div>
    </div>
  )
}