import { ReviewsQueryParams, ReviewSearchParams } from './types'

export const reviewKeys = {
  all: () => ['reviews'] as const,
  lists: () => [...reviewKeys.all(), 'list'] as const,

  // Premium reviews - 후기 탐색 페이지 (/review/explore)
  premiumLists: () => [...reviewKeys.lists(), 'premium'] as const,
  premiumList: (params?: ReviewsQueryParams) =>
    [...reviewKeys.premiumLists(), params ?? {}] as const,
  premiumDetails: () => [...reviewKeys.all(), 'premium-detail'] as const,
  premiumDetail: (premiumReviewId: number) =>
    [...reviewKeys.premiumDetails(), premiumReviewId] as const,

  // Review detail - /review/[reviewId]
  details: () => [...reviewKeys.all(), 'detail'] as const,
  detail: (reviewId: number) => [...reviewKeys.details(), reviewId] as const,

  // Review comments - /review/[reviewId]
  commentLists: () => [...reviewKeys.all(), 'comments'] as const,
  commentList: (reviewId: number) =>
    [...reviewKeys.commentLists(), reviewId] as const,

  // Club premium reviews - 동아리 상세 페이지 프리미엄 후기 탭 (/club/[clubId])
  clubPremiumLists: () => [...reviewKeys.lists(), 'club-premium'] as const,
  clubPremiumList: (
    clubId: number,
    params?: Omit<ReviewsQueryParams, 'club'>,
  ) => [...reviewKeys.clubPremiumLists(), clubId, params] as const,

  // Basic reviews - 동아리 상세 페이지 일반 후기 탭 (/club/[clubId])
  basicLists: () => [...reviewKeys.lists(), 'basic'] as const,
  basicList: (params?: ReviewsQueryParams) =>
    [...reviewKeys.basicLists(), params ?? {}] as const,

  // Club basic reviews - 동아리 상세 페이지 일반 후기 탭 (/club/[clubId])
  clubBasicLists: () => [...reviewKeys.lists(), 'club-basic'] as const,
  clubBasicList: (clubId: number, params?: Omit<ReviewsQueryParams, 'club'>) =>
    [...reviewKeys.clubBasicLists(), clubId, params] as const,

  // Popular premium reviews - 메인 페이지 (/)
  popularPremium: () => [...reviewKeys.all(), 'popular-premium'] as const,

  // Review search - 후기 탐색 페이지 (/review/explore)
  searchLists: () => [...reviewKeys.lists(), 'search'] as const,
  searchList: (params?: ReviewSearchParams) =>
    [...reviewKeys.searchLists(), params ?? {}] as const,
} as const

export type ReviewKeys = typeof reviewKeys
