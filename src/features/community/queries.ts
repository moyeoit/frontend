import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { communityQueries } from './queries.factory'
import { PostPage, PopularPostPage, PostDetail, PostComment } from './types'

export function usePosts(params?: {
  categoryName?: string
  page?: number
  size?: number
  sort?: string
}): UseQueryResult<PostPage, Error> {
  return useQuery(communityQueries.posts(params))
}

export function usePopularPosts(params?: {
  page?: number
  size?: number
  sort?: string
}): UseQueryResult<PopularPostPage, Error> {
  return useQuery(communityQueries.popular(params))
}

// 게시글 상세 조회
export function usePostDetail(
  postId: string,
): UseQueryResult<PostDetail, Error> {
  return useQuery(communityQueries.postDetail(postId))
}

// 댓글 목록 조회
export function usePostComments(
  postId: string,
): UseQueryResult<PostComment[], Error> {
  return useQuery(communityQueries.commentList(postId))
}
