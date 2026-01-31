import { BlogReviewSearchRequest } from './types'

export const blogReviewKeys = {
  all: ['blog-review'] as const,
  searches: () => [...blogReviewKeys.all, 'search'] as const,
  search: (params: BlogReviewSearchRequest) =>
    [...blogReviewKeys.searches(), params] as const,
}
