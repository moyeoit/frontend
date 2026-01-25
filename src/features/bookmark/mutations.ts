import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query'
import { toggleBookmark } from './api'
import { BookmarkToggleData, BookmarkToggleRequest } from './types'

export function useToggleBookmark(
  options?: UseMutationOptions<
    BookmarkToggleData,
    Error,
    BookmarkToggleRequest,
    { previous?: BookmarkToggleData }
  >,
): UseMutationResult<
  BookmarkToggleData,
  Error,
  BookmarkToggleRequest,
  { previous?: BookmarkToggleData }
> {
  return useMutation({
    mutationFn: toggleBookmark,
    ...options,
  })
}
