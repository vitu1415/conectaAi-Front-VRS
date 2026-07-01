import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  message: string
  type?: 'success' | 'error' | 'info'
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function Toast({ isOpen, onClose, message, type = 'info' }: ToastProps) {
  const Icon = icons[type]

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className={cn(
            'fixed bottom-4 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg',
            styles[type],
          )}
        >
          <Icon className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{message}</p>
          <button onClick={onClose} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
