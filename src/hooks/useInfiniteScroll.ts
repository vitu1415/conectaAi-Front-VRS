import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { CursorPaginacao, PageResponse } from '@/types/api'
import { getErrorMessage } from '@/utils/error'

interface UseInfiniteScrollOptions<T> {
  fetchPage: (cursor: CursorPaginacao | null) => Promise<PageResponse<T>>
  rootRef?: RefObject<HTMLElement | null>
  deps?: unknown[]
}

export function useInfiniteScroll<T>({ fetchPage, rootRef, deps = [] }: UseInfiniteScrollOptions<T>) {
  const fetchPageRef = useRef(fetchPage)
  fetchPageRef.current = fetchPage

  const [items, setItems] = useState<T[]>([])
  const [cursor, setCursor] = useState<CursorPaginacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const loadFirst = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchPageRef.current(null)
      .then((page) => {
        setItems(page.content)
        setCursor(page.nextCursor)
        setHasMore(Boolean(page.nextCursor))
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const loadMore = useCallback(() => {
    if (loading || loadingMore) return
    if (!cursor) {
      setHasMore(false)
      return
    }
    setLoadingMore(true)
    fetchPageRef.current(cursor)
      .then((page) => {
        setItems((prev) => [...prev, ...page.content])
        setCursor(page.nextCursor)
        setHasMore(Boolean(page.nextCursor))
      })
      .catch(() => {
        // falha silenciosa ao carregar mais
      })
      .finally(() => setLoadingMore(false))
  }, [cursor, loading, loadingMore])

  const loadMoreRef = useRef(loadMore)
  loadMoreRef.current = loadMore

  useEffect(() => {
    loadFirst()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (!node) return
      const root = rootRef?.current ?? null
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) loadMoreRef.current()
        },
        { root, rootMargin: '200px' },
      )
      observer.observe(node)
      observerRef.current = observer
    },
    [rootRef],
  )

  return { items, loading, loadingMore, error, hasMore, sentinelRef, reload: loadFirst }
}