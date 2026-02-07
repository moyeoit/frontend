import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from './api'
import { userKeys } from './keys'
import {
  UpdateUserInfoRequest,
  UpdateUserProfileImageRequest,
  UserActivateRequest,
  UpdateUserProfileImageRequest,
  UserActivateRequest,
  UpdateUserProfileRequest,
  UpdateUserManageRequest,
} from './types'

export const useUserActivate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserActivateRequest) => userApi.activate(data),
    onSuccess: (_data) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => {
      console.error('사용자 활성화 실패:', error)
    },
  })
}

export const useUpdateUserProfileImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: userKeys.updateProfileImage(),
    mutationFn: (body: UpdateUserProfileImageRequest) =>
      userApi.updateProfileImage(body),
    onSuccess: () => {
      // 프로필 데이터 갱신
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: userKeys.updateUserInfo(),
    mutationFn: (body: UpdateUserInfoRequest) => userApi.updateUserInfo(body),
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: userKeys.profile(),
    mutationFn: (body: UpdateUserProfileRequest) => userApi.updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

export const useUpdateUserManage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: userKeys.manage(),
    mutationFn: (body: UpdateUserManageRequest) => userApi.updateManage(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.manage() })
    },
  })
}
