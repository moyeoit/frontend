'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import { useUploadFile } from '@/features/file'
import { useJobs } from '@/features/jobs'
import {
  useUpdateUserManage,
  useUpdateUserProfile,
  useUpdateUserProfileImage,
  useUserManage,
  useUserProfile,
} from '@/features/user'
import AppPath from '@/shared/configs/appPath'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'
import { useAuth } from '@/shared/providers/auth-provider'
import { cn } from '@/shared/utils/cn'
import { AccountSection } from './sections/AccountSection'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { NotificationOffConfirmDialog } from './sections/NotificationOffConfirmDialog'
import { ManageFormState, MyPageSectionKey, ProfileEditState } from './types'
import {
  extractApiErrorMessage,
  getProfileFormSnapshot,
  isEmailDirty,
  normalizeSection,
  shouldConfirmNotificationOff,
} from './utils'

type SideGroup = 'profile' | 'settings'

const SECTION_TO_GROUP: Record<MyPageSectionKey, SideGroup> = {
  'profile-basic': 'profile',
  'settings-account': 'settings',
}

export default function MyPage() {
  const router = useRouter()
  const { isDesktop } = useMediaQuery()
  const { logout, user, isLoading: isAuthLoading } = useAuth()

  const [sectionParam, setSectionParam] = useQueryState(
    'section',
    'profile-basic',
  )

  const section = normalizeSection(sectionParam)
  const activeGroup = SECTION_TO_GROUP[section]

  const { data: profile } = useUserProfile()
  const profileData = profile ?? null
  const { data: jobs = [] } = useJobs()
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile()

  const { data: manageInfo } = useUserManage()
  const { mutate: updateManage, isPending: isUpdatingManage } =
    useUpdateUserManage()

  const { mutate: uploadFile, isPending: isUploadingImage } = useUploadFile()
  const { mutate: updateProfileImage, isPending: isUpdatingImage } =
    useUpdateUserProfileImage()

  const [profileForm, setProfileForm] = useState<ProfileEditState>({
    nickname: '',
    jobId: undefined,
  })
  const profileSnapshotRef = useRef<ProfileEditState>(profileForm)
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(
    null,
  )

  const [manageForm, setManageForm] = useState<ManageFormState>({
    name: '',
    subscriptionEmail: '',
    emailNotifyAgree: true,
  })
  const manageSnapshotRef = useRef<ManageFormState>(manageForm)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(
    null,
  )

  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(AppPath.login())
    }
  }, [isAuthLoading, user, router])

  useEffect(() => {
    if (sectionParam !== section) {
      setSectionParam(section)
    }
  }, [section, sectionParam, setSectionParam])

  useEffect(() => {
    const snapshot = getProfileFormSnapshot(profileData)
    setProfileForm(snapshot)
    profileSnapshotRef.current = snapshot
  }, [profileData])

  useEffect(() => {
    if (!manageInfo) return

    const snapshot = {
      name: manageInfo.name ?? '',
      subscriptionEmail: manageInfo.subscriptionEmail ?? '',
      emailNotifyAgree: manageInfo.emailNotifyAgree ?? true,
    }
    setManageForm(snapshot)
    manageSnapshotRef.current = snapshot
  }, [manageInfo])

  const showNicknameActions = useMemo(
    () =>
      profileForm.nickname.trim() !==
      profileSnapshotRef.current.nickname.trim(),
    [profileForm.nickname],
  )

  const showEmailActions = useMemo(
    () =>
      isEmailDirty(
        manageForm.subscriptionEmail,
        manageSnapshotRef.current.subscriptionEmail,
      ),
    [manageForm.subscriptionEmail],
  )

  const handleSelectSection = (next: MyPageSectionKey) => {
    setSectionParam(next)
  }

  const handleOpenWithdrawPage = () => {
    if (typeof window === 'undefined') return
    window.open(AppPath.myPageWithdraw(), '_blank', 'noopener,noreferrer')
  }

  const handleProfileImageChange = (file?: File) => {
    if (!file) return

    uploadFile(file, {
      onSuccess: (res) => {
        setTempImageUrl(res.fileUrl)
        updateProfileImage(
          { fileUrl: res.fileUrl },
          {
            onSuccess: () => {
              setTempImageUrl(null)
            },
            onError: (error) => {
              setTempImageUrl(null)
              setProfileErrorMessage(
                extractApiErrorMessage(
                  error,
                  '프로필 사진 변경 중 오류가 발생했습니다.',
                ),
              )
            },
          },
        )
      },
      onError: (error) => {
        setProfileErrorMessage(
          extractApiErrorMessage(
            error,
            '이미지 업로드 중 오류가 발생했습니다.',
          ),
        )
      },
    })
  }

  const handleCancelNicknameEdit = () => {
    setProfileForm((prev) => ({
      ...prev,
      nickname: profileSnapshotRef.current.nickname,
    }))
    setProfileErrorMessage(null)
  }

  const handleSaveNickname = () => {
    if (!showNicknameActions || isUpdatingProfile) return

    const trimmedNickname = profileForm.nickname.trim()

    if (!trimmedNickname) {
      setProfileErrorMessage('닉네임을 입력해주세요.')
      setProfileForm((prev) => ({
        ...prev,
        nickname: profileSnapshotRef.current.nickname,
      }))
      return
    }

    updateProfile(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          profileSnapshotRef.current = {
            ...profileSnapshotRef.current,
            nickname: trimmedNickname,
          }
          setProfileForm((prev) => ({ ...prev, nickname: trimmedNickname }))
          setProfileErrorMessage(null)
        },
        onError: (error) => {
          setProfileForm((prev) => ({
            ...prev,
            nickname: profileSnapshotRef.current.nickname,
          }))
          setProfileErrorMessage(
            extractApiErrorMessage(
              error,
              '닉네임 변경 가능 횟수를 확인해주세요.',
            ),
          )
        },
      },
    )
  }

  const handleSelectJob = (jobId: number) => {
    const currentJobId = profileSnapshotRef.current.jobId
    if (currentJobId === jobId || isUpdatingProfile) return

    setProfileForm((prev) => ({ ...prev, jobId }))

    updateProfile(
      { nickname: profileSnapshotRef.current.nickname, jobId },
      {
        onSuccess: () => {
          profileSnapshotRef.current = {
            ...profileSnapshotRef.current,
            jobId,
          }
          setProfileErrorMessage(null)
        },
        onError: (error) => {
          setProfileForm((prev) => ({
            ...prev,
            jobId: profileSnapshotRef.current.jobId,
          }))
          setProfileErrorMessage(
            extractApiErrorMessage(
              error,
              '분야 변경 가능 횟수를 확인해주세요.',
            ),
          )
        },
      },
    )
  }

  const updateEmailNotification = (next: boolean) => {
    if (isUpdatingManage) return

    const previous = manageForm.emailNotifyAgree
    setManageForm((prev) => ({ ...prev, emailNotifyAgree: next }))

    updateManage(
      {
        emailAgree: next,
      },
      {
        onSuccess: () => {
          manageSnapshotRef.current = {
            ...manageSnapshotRef.current,
            emailNotifyAgree: next,
          }
          setEmailErrorMessage(null)
        },
        onError: (error) => {
          setManageForm((prev) => ({ ...prev, emailNotifyAgree: previous }))
          setEmailErrorMessage(
            extractApiErrorMessage(
              error,
              '이메일 알림 설정 변경 중 오류가 발생했습니다.',
            ),
          )
        },
      },
    )
  }

  const handleToggleNotifications = (next: boolean) => {
    if (shouldConfirmNotificationOff(manageForm.emailNotifyAgree, next)) {
      setIsNotificationDialogOpen(true)
      return
    }

    updateEmailNotification(next)
  }

  const handleConfirmNotificationOff = () => {
    setIsNotificationDialogOpen(false)
    updateEmailNotification(false)
  }

  const handleCancelEmailEdit = () => {
    setManageForm((prev) => ({
      ...prev,
      subscriptionEmail: manageSnapshotRef.current.subscriptionEmail,
    }))
    setEmailErrorMessage(null)
  }

  const handleSaveEmail = () => {
    if (!showEmailActions || isUpdatingManage) return

    const normalizedEmail = manageForm.subscriptionEmail.trim()

    updateManage(
      {
        subscriptionEmail: normalizedEmail || undefined,
        emailAgree: manageForm.emailNotifyAgree,
      },
      {
        onSuccess: () => {
          const snapshot = {
            ...manageSnapshotRef.current,
            subscriptionEmail: normalizedEmail,
          }
          manageSnapshotRef.current = snapshot
          setManageForm((prev) => ({
            ...prev,
            subscriptionEmail: normalizedEmail,
          }))
          setEmailErrorMessage(null)
        },
        onError: (error) => {
          setEmailErrorMessage(
            extractApiErrorMessage(
              error,
              '이메일 저장 중 오류가 발생했습니다.',
            ),
          )
        },
      },
    )
  }

  return (
    <div className="min-h-screen w-full bg-light-color-2">
      <div
        className={cn(
          'max-w-[1100px] mx-auto px-5 pb-20',
          isDesktop ? 'pt-12' : 'pt-6',
        )}
      >
        {isDesktop ? (
          <div className="flex gap-6">
            <aside className="w-[216px] shrink-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div
                    className={cn(
                      'px-5 py-3 rounded-lg',
                      activeGroup === 'profile' && 'bg-white-color',
                    )}
                  >
                    <span className="typo-body-1-2-sb text-black-color">
                      프로필
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 px-5">
                    <button
                      type="button"
                      onClick={() => handleSelectSection('profile-basic')}
                      className={cn(
                        'text-left h-10 flex items-center',
                        section === 'profile-basic'
                          ? 'typo-body-3-b text-grey-color-5'
                          : 'typo-body-3-2-m text-grey-color-3',
                      )}
                    >
                      기본 정보
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    className={cn(
                      'px-5 py-3 rounded-lg',
                      activeGroup === 'settings' && 'bg-white-color',
                    )}
                  >
                    <span className="typo-body-1-2-sb text-black-color">
                      설정/관리
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 px-5">
                    <button
                      type="button"
                      onClick={() => handleSelectSection('settings-account')}
                      className={cn(
                        'text-left h-10 flex items-center',
                        section === 'settings-account'
                          ? 'typo-body-3-b text-grey-color-5'
                          : 'typo-body-3-2-m text-grey-color-3',
                      )}
                    >
                      계정 관리
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenWithdrawPage}
                      className="text-left h-10 flex items-center typo-body-3-2-m text-grey-color-3"
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {section === 'profile-basic' && (
                <BasicInfoSection
                  isDesktop
                  profile={profileData}
                  jobs={jobs}
                  nickname={profileForm.nickname}
                  selectedJobId={profileForm.jobId}
                  profileErrorMessage={profileErrorMessage}
                  tempImageUrl={tempImageUrl}
                  fileInputRef={fileInputRef}
                  isUploadingImage={isUploadingImage}
                  isUpdatingImage={isUpdatingImage}
                  isUpdatingProfile={isUpdatingProfile}
                  onNicknameChange={(value) => {
                    setProfileForm((prev) => ({ ...prev, nickname: value }))
                    setProfileErrorMessage(null)
                  }}
                  showNicknameActions={showNicknameActions}
                  onCancelNickname={handleCancelNicknameEdit}
                  onSaveNickname={handleSaveNickname}
                  onSelectJob={handleSelectJob}
                  onProfileImageSelect={handleProfileImageChange}
                />
              )}

              {section === 'settings-account' && (
                <AccountSection
                  isDesktop
                  name={manageForm.name}
                  subscriptionEmail={manageForm.subscriptionEmail}
                  emailNotifications={manageForm.emailNotifyAgree}
                  isUpdating={isUpdatingManage}
                  showEmailActions={showEmailActions}
                  emailErrorMessage={emailErrorMessage}
                  onChangeEmail={(value) => {
                    setManageForm((prev) => ({
                      ...prev,
                      subscriptionEmail: value,
                    }))
                    setEmailErrorMessage(null)
                  }}
                  onCancelEmail={handleCancelEmailEdit}
                  onSaveEmail={handleSaveEmail}
                  onToggleNotifications={handleToggleNotifications}
                  onLogout={logout}
                  onOpenWithdraw={handleOpenWithdrawPage}
                />
              )}
            </main>
          </div>
        ) : (
          <UnderLineTab
            value={activeGroup}
            onValueChange={(value) => {
              if (value === 'profile') {
                handleSelectSection('profile-basic')
                return
              }
              handleSelectSection('settings-account')
            }}
            tabs={[
              {
                value: 'profile',
                label: '프로필',
                content: (
                  <BasicInfoSection
                    isDesktop={false}
                    profile={profileData}
                    jobs={jobs}
                    nickname={profileForm.nickname}
                    selectedJobId={profileForm.jobId}
                    profileErrorMessage={profileErrorMessage}
                    tempImageUrl={tempImageUrl}
                    fileInputRef={fileInputRef}
                    isUploadingImage={isUploadingImage}
                    isUpdatingImage={isUpdatingImage}
                    isUpdatingProfile={isUpdatingProfile}
                    onNicknameChange={(value) => {
                      setProfileForm((prev) => ({ ...prev, nickname: value }))
                      setProfileErrorMessage(null)
                    }}
                    showNicknameActions={showNicknameActions}
                    onCancelNickname={handleCancelNicknameEdit}
                    onSaveNickname={handleSaveNickname}
                    onSelectJob={handleSelectJob}
                    onProfileImageSelect={handleProfileImageChange}
                  />
                ),
              },
              {
                value: 'settings',
                label: '설정/관리',
                content: (
                  <AccountSection
                    isDesktop={false}
                    name={manageForm.name}
                    subscriptionEmail={manageForm.subscriptionEmail}
                    emailNotifications={manageForm.emailNotifyAgree}
                    isUpdating={isUpdatingManage}
                    showEmailActions={showEmailActions}
                    emailErrorMessage={emailErrorMessage}
                    onChangeEmail={(value) => {
                      setManageForm((prev) => ({
                        ...prev,
                        subscriptionEmail: value,
                      }))
                      setEmailErrorMessage(null)
                    }}
                    onCancelEmail={handleCancelEmailEdit}
                    onSaveEmail={handleSaveEmail}
                    onToggleNotifications={handleToggleNotifications}
                    onLogout={logout}
                    onOpenWithdraw={handleOpenWithdrawPage}
                  />
                ),
              },
            ]}
          />
        )}
      </div>

      <NotificationOffConfirmDialog
        open={isNotificationDialogOpen}
        isDesktop={isDesktop}
        isPending={isUpdatingManage}
        onOpenChange={setIsNotificationDialogOpen}
        onConfirmTurnOff={handleConfirmNotificationOff}
      />
    </div>
  )
}
