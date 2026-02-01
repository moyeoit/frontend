import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { communityQueries } from './queries.factory'
import { PostPage, PopularPostPage } from './types'

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
