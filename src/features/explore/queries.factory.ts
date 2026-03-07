import { getExploreClubs } from './api'
import { Request } from './types'

// 쿼리 키 팩토리
export const exploreQueries = {
  list: (params?: Request) => ({
    queryKey: ['explore', params] as const,
    queryFn: () => getExploreClubs(params),
  }),
  infiniteList: (params?: Omit<Request, 'page'>) => ({
    queryKey: ['explore', 'infinite', params] as const,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getExploreClubs({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: Awaited<ReturnType<typeof getExploreClubs>>) =>
      lastPage.last ? undefined : lastPage.number + 1,
  }),
}
