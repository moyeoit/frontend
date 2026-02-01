import { queryOptions } from '@tanstack/react-query'
import { getPosts, getPopularPosts } from './api'
import { communityKeys } from './keys'
import { PostPage, PopularPostPage } from './types'

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
} as const

export type CommunityQueries = typeof communityQueries
