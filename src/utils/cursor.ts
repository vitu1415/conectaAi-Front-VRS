import type { CursorPaginacao } from '@/types/api'

export const PAGE_LIMIT = 5

export function cursorParams(
  cursor: CursorPaginacao | null,
  limite: number = PAGE_LIMIT,
): Record<string, string | number> {
  const params: Record<string, string | number> = { limite }
  if (cursor) {
    params.cursorId = cursor.id
    params.cursorData = cursor.data
  }
  return params
}