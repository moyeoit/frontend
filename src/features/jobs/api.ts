import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import { JobItem, JobsPayload } from './types'

export async function getJobs(): Promise<JobItem[]> {
  const res = await apiClient.get<ApiResponse<JobsPayload>>('/api/v1/job')
  return res.data.data?.jobs ?? []
}
