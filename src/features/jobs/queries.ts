import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getJobs } from './api'
import { JobItem } from './types'

export function useJobs(): UseQueryResult<JobItem[], Error> {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    staleTime: 5 * 60 * 1000,
  })
}
