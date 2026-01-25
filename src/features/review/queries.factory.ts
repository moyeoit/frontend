import { queryOptions } from '@tanstack/react-query'
import {
  getBasicReviews,
  getPremiumReviews,
  getClubPremiumReviews,
  getClubBasicReviews,
  getPremiumReviewDetail,
  getReviewDetail,
  getReviewComments,
  searchReviews,
} from './api'
import { reviewKeys } from './keys'
import {
  BasicReviewsPage,
  PremiumReviewDetail,
  PremiumReviewsPage,
  ReviewsQueryParams,
  ReviewSearchPage,
  ReviewSearchParams,
  ReviewView,
  ReviewComment,
} from './types'

export const reviewQueries = {
  // Premium reviews
  premiumList: (params?: ReviewsQueryParams) =>
    queryOptions<PremiumReviewsPage>({
      queryKey: reviewKeys.premiumList(params),
      queryFn: () => getPremiumReviews(params),
      staleTime: 60_000,
    }),

  // Club premium reviews (동아리 상세 페이지용)
  clubPremiumList: (
    clubId: number,
    params?: Omit<ReviewsQueryParams, 'club'>,
  ) =>
    queryOptions<PremiumReviewsPage>({
      queryKey: reviewKeys.clubPremiumList(clubId, params),
      queryFn: () => getClubPremiumReviews(clubId, params),
      staleTime: 60_000,
    }),

  // Premium review detail
  premiumDetail: (premiumReviewId: number) =>
    queryOptions<PremiumReviewDetail>({
      queryKey: reviewKeys.premiumDetail(premiumReviewId),
      queryFn: () => getPremiumReviewDetail(premiumReviewId),
      staleTime: 60_000,
    }),

  // Review detail
  detail: (reviewId: number) =>
    queryOptions<ReviewView>({
      queryKey: reviewKeys.detail(reviewId),
      queryFn: () => getReviewDetail(reviewId),
      staleTime: 60_000,
    }),

  // Review comments
  commentList: (reviewId: number) =>
    queryOptions<ReviewComment[]>({
      queryKey: reviewKeys.commentList(reviewId),
      queryFn: () => getReviewComments(reviewId),
      enabled: Number.isFinite(reviewId),
      staleTime: 30_000,
    }),

  // Basic reviews
  basicList: (params?: ReviewsQueryParams) =>
    queryOptions<BasicReviewsPage>({
      queryKey: reviewKeys.basicList(params),
      queryFn: () => getBasicReviews(params),
      staleTime: 60_000,
    }),

  // Club basic reviews (동아리 상세 페이지용)
  clubBasicList: (clubId: number, params?: Omit<ReviewsQueryParams, 'club'>) =>
    queryOptions<BasicReviewsPage>({
      queryKey: reviewKeys.clubBasicList(clubId, params),
      queryFn: () => getClubBasicReviews(clubId, params),
      staleTime: 60_000,
    }),

  // Popular premium reviews
  popularPremium: () =>
    queryOptions<PremiumReviewsPage>({
      queryKey: reviewKeys.popularPremium(),
      queryFn: () => getPremiumReviews({ size: 4, sort: '인기순' }),
      staleTime: 60_000,
    }),

  // Search reviews (탐색)
  searchList: (params?: ReviewSearchParams) =>
    queryOptions<ReviewSearchPage>({
      queryKey: reviewKeys.searchList(params),
      queryFn: () => searchReviews(params),
      staleTime: 30_000,
    }),
} as const

export type ReviewQueries = typeof reviewQueries
