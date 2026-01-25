import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import {
  deleteReviewComment,
  postBasicReview,
  postPremiumReview,
  postReviewComment,
  putReviewComment,
} from './api'
import { reviewKeys } from './keys'
import {
  BasicReviewCreateRequest,
  PremiumReviewCreateRequest,
  PremiumReviewCreateResponse,
  ReviewCommentCreateRequest,
  ReviewCommentUpdateRequest,
} from './types'

// 일반 후기 생성 뮤테이션
export function usePostBasicReview(
  options?: UseMutationOptions<void, Error, BasicReviewCreateRequest>,
): UseMutationResult<void, Error, BasicReviewCreateRequest> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postBasicReview,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 베이직 후기 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.basicLists(),
      })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
}

// 프리미엄 후기 생성 뮤테이션
export function usePostPremiumReview(
  options?: UseMutationOptions<
    PremiumReviewCreateResponse,
    Error,
    PremiumReviewCreateRequest
  >,
): UseMutationResult<
  PremiumReviewCreateResponse,
  Error,
  PremiumReviewCreateRequest
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postPremiumReview,
    onSuccess: (data, variables, onMutateResult, context) => {
      // 프리미엄 후기 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: reviewKeys.premiumLists(),
      })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    ...options,
  })
}

export function usePostReviewComment(
  reviewId: number,
  options?: UseMutationOptions<void, Error, ReviewCommentCreateRequest>,
): UseMutationResult<void, Error, ReviewCommentCreateRequest> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: postReviewComment,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.commentList(reviewId),
      })
      queryClient.refetchQueries({
        queryKey: reviewKeys.commentList(reviewId),
      })
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(reviewId),
      })
      onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      onError?.(error, variables, onMutateResult, context)
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      onSettled?.(data, error, variables, onMutateResult, context)
    },
    ...restOptions,
  })
}

export function usePutReviewComment(
  reviewId: number,
  options?: UseMutationOptions<
    void,
    Error,
    { commentId: number; data: ReviewCommentUpdateRequest }
  >,
): UseMutationResult<
  void,
  Error,
  { commentId: number; data: ReviewCommentUpdateRequest }
> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: ({ commentId, data }) => putReviewComment(commentId, data),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.commentList(reviewId),
      })
      queryClient.refetchQueries({
        queryKey: reviewKeys.commentList(reviewId),
      })
      onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      onError?.(error, variables, onMutateResult, context)
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      onSettled?.(data, error, variables, onMutateResult, context)
    },
    ...restOptions,
  })
}

export function useDeleteReviewComment(
  reviewId: number,
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: deleteReviewComment,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.commentList(reviewId),
      })
      queryClient.refetchQueries({
        queryKey: reviewKeys.commentList(reviewId),
      })
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(reviewId),
      })
      onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      onError?.(error, variables, onMutateResult, context)
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      onSettled?.(data, error, variables, onMutateResult, context)
    },
    ...restOptions,
  })
}
