import axios from 'axios'
import { NullableUserProfile, MyPageQuerySection, MyPageSectionKey } from './types'

export const MY_PAGE_SECTIONS: MyPageSectionKey[] = [
  'profile-basic',
  'settings-account',
]

export function normalizeSection(section: MyPageQuerySection): MyPageSectionKey {
  if (!section) return 'profile-basic'
  if (MY_PAGE_SECTIONS.includes(section as MyPageSectionKey)) {
    return section as MyPageSectionKey
  }
  return 'profile-basic'
}

export function getProfileFormSnapshot(profile: NullableUserProfile) {
  return {
    nickname: profile?.nickname ?? '',
    jobId: profile?.jobDto?.id ?? profile?.job?.id,
  }
}

export function isEmailDirty(current: string, snapshot: string): boolean {
  return current.trim() !== snapshot.trim()
}

export function shouldConfirmNotificationOff(
  current: boolean,
  next: boolean,
): boolean {
  return current && !next
}

export function extractApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}
