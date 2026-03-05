import { queryOptions } from '@tanstack/react-query'
import {
  getPosts,
  getPopularPosts,
  getSearchPosts,
  getPostDetail,
  getPostComments,
} from './api'
import { communityKeys } from './keys'
import { PostPage, PopularPostPage, PostDetail, PostComment } from './types'

export const communityQueries = {
  posts: (params?: {
    categoryName?: string
    page?: number
    size?: number
    sort?: string
  }) =>
    queryOptions<PostPage>({
      queryKey: communityKeys.post(params),
      queryFn: () => getPosts(params),
      staleTime: 60_000,
    }),
  popular: (params?: { page?: number; size?: number; sort?: string }) =>
    queryOptions<PopularPostPage>({
      queryKey: communityKeys.popularPosts(params),
      queryFn: () => getPopularPosts(params),
      staleTime: 60_000,
    }),
  search: (params: {
    keyword: string
    page?: number
    size?: number
    sort?: string
  }) =>
    queryOptions<PostPage>({
      queryKey: communityKeys.searchPost(params),
      queryFn: () => getSearchPosts(params),
      enabled: params.keyword.trim().length > 0,
      staleTime: 60_000,
    }),
  // 게시글 상세 조회
  postDetail: (postId: string) =>
    queryOptions<PostDetail>({
      queryKey: communityKeys.postDetail(postId),
      queryFn: () => getPostDetail(postId),
      enabled: Boolean(postId),
      staleTime: 60_000,
    }),
  // 댓글 목록
  commentList: (postId: string) =>
    queryOptions<PostComment[]>({
      queryKey: communityKeys.commentList(postId),
      queryFn: () => getPostComments(postId),
      enabled: Boolean(postId),
    }),
} as const

export type CommunityQueries = typeof communityQueries
