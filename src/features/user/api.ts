import { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/utils/axios'
import {
  UserActivateRequest,
  UserActivateResponse,
  UserProfile,
  UpdateUserProfileRequest,
  UpdateUserProfileImageRequest,
  UserInterests,
  UserManageInfo,
  UpdateUserManageRequest,
  UserPostsPage,
  UserPostsParams,
} from './types'

export const userApi = {
  /**
   * 사용자 활성화 (회원가입 완료)
   * @param data - 사용자 활성화 요청 데이터
   */
  activate: async (
    data: UserActivateRequest,
  ): Promise<UserActivateResponse> => {
    const response = await apiClient.post<UserActivateResponse>(
      '/api/v1/user/activate',
      data,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('oauth_data') || '{}').accessToken}`,
        },
      },
    )
    return response.data
  },
  /**
   * 사용자 프로필 조회 (GET /v1/user/profile)
   */
  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<ApiResponse<UserProfile>>(
      '/api/v1/user/profile',
    )
    return res.data.data
  },
  /**
   * 프로필 이미지 업데이트 (POST /v1/user/profile/image)
   */
  updateProfileImage: async (
    body: UpdateUserProfileImageRequest,
  ): Promise<UserProfile> => {
    const res = await apiClient.post<ApiResponse<UserProfile>>(
      '/api/v1/user/profile/image',
      body,
    )
    return res.data.data
  },
  /**
   * 기본 정보 수정 (PATCH /v1/user)
   */
  updateProfile: async (body: UpdateUserProfileRequest): Promise<void> => {
    await apiClient.patch('/api/v1/user', body)
  },
  /**
   * 계정 관리 조회 (GET /v1/user/manage)
   */
  getManage: async (): Promise<UserManageInfo> => {
    const res = await apiClient.get<ApiResponse<UserManageInfo>>(
      '/api/v1/user/manage',
    )
    return res.data.data
  },
  /**
   * 계정 관리 수정 (PATCH /v1/user/manage)
   */
  updateManage: async (body: UpdateUserManageRequest): Promise<void> => {
    await apiClient.patch('/api/v1/user/manage', body)
  },
  /**
   * 내 작성글 조회 (GET /v1/user/posts)
   */
  getUserPosts: async (params?: UserPostsParams): Promise<UserPostsPage> => {
    const res = await apiClient.get<ApiResponse<UserPostsPage>>(
      '/api/v1/user/posts',
      {
        params,
      },
    )
    return res.data.data
  },
  /**
   * 관심 통계 조회 (GET /v1/user/interests)
   */
  getInterests: async (): Promise<UserInterests> => {
    const res = await apiClient.get<ApiResponse<UserInterests>>(
      '/api/v1/user/interests',
    )
    return res.data.data
  },
}
