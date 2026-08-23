import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image, BarChart3, FileIcon, Send } from 'lucide-react'
import { Avatar, Button } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'
import * as postsService from '@/services/posts'
import { getErrorMessage } from '@/utils/error'

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

  const handleSubmit = async () => {
    if (!content.trim() || posting) return
    setPosting(true)
    setPostError(null)
    try {
      await postsService.criar({
        eventoId: eventId,
        texto: content.trim(),
        tipo: 'TEXTO',
        visibilidade: 'PUBLICO',
      })
      setContent('')
      setIsExpanded(false)
      onCreated?.()
    } catch (err) {
      setPostError(getErrorMessage(err))
    } finally {
      setPosting(false)
    }
  }

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
            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 resize-none outline-none min-h-[40px]"
            rows={isExpanded ? 3 : 1}
          />
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
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-cyan-500 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-cyan-500 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-cyan-500 transition-colors">
                  <FileIcon className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!content.trim()}
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
