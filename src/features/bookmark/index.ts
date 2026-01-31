export {
  toggleBookmark,
  getBookmarkedClubs,
  getBookmarkedInterviewReviews,
  getBookmarkedActivityReviews,
  getBookmarkedBlogReviews,
} from './api'

export {
  useBookmarkedClubs,
  useBookmarkedInterviewReviews,
  useBookmarkedActivityReviews,
  useBookmarkedBlogReviews,
} from './queries'

export { useToggleBookmark } from './mutations'

export { bookmarkKeys } from './keys'

export type {
  BookmarkRequest,
  BookmarkResponse,
  BookmarkType,
  BookmarkedClub,
  BookmarkedClubsPage,
  BookmarkedClubsResponse,
  // 공통 후기 타입
  BookmarkedReview,
  BookmarkedReviewsPage,
  BookmarkedReviewsParams,
  BookmarkedReviewsResponse,
  // 후기 타입 별칭
  BookmarkedInterviewReview,
  BookmarkedInterviewReviewsPage,
  BookmarkedInterviewReviewsParams,
  BookmarkedInterviewReviewsResponse,
  BookmarkedActivityReview,
  BookmarkedActivityReviewsPage,
  BookmarkedActivityReviewsParams,
  BookmarkedActivityReviewsResponse,
  BookmarkedBlogReview,
  BookmarkedBlogReviewsPage,
  BookmarkedBlogReviewsParams,
  BookmarkedBlogReviewsResponse,
} from './types'
