import {
  BookmarkedInterviewReviewsParams,
  BookmarkedActivityReviewsParams,
} from './types'

export const bookmarkKeys = {
  all: ['bookmark'] as const,
  clubs: () => [...bookmarkKeys.all, 'clubs'] as const,
  reviews: () => [...bookmarkKeys.all, 'reviews'] as const,
  interviewReviews: (params?: BookmarkedInterviewReviewsParams) =>
    [...bookmarkKeys.reviews(), 'interview', params] as const,
  activityReviews: (params?: BookmarkedActivityReviewsParams) =>
    [...bookmarkKeys.reviews(), 'activity', params] as const,
} as const
