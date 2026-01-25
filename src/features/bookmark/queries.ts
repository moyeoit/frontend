import { UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  getBookmarkedClubs,
  getBookmarkedInterviewReviews,
  getBookmarkedActivityReviews,
} from './api'
import { bookmarkKeys } from './keys'
import {
  BookmarkedClubsResponse,
  BookmarkedInterviewReviewsParams,
  BookmarkedInterviewReviewsResponse,
  BookmarkedActivityReviewsParams,
  BookmarkedActivityReviewsResponse,
} from './types'

// 북마크한 동아리 목록 조회
export function useBookmarkedClubs(): UseQueryResult<
  BookmarkedClubsResponse,
  Error
> {
  return useQuery({
    queryKey: bookmarkKeys.clubs(),
    queryFn: getBookmarkedClubs,
  })
}

// 북마크한 서류/면접 후기 목록 조회
export function useBookmarkedInterviewReviews(
  params?: BookmarkedInterviewReviewsParams,
): UseQueryResult<BookmarkedInterviewReviewsResponse, Error> {
  return useQuery({
    queryKey: bookmarkKeys.interviewReviews(params),
    queryFn: () => getBookmarkedInterviewReviews(params),
  })
}

// 북마크한 활동 후기 목록 조회
export function useBookmarkedActivityReviews(
  params?: BookmarkedActivityReviewsParams,
): UseQueryResult<BookmarkedActivityReviewsResponse, Error> {
  return useQuery({
    queryKey: bookmarkKeys.activityReviews(params),
    queryFn: () => getBookmarkedActivityReviews(params),
  })
}
