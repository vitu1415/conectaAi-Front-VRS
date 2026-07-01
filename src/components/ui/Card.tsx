import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className, hover = true, padding = 'md' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 card-shadow',
        hover && 'hover:card-shadow-hover transition-shadow duration-300',
        paddings[padding],
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
