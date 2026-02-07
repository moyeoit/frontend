import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import {
  BookmarkType,
  BookmarkRequest,
  BookmarkResponse,
  BookmarkedClubsResponse,
  BookmarkedInterviewReviewsParams,
  BookmarkedInterviewReviewsResponse,
  BookmarkedActivityReviewsParams,
  BookmarkedActivityReviewsResponse,
  BookmarkedBlogReviewsParams,
  BookmarkedBlogReviewsResponse,
} from './types'

// 북마크 토글 API
export async function toggleBookmark(
  data: BookmarkRequest,
): Promise<BookmarkResponse> {
  console.log('📤 북마크 토글 API 호출 - 전달되는 데이터:', {
    targetId: data.targetId,
    type: data.type,
    전체데이터: data,
  })
  const res = await apiClient.post<ApiResponse<BookmarkResponse>>(
    '/api/v1/bookmarks',
    data,
  )
  console.log('📥 북마크 토글 API 응답:', res.data)
  return res.data.data
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

// 북마크한 블로그 후기 목록 조회 API
export async function getBookmarkedBlogReviews(
  params?: BookmarkedBlogReviewsParams,
): Promise<BookmarkedBlogReviewsResponse> {
  const res = await apiClient.get<BookmarkedBlogReviewsResponse>(
    '/api/v1/bookmarks/reviews/blog',
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

type ReviewBookmarkType = Extract<BookmarkType, 'INTERVIEW_REVIEW' | 'ACTIVITY_REVIEW'>

interface CheckReviewBookmarkOptions {
  pageSize?: number
  maxPages?: number
}

const DEFAULT_PAGE_SIZE = 100
const DEFAULT_MAX_PAGES = 30

// 북마크 목록 API를 순회해 특정 후기의 북마크 여부를 확인
export async function checkReviewBookmarkedFromLists(
  reviewId: number,
  type: ReviewBookmarkType,
  options?: CheckReviewBookmarkOptions,
): Promise<boolean> {
  const pageSize = Math.max(1, options?.pageSize ?? DEFAULT_PAGE_SIZE)
  const maxPages = Math.max(1, options?.maxPages ?? DEFAULT_MAX_PAGES)

  for (let page = 0; page < maxPages; page += 1) {
    const response =
      type === 'ACTIVITY_REVIEW'
        ? await getBookmarkedActivityReviews({ page, size: pageSize })
        : await getBookmarkedInterviewReviews({ page, size: pageSize })

    const pageData = response.data
    const isBookmarked = pageData.content.some((item) => item.reviewId === reviewId)
    if (isBookmarked) {
      return true
    }

    if (pageData.last || page + 1 >= pageData.totalPages) {
      break
    }
  }

  return false
}
