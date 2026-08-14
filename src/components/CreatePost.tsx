import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image, BarChart3, FileIcon, Send } from 'lucide-react'
import { Avatar, Button } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'

export function CreatePost() {
  const { user } = useApp()
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = () => {
    if (!content.trim()) return
    setContent('')
    setIsExpanded(false)
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
              className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3"
            >
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
                icon={<Send className="w-4 h-4" />}
              >
                Publicar
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
