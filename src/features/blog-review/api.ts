import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import { BlogReviewSearchRequest, BlogReviewSearchResponse } from './types'

// 블로그 리뷰 검색
export async function searchBlogReviews(
  params: BlogReviewSearchRequest,
): Promise<BlogReviewSearchResponse> {
  console.log('🚀 블로그 리뷰 API 호출:', {
    url: '/api/v1/blog-review/search',
    params,
  })
  const res = await apiClient.get<ApiResponse<BlogReviewSearchResponse>>(
    '/api/v1/blog-review/search',
    {
      params,
    },
  )
  console.log('✅ 블로그 리뷰 API 응답:', res.data)
  return res.data.data
}
