import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { CreatePost } from '@/components/CreatePost'
import { PostCard } from '@/components/PostCard'
import { CardSkeleton } from '@/components/ui'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import * as postsService from '@/services/posts'
import { mapPostResponse } from '@/services/mappers'
import type { Event, Post } from '@/types'

export function Feed() {
  const { event } = useOutletContext<{ event: Event }>()

  const {
    items: posts,
    loading,
    loadingMore,
    error,
    sentinelRef,
    reload,
  } = useInfiniteScroll<Post>({
    fetchPage: (cursor) =>
      postsService.porEvento(event.id, cursor).then((page) => ({
        content: page.content.map(mapPostResponse),
        nextCursor: page.nextCursor,
      })),
    deps: [event.id],
  })

  if (loading) {
    return (
      <div className="space-y-3 animate-fade-in">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 card-shadow">
        <h3 className="text-sm font-semibold text-gray-900">Erro ao carregar publicações</h3>
        <p className="text-xs text-gray-500 mt-1">{error}</p>
        <button
          onClick={reload}
          className="mt-3 text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Create Post */}
      <CreatePost eventId={event.id} onCreated={reload} />

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
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

      {loadingMore && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
        </div>
      )}
      <div ref={sentinelRef} className="h-px" />
    </div>
  )
}