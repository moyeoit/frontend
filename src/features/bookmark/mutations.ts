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
      // 북마크 토글 성공 시 모든 관련 쿼리를 invalidate
      if (variables.type === 'CLUB') {
        queryClient.invalidateQueries({
          queryKey: bookmarkKeys.clubs(),
        })
      } else if (
        variables.type === 'INTERVIEW_REVIEW' ||
        variables.type === 'ACTIVITY_REVIEW'
      ) {
        // 모든 리뷰 쿼리를 invalidate (page, size 상관없이)
        queryClient.invalidateQueries({
          queryKey: bookmarkKeys.reviews(),
        })
      }

      // 전체 북마크 쿼리도 invalidate
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.all,
      })

      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      options?.onError?.(error, variables, onMutateResult, context)
    },
    ...options,
  })
}
