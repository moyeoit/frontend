import { UserProfile } from '@/features/user'

export type MyPageSectionKey = 'profile-basic' | 'settings-account'

export type LegacyMyPageSectionKey =
  | 'profile-activity'
  | 'activity-review'
  | 'activity-community'

export type MyPageQuerySection =
  | MyPageSectionKey
  | LegacyMyPageSectionKey
  | null
  | string

export interface ManageFormState {
  name: string
  subscriptionEmail: string
  emailNotifyAgree: boolean
}

export interface ProfileEditState {
  nickname: string
  jobId?: number
}

export type NullableUserProfile = UserProfile | null
