import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import {
  BasicReviewCreateRequest,
  BasicReviewsPage,
  PremiumReviewCreateRequest,
  PremiumReviewDetail,
  PremiumReviewCreateResponse,
  PremiumReviewsPage,
  ReviewsQueryParams,
  ReviewSearchPage,
  ReviewSearchParams,
  ReviewView,
  ReviewComment,
  ReviewCommentCreateRequest,
  ReviewCommentUpdateRequest,
} from './types'

// 프리미엄 후기 목록 조회
export async function getPremiumReviews(
  params?: ReviewsQueryParams,
): Promise<PremiumReviewsPage> {
  const res = await apiClient.get<ApiResponse<PremiumReviewsPage>>(
    '/api/v1/reviews/premium',
    {
      params,
    },
  )
  return res.data.data
}

// 동아리별 프리미엄 후기 목록 조회 (동아리 상세 페이지용)
export async function getClubPremiumReviews(
  clubId: number,
  params?: Omit<ReviewsQueryParams, 'club'>,
): Promise<PremiumReviewsPage> {
  const res = await apiClient.get<ApiResponse<PremiumReviewsPage>>(
    `/api/v1/reviews/premium?clubId=${clubId}`,
    {
      params,
    },
  )
  return res.data.data
}

// 베이직 후기 목록 조회
export async function getBasicReviews(
  params?: ReviewsQueryParams,
): Promise<BasicReviewsPage> {
  const res = await apiClient.get<ApiResponse<BasicReviewsPage>>(
    '/api/v1/reviews/basic',
    {
      params,
    },
  )
  return res.data.data
}

// 동아리별 베이직 후기 목록 조회 (동아리 상세페이지용)
export async function getClubBasicReviews(
  clubId: number,
  params?: Omit<ReviewsQueryParams, 'club'>,
): Promise<BasicReviewsPage> {
  const res = await apiClient.get<ApiResponse<BasicReviewsPage>>(
    `/api/v1/reviews/basic?clubId=${clubId}`,
    {
      params,
    },
  )
  return res.data.data
}

// 일반 후기 생성
export async function postBasicReview(
  data: BasicReviewCreateRequest,
): Promise<void> {
  await apiClient.post('/api/v1/review', data)
}

// 프리미엄 후기 상세 조회
export async function getPremiumReviewDetail(
  premiumReviewId: number,
): Promise<PremiumReviewDetail> {
  const res = await apiClient.get<ApiResponse<PremiumReviewDetail>>(
    `/api/v1/review/premium/${premiumReviewId}`,
  )
  return res.data.data
}

// 후기 상세 조회
export async function getReviewDetail(reviewId: number): Promise<ReviewView> {
  const res = await apiClient.get<ApiResponse<ReviewView>>(
    `/api/v1/review/${reviewId}`,
  )
  return res.data.data
}

// 후기 댓글 목록 조회
export async function getReviewComments(
  reviewId: number,
): Promise<ReviewComment[]> {
  const res = await apiClient.get<
    ApiResponse<ReviewComment[]> | ReviewComment[]
  >(`/api/v1/review/comment/${reviewId}`)
  return Array.isArray(res.data) ? res.data : res.data.data
}

// 후기 댓글 생성
export async function postReviewComment(
  data: ReviewCommentCreateRequest,
): Promise<void> {
  await apiClient.post('/api/v1/review/comment', data)
}

// 후기 댓글 수정
export async function putReviewComment(
  commentId: number,
  data: ReviewCommentUpdateRequest,
): Promise<void> {
  await apiClient.put(`/api/v1/review/comment/${commentId}`, data)
}

// 후기 댓글 삭제
export async function deleteReviewComment(commentId: number): Promise<void> {
  await apiClient.delete(`/api/v1/review/comment/${commentId}`)
}

// 프리미엄 후기 생성
export async function postPremiumReview(
  data: PremiumReviewCreateRequest,
): Promise<PremiumReviewCreateResponse> {
  const res = await apiClient.post<ApiResponse<PremiumReviewCreateResponse>>(
    '/api/v1/review/premium',
    data,
  )
  return res.data.data
}

// 후기 탐색 검색
export async function searchReviews(
  params?: ReviewSearchParams,
): Promise<ReviewSearchPage> {
  const res = await apiClient.get<ApiResponse<ReviewSearchPage>>(
    '/api/v1/review/search',
    {
      params,
    },
  )
  return res.data.data
}
