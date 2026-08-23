import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react'
import { Avatar } from '@/components/ui'
import * as postsService from '@/services/posts'
import * as comentariosService from '@/services/comentarios'
import { mapComentarioResponse } from '@/services/mappers'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Comment, Post } from '@/types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked)
  const [likes, setLikes] = useState(post.likes)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleToggleLike = async () => {
    try {
      const atualizado = liked
        ? await postsService.descurtir(post.id)
        : await postsService.curtir(post.id)
      setLikes(atualizado.curtidasCount)
      setLiked(atualizado.curtido)
    } catch {
      // falha silenciosa
    }
  }

  const toggleComments = () => {
    if (!commentsOpen && comments.length === 0) {
      setCommentsLoading(true)
      comentariosService
        .listar(post.id)
        .then((data) => setComments(data.map(mapComentarioResponse)))
        .catch(() => setComments([]))
        .finally(() => setCommentsLoading(false))
    }
    setCommentsOpen((v) => !v)
  }

  const handleAddComment = async () => {
    const texto = commentText.trim()
    if (!texto) return
    try {
      const criado = await comentariosService.criar(post.id, { texto })
      setComments((prev) => [...prev, mapComentarioResponse(criado)])
      setCommentText('')
    } catch {
      // falha silenciosa
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 card-shadow p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={post.userAvatar} alt={post.userName} size="md" />
          <div>
            <p className="font-semibold text-sm text-gray-900">{post.userName}</p>
            <p className="text-xs text-gray-400">{formatRelativeTime(post.timestamp)}</p>
          </div>
        </div>
        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>

      {post.image && (
        <div className="rounded-xl overflow-hidden">
          <img src={post.image} alt="" className="w-full h-48 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-6 pt-2">
        <button
          onClick={handleToggleLike}
          className={cn(
            'flex items-center gap-1.5 text-sm transition-colors',
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500',
          )}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          <span>{likes}</span>
        </button>
        <button
          onClick={toggleComments}
          className={cn(
            'flex items-center gap-1.5 text-sm transition-colors',
            commentsOpen ? 'text-cyan-500' : 'text-gray-400 hover:text-cyan-500',
          )}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{comments.length || post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-500 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>{post.shares}</span>
        </button>
      </div>

      {commentsOpen && (
        <div className="pt-3 border-t border-gray-100 space-y-3">
          {commentsLoading ? (
            <p className="text-xs text-gray-400">Carregando comentários...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar src={c.userAvatar} alt={c.userName} size="sm" />
                  <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-gray-900">{c.userName}</p>
                    <p className="text-xs text-gray-600">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Nenhum comentário ainda.</p>
          )}
          <div className="flex items-center gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddComment()
              }}
              placeholder="Escreva um comentário..."
              className="flex-1 text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-2 outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              onClick={handleAddComment}
              className="p-2 rounded-full text-cyan-500 hover:bg-cyan-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}