import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import {
  BookmarkRequest,
  BookmarkResponse,
  BookmarkedClubsResponse,
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
