import React from 'react'
import { ProfileIcon } from '@/assets/icons'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select/Select'
import { JobItem } from '@/features/jobs'
import { NullableUserProfile } from '../types'
import { FormRow, SectionShell } from './SectionPrimitives'
import { cn } from '@/shared/utils/cn'

interface BasicInfoSectionProps {
  isDesktop: boolean
  profile: NullableUserProfile
  jobs: JobItem[]
  nickname: string
  selectedJobId?: number
  profileErrorMessage: string | null
  tempImageUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isUploadingImage: boolean
  isUpdatingImage: boolean
  isUpdatingProfile: boolean
  onNicknameChange: (value: string) => void
  onNicknameBlur: () => void
  onSelectJob: (jobId: number) => void
  onProfileImageSelect: (file?: File) => void
}

export function BasicInfoSection({
  isDesktop,
  profile,
  jobs,
  nickname,
  selectedJobId,
  profileErrorMessage,
  tempImageUrl,
  fileInputRef,
  isUploadingImage,
  isUpdatingImage,
  isUpdatingProfile,
  onNicknameChange,
  onNicknameBlur,
  onSelectJob,
  onProfileImageSelect,
}: BasicInfoSectionProps) {
  const isBusy = isUploadingImage || isUpdatingImage
  const imageSrc = tempImageUrl || profile?.profileImageUrl
  const jobValue = typeof selectedJobId === 'number' ? String(selectedJobId) : ''

  return (
    <SectionShell
      title="기본 정보"
      description="모여잇 내 맞춤 콘텐츠 및 후기 정보의 기본 데이터로 활용됩니다"
      isDesktop={isDesktop}
    >
      <div className={cn('flex flex-col', isDesktop ? 'gap-8' : 'gap-6')}>
        <FormRow label="프로필 사진" isDesktop={isDesktop} alignTop>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'border border-light-color-3 rounded-2xl overflow-hidden flex items-center justify-center bg-light-color-2',
                isDesktop ? 'w-[130px] h-[121px]' : 'w-[130px] h-[121px]',
              )}
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-light-color-2 flex items-center justify-center">
                  <ProfileIcon width={32} height={32} />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                onProfileImageSelect(event.target.files?.[0])
              }
            />
            <Button
              variant="outlined-primary"
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              {isBusy ? '변경중...' : '변경'}
            </Button>
          </div>
        </FormRow>

        <div className={cn('flex flex-col', isDesktop ? 'gap-8' : 'gap-6')}>
          <FormRow label="닉네임" isDesktop={isDesktop}>
            <Input
              value={nickname}
              placeholder="닉네임"
              disabled={isUpdatingProfile}
              onChange={(event) => onNicknameChange(event.target.value)}
              onBlur={onNicknameBlur}
              className="h-[47px]"
              maxLength={10}
            />
          </FormRow>

          <FormRow label="분야" isDesktop={isDesktop}>
            <Select
              value={jobValue || undefined}
              onValueChange={(value) => {
                const next = Number(value)
                if (Number.isFinite(next)) {
                  onSelectJob(next)
                }
              }}
              disabled={isUpdatingProfile}
            >
              <SelectTrigger className="h-[47px]" aria-label="분야 선택">
                <SelectValue placeholder="분야 선택" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>

          {profileErrorMessage && (
            <p className="typo-caption-1 text-failure-color -mt-2">
              {profileErrorMessage}
            </p>
          )}
        </div>
      </div>
    </SectionShell>
  )
}
