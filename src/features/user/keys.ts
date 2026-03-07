export const userKeys = {
  all: ['user'] as const,
  activate: () => [...userKeys.all, 'activate'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  updateProfile: () => [...userKeys.all, 'updateProfile'] as const,
  manage: () => [...userKeys.all, 'manage'] as const,
  posts: (params?: { page?: number; size?: number; sort?: string }) =>
    [...userKeys.all, 'posts', params] as const,
  updateProfileImage: () => [...userKeys.all, 'updateProfileImage'] as const,
  interests: () => [...userKeys.all, 'interests'] as const,
  updateUserInfo: () => [...userKeys.all, 'updateUserInfo'] as const,
}
