import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import { BookmarkToggleData, BookmarkToggleRequest } from './types'

export async function toggleBookmark(
  data: BookmarkToggleRequest,
): Promise<BookmarkToggleData> {
  const res = await apiClient.post<ApiResponse<BookmarkToggleData>>(
    '/api/v1/bookmarks',
    data,
  )
  return res.data.data
}
