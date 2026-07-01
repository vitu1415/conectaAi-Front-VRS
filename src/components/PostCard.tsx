import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { Avatar } from '@/components/ui'
import type { Post } from '@/types'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
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
          className={cn(
            'flex items-center gap-1.5 text-sm transition-colors',
            post.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500',
          )}
        >
          <Heart className={cn('w-4 h-4', post.liked && 'fill-current')} />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-cyan-500 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>{post.shares}</span>
        </button>
      </div>
    </motion.div>
  )
}
