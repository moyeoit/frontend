import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getBookmarkedClubs } from './api'
import { bookmarkKeys } from './keys'
import { BookmarkedClubsResponse } from './types'

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
