import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles = {
  primary: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  secondary: 'bg-orange-50 text-orange-700 border-orange-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function Badge({ children, variant = 'neutral', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        variantStyles[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
