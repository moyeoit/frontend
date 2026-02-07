import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { searchBlogReviews } from './api'
import { blogReviewKeys } from './keys'
import { BlogReviewSearchRequest, BlogReviewSearchResponse } from './types'

export function useBlogReviewSearch(
  params: BlogReviewSearchRequest,
  options?: Omit<
    UseQueryOptions<
      BlogReviewSearchResponse,
      Error,
      BlogReviewSearchResponse,
      ReturnType<typeof blogReviewKeys.search>
    >,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<BlogReviewSearchResponse, Error> {
  return useQuery({
    queryKey: blogReviewKeys.search(params),
    queryFn: () => searchBlogReviews(params),
    ...options,
  })
}
