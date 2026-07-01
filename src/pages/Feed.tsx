import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreatePost } from '@/components/CreatePost'
import { PostCard } from '@/components/PostCard'
import { mockPosts } from '@/mocks/posts'
import type { Event } from '@/types'

export function Feed() {
  const { event } = useOutletContext<{ event: Event }>()

  const eventPosts = mockPosts.filter((p) => p.eventId === event.id)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Create Post */}
      <CreatePost />

      {/* Posts */}
      {eventPosts.length > 0 ? (
        <div className="space-y-3">
          {eventPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <motion.svg
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-6 h-6 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Nenhuma publicação ainda</h3>
          <p className="text-xs text-gray-500 mt-1">Seja o primeiro a compartilhar algo!</p>
        </div>
      )}
    </div>
  )
}
