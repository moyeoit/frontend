import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { exploreQueries } from './queries.factory'
import { Request } from './types'

// 동아리 탐색 목록 쿼리 훅
export function useExploreClubs(params?: Request) {
  return useQuery(exploreQueries.list(params))
}

// 동아리 탐색 무한스크롤 쿼리 훅
export function useInfiniteExploreClubs(params?: Omit<Request, 'page'>) {
  return useInfiniteQuery(exploreQueries.infiniteList(params))
}
