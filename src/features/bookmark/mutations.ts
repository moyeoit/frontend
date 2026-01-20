import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { toggleBookmark } from './api'
import { bookmarkKeys } from './keys'
import { BookmarkRequest, BookmarkResponse } from './types'

// 북마크 토글
export function useToggleBookmark(
  options?: UseMutationOptions<BookmarkResponse, Error, BookmarkRequest>,
): UseMutationResult<BookmarkResponse, Error, BookmarkRequest> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BookmarkRequest) => toggleBookmark(data),
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.status === 'SUCCESS') {
        if (variables.type === 'CLUB') {
          queryClient.invalidateQueries({
            queryKey: bookmarkKeys.clubs(),
          })
        }
        queryClient.invalidateQueries({
          queryKey: bookmarkKeys.all,
        })
      }

      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context)
    },
    ...options,
  })
}
