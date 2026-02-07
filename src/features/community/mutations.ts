import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import {
  createPost,
  postPostComment,
  putPatchPostComment,
  deletePostComment,
  togglePostLike,
  patchPost,
  deletePost,
} from './api'
import { communityKeys } from './keys'
import {
  PostCreateRequest,
  PostCreateResponse,
  PostComment,
  PostCommentCreateRequest,
  PostCommentUpdateRequest,
  PostLikeResponse,
  PostUpdateRequest,
  PostUpdateResponse,
  PostDetail,
} from './types'

// 게시글 좋아요 토글
export function useTogglePostLike(
  postId: string,
  options?: UseMutationOptions<PostLikeResponse, Error, void>,
): UseMutationResult<PostLikeResponse, Error, void> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: (data, variables, mutationResult, context) => {
      // 게시글 상세 조회는 다시 불러오지 않고, 캐시만 직접 업데이트
      queryClient.setQueryData<PostDetail | undefined>(
        communityKeys.postDetail(postId),
        (prev) =>
          prev
            ? {
                ...prev,
                liked: data.liked,
                like_count: data.likeCount,
              }
            : prev,
      )

      // 목록/인기 목록은 기존처럼 무효화하여 다른 화면에서는 최신 데이터 유지
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.popular(),
      })
      onSuccess?.(data, variables, mutationResult, context)
    },
    onError,
    onSettled,
    ...restOptions,
  })
}

// 게시글 수정
export function usePatchPost(
  postId: string,
  options?: UseMutationOptions<PostUpdateResponse, Error, PostUpdateRequest>,
): UseMutationResult<PostUpdateResponse, Error, PostUpdateRequest> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: (data) => patchPost(postId, data),
    onSuccess: (data, variables, mutationResult, context) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.postDetail(postId),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.popular(),
      })
      onSuccess?.(data, variables, mutationResult, context)
    },
    onError,
    onSettled,
    ...restOptions,
  })
}

// 게시글 삭제
export function useDeletePost(
  postId: string,
  options?: UseMutationOptions<void, Error, void>,
): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: (data, variables, mutationResult, context) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.postDetail(postId),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.popular(),
      })
      onSuccess?.(data, variables, mutationResult, context)
    },
    onError,
    onSettled,
    ...restOptions,
  })
}

// 게시글 작성
export function useCreatePost(
  options?: UseMutationOptions<PostCreateResponse, Error, PostCreateRequest>,
): UseMutationResult<PostCreateResponse, Error, PostCreateRequest> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: (data, variables, mutationResult, context) => {
      // 게시글 작성 성공 시 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: communityKeys.posts(),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.popular(),
      })
      options?.onSuccess?.(data, variables, mutationResult, context)
    },
    ...options,
  })
}

// 댓글 작성
export function usePostPostComment(
  postId: string,
  options?: UseMutationOptions<PostComment, Error, PostCommentCreateRequest>,
): UseMutationResult<PostComment, Error, PostCommentCreateRequest> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: (data) => postPostComment(postId, data),
    onSuccess: (data, variables, mutationResult, context) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.commentList(postId),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.postDetail(postId),
      })
      onSuccess?.(data, variables, mutationResult, context)
    },
    onError,
    onSettled,
    ...restOptions,
  })
}

// 댓글 수정
export function usePutPatchPostComment(
  postId: string,
  options?: UseMutationOptions<
    PostComment,
    Error,
    { commentId: number; data: PostCommentUpdateRequest }
  >,
): UseMutationResult<
  PostComment,
  Error,
  { commentId: number; data: PostCommentUpdateRequest }
> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: ({ commentId, data }) => putPatchPostComment(commentId, data),
    onSuccess: (data, variables, mutationResult, context) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.commentList(postId),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.postDetail(postId),
      })
      onSuccess?.(data, variables, mutationResult, context)
    },
    onError,
    onSettled,
    ...restOptions,
  })
}

// 댓글 삭제
export function useDeletePostComment(
  postId: string,
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: deletePostComment,
    onSuccess: (data, variables, mutationResult, context) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.commentList(postId),
      })
      queryClient.invalidateQueries({
        queryKey: communityKeys.postDetail(postId),
      })
      onSuccess?.(data, variables, mutationResult, context)
    },
    onError,
    onSettled,
    ...restOptions,
  })
}
