import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, X, Send } from 'lucide-react'
import { Avatar, Button } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'
import * as postsService from '@/services/posts'
import { getErrorMessage } from '@/utils/error'
import { cn } from '@/utils/cn'
import type { TipoPost } from '@/types/api'

interface MediaFile {
  file: File
  preview: string
}

const MAX_MEDIA = 5

interface CreatePostProps {
  eventId: string
  onCreated?: () => void
}

export function CreatePost({ eventId, onCreated }: CreatePostProps) {
  const { user } = useApp()
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaFile[]>([])

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (media.length >= MAX_MEDIA) {
      setPostError(`Máximo de ${MAX_MEDIA} mídias`)
      return
    }

    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      setPostError(`Arquivo muito grande. Limite: ${isVideo ? '50MB' : '10MB'}`)
      return
    }

    const preview = URL.createObjectURL(file)
    setMedia((prev) => [...prev, { file, preview }])
    if (!content) setIsExpanded(true)
    e.target.value = ''
  }

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async () => {
    if ((!content.trim() && media.length === 0) || posting) return
    setPosting(true)
    setPostError(null)
    try {
      let tipo: TipoPost = 'TEXTO'
      const midias: File[] = media.map((m) => m.file)

      if (midias.length > 0) {
        const hasVideo = midias.some((f) => f.type.startsWith('video/'))
        tipo = hasVideo ? 'VIDEO' : 'IMAGEM'
      }

      await postsService.criar(
        {
          eventoId: eventId,
          texto: content.trim(),
          tipo,
          visibilidade: 'PUBLICO',
        },
        midias.length > 0 ? midias : undefined,
      )
      setContent('')
      setIsExpanded(false)
      media.forEach((m) => URL.revokeObjectURL(m.preview))
      setMedia([])
      onCreated?.()
    } catch (err) {
      setPostError(getErrorMessage(err))
    } finally {
      setPosting(false)
    }
  }

  const canAddMore = media.length < MAX_MEDIA
  const hasVideo = media.some((m) => m.file.type.startsWith('video/'))

  if (!user) return null

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-gray-100 card-shadow p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar src={user.avatar} alt={user.name} size="md" />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              if (e.target.value) setIsExpanded(true)
              if (postError) setPostError(null)
            }}
            onFocus={() => setIsExpanded(true)}
            placeholder="Compartilhe algo sobre o evento..."
            className="w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 resize-none outline-none min-h-[40px]"
            rows={isExpanded ? 3 : 1}
          />

          <AnimatePresence>
            {media.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className={cn(
                  'grid gap-1.5',
                  media.length === 1 && 'grid-cols-1',
                  media.length === 2 && 'grid-cols-2',
                  media.length >= 3 && 'grid-cols-2',
                )}>
                  {media.map((m, idx) => {
                    const isVid = m.file.type.startsWith('video/')
                    return (
                      <div
                        key={m.preview}
                        className={cn(
                          'relative rounded-xl overflow-hidden bg-gray-100',
                          media.length === 1 && 'max-h-64',
                          media.length >= 2 && 'h-32',
                        )}
                      >
                        {isVid ? (
                          <video
                            src={m.preview}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={m.preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {media.length}/{MAX_MEDIA} mídias
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-3 border-t border-gray-100 mt-3"
            >
              {postError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                  {postError}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    disabled={!canAddMore || hasVideo}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-cyan-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Adicionar imagem"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={!canAddMore || hasVideo}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-cyan-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Adicionar vídeo"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={(!content.trim() && media.length === 0)}
                  loading={posting}
                  icon={<Send className="w-4 h-4" />}
                >
                  Publicar
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
