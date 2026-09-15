import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface SmartVideoProps {
  src: string
  className?: string
  containerClassName?: string
  onClick?: () => void
}

export function SmartVideo({ src, className, containerClassName, onClick }: SmartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal' | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoaded = () => {
      if (video.videoHeight > video.videoWidth) {
        setOrientation('vertical')
      } else {
        setOrientation('horizontal')
      }
    }

    video.addEventListener('loadedmetadata', handleLoaded)
    return () => video.removeEventListener('loadedmetadata', handleLoaded)
  }, [src])

  return (
    <div className={containerClassName}>
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="metadata"
        onClick={onClick}
        className={cn(
          'w-full',
          orientation === 'vertical' && 'max-h-[28rem] sm:max-h-[32rem] object-contain',
          orientation === 'horizontal' && 'h-56 sm:h-96 object-cover',
          !orientation && 'h-64 object-cover',
          className,
        )}
      />
    </div>
  )
}
