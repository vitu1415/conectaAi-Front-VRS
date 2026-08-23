import { cn } from '@/utils/cn'

interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  status?: 'online' | 'offline' | 'away'
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
}

export function Avatar({ src, alt, size = 'md', className, status }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0')}>
      <img
        src={src}
        alt={alt}
        className={cn('rounded-full object-cover bg-gray-100', sizes[size])}
      />
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
            statusColors[status],
          )}
        />
      )}
    </div>
  )
}
