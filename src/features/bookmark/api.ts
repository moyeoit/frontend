import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import {
  BookmarkRequest,
  BookmarkResponse,
  BookmarkedClubsResponse,
  BookmarkedInterviewReviewsParams,
  BookmarkedInterviewReviewsResponse,
  BookmarkedActivityReviewsParams,
  BookmarkedActivityReviewsResponse,
} from './types'

// 북마크 토글 API
export async function toggleBookmark(
  data: BookmarkRequest,
): Promise<BookmarkResponse> {
  const res = await apiClient.post<ApiResponse<BookmarkResponse>>(
    '/api/v1/bookmarks',
    data,
  )
  return res.data.data || res.data
}

// 북마크한 동아리 목록 조회 API
export async function getBookmarkedClubs(): Promise<BookmarkedClubsResponse> {
  const res = await apiClient.get<BookmarkedClubsResponse>(
    '/api/v1/bookmarks/clubs',
  )
  return res.data
}

// 북마크한 서류/면접 후기 목록 조회 API
export async function getBookmarkedInterviewReviews(
  params?: BookmarkedInterviewReviewsParams,
): Promise<BookmarkedInterviewReviewsResponse> {
  const res = await apiClient.get<BookmarkedInterviewReviewsResponse>(
    '/api/v1/bookmarks/reviews/interview',
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sort: params?.sort,
      },
    },
  )
  return res.data
}

// 북마크한 활동 후기 목록 조회 API
export async function getBookmarkedActivityReviews(
  params?: BookmarkedActivityReviewsParams,
): Promise<BookmarkedActivityReviewsResponse> {
  const res = await apiClient.get<BookmarkedActivityReviewsResponse>(
    '/api/v1/bookmarks/reviews/activity',
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sort: params?.sort,
      },
    },
  )
  return res.data
}
