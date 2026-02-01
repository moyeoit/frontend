import { apiClient } from '@/shared/utils'
import { ApiResponse } from '../explore/types'
import { PopularPostPage, PostPage } from './types'

export async function getPosts(params?: {
  categoryName?: string
  page?: number
  size?: number
  sort?: string
}): Promise<PostPage> {
  const res = await apiClient.get<ApiResponse<PostPage>>('/api/v2/post/feed', {
    params,
  })
  return res.data.data
}

export async function getPopularPosts(params?: {
  page?: number
  size?: number
  sort?: string
}): Promise<PopularPostPage> {
  const res = await apiClient.get<ApiResponse<PopularPostPage>>(
    '/api/v2/post/popular',
    {
      params,
    },
  )
  return res.data.data
}
