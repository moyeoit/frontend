import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import { LikeResponse, ToggleReviewLikeResult } from './types'

// 좋아요 토글 API
export async function toggleLike(
  reviewId: string,
  reviewType: string,
): Promise<LikeResponse> {
  const res = await apiClient.post<ApiResponse<LikeResponse>>(
    `/api/v1/like/${reviewId}/${reviewType}`,
  )
  return res.data.data
}

type ToggleReviewLikePayload = {
  likeCount?: number
  liked?: boolean
  isLiked?: boolean
}

function normalizeToggleReviewLikePayload(
  payload: ToggleReviewLikePayload | null | undefined,
): ToggleReviewLikeResult | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const liked =
    typeof payload.liked === 'boolean'
      ? payload.liked
      : typeof payload.isLiked === 'boolean'
        ? payload.isLiked
        : undefined

  const likeCount =
    typeof payload.likeCount === 'number' ? payload.likeCount : undefined

  if (liked === undefined && likeCount === undefined) {
    return null
  }

  return {
    liked,
    likeCount,
  }
}

export async function toggleReviewLike(
  reviewId: number,
): Promise<ToggleReviewLikeResult | null> {
  const res = await apiClient.post<
    ApiResponse<ToggleReviewLikePayload> | ToggleReviewLikePayload | null
  >(`/api/v1/review/like/${reviewId}`, null, {
    params: { reviewId },
  })

  const raw = res.data
  const payload =
    raw && typeof raw === 'object' && 'data' in raw ? raw.data : raw

  return normalizeToggleReviewLikePayload(payload)
}
