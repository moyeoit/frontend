'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileIcon } from '@/assets/icons'
import {
  ReviewListItem,
  type ReviewListItemData,
} from '@/components/(pages)/review/explore/ReviewCards'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import { CheckItem } from '@/components/atoms/checkItem'
import { Tag } from '@/components/atoms/tag'
import { CommunityCard } from '@/components/molecules/communityCard'
import { PaginationWithHook } from '@/components/molecules/pagination'
import {
  useBookmarkedActivityReviews,
  useBookmarkedInterviewReviews,
} from '@/features/bookmark'
import { useUploadFile } from '@/features/file'
import {
  useUpdateUserManage,
  useUpdateUserProfileImage,
  useUserManage,
  useUserPosts,
  useUserProfile,
} from '@/features/user'
import AppPath from '@/shared/configs/appPath'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'
import { useAuth } from '@/shared/providers/auth-provider'
import { cn } from '@/shared/utils/cn'
import { formatTimeAgo } from '@/shared/utils/dateFormat'

type SectionKey =
  | 'profile-basic'
  | 'profile-activity'
  | 'activity-review'
  | 'activity-community'
  | 'settings-account'

type ReviewFilter = 'DOCUMENT' | 'INTERVIEW' | 'ACTIVITY'
type CommunityTab = 'posts' | 'comments'

type CommunityItem = {
  id: number
  categoryName: string
  title: string
  excerpt: string
  authorNickname: string
  timeAgo: string
  views: number
  likes: number
  comments: number
  thumbnailUrl?: string
}

const SECTION_KEYS: SectionKey[] = [
  'profile-basic',
  'profile-activity',
  'activity-review',
  'activity-community',
  'settings-account',
]

const NAV_GROUPS = [
  {
    key: 'profile',
    label: '프로필',
    items: [
      { key: 'profile-basic' as SectionKey, label: '기본 정보' },
      { key: 'profile-activity' as SectionKey, label: '활동 경력' },
    ],
  },
  {
    key: 'activity',
    label: '활동내역',
    items: [
      { key: 'activity-review' as SectionKey, label: '후기 활동' },
      { key: 'activity-community' as SectionKey, label: '커뮤니티 활동' },
    ],
  },
  {
    key: 'settings',
    label: '설정/관리',
    items: [{ key: 'settings-account' as SectionKey, label: '계정 관리' }],
  },
] as const

const REVIEW_FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: 'DOCUMENT', label: '서류' },
  { value: 'INTERVIEW', label: '면접' },
  { value: 'ACTIVITY', label: '활동' },
]

const MOCK_COMMUNITY_COMMENTS: CommunityItem[] = [
  {
    id: 11,
    categoryName: '직장 생활',
    title: '댓글 내용이 여기에 들어갑니다.',
    excerpt:
      '댓글 미리보기 2줄로 넣어주세요. 실제 연결 시 서버 데이터를 매핑합니다.',
    authorNickname: '닉네임',
    timeAgo: '10분 전',
    views: 0,
    likes: 12,
    comments: 3,
    thumbnailUrl: '/images/default.svg',
  },
  {
    id: 12,
    categoryName: '직장 생활',
    title: '댓글 내용이 여기에 들어갑니다.',
    excerpt:
      '댓글 미리보기 2줄로 넣어주세요. 실제 연결 시 서버 데이터를 매핑합니다.',
    authorNickname: '닉네임',
    timeAgo: '10분 전',
    views: 0,
    likes: 12,
    comments: 3,
    thumbnailUrl: '/images/default.svg',
  },
]

const REVIEW_PAGE_SIZE = 4
const COMMUNITY_PAGE_SIZE = 4

const getReviewCategory = (category?: string): ReviewFilter | undefined => {
  if (!category) return undefined
  if (category.includes('서류')) return 'DOCUMENT'
  if (category.includes('면접')) return 'INTERVIEW'
  if (category.includes('활동')) return 'ACTIVITY'
  return undefined
}

export default function MyPage() {
  const router = useRouter()
  const { isDesktop } = useMediaQuery()
  const { logout, user, isLoading: isAuthLoading } = useAuth()
  const { data: profile } = useUserProfile()
  const profileData = profile ?? null
  const { data: manageInfo } = useUserManage()
  const { mutate: updateManage, isPending: isUpdatingManage } =
    useUpdateUserManage()
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile()
  const { mutate: updateProfileImage, isPending: isUpdating } =
    useUpdateUserProfileImage()

  const [sectionParam, setSectionParam] = useQueryState(
    'section',
    'profile-basic',
  )
  const section = SECTION_KEYS.includes(sectionParam as SectionKey)
    ? (sectionParam as SectionKey)
    : 'profile-basic'
  const activeGroup = section.split('-')[0]

  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('DOCUMENT')
  const [communityTab, setCommunityTab] = useState<CommunityTab>('posts')
  const [reviewPage, setReviewPage] = useState(1)
  const [communityPage, setCommunityPage] = useState(1)
  const [activityOngoing, setActivityOngoing] = useState(false)
  const [manageForm, setManageForm] = useState({
    name: '',
    subscriptionEmail: '',
    emailNotifyAgree: false,
  })
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [activityFileName, setActivityFileName] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const activityFileRef = useRef<HTMLInputElement | null>(null)
  const manageSnapshotRef = useRef(manageForm)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(AppPath.login())
    }
  }, [isAuthLoading, user, router])

  useEffect(() => {
    if (manageInfo) {
      const next = {
        name: manageInfo.name ?? '',
        subscriptionEmail: manageInfo.subscriptionEmail ?? '',
        emailNotifyAgree: manageInfo.emailNotifyAgree ?? false,
      }
      setManageForm(next)
      manageSnapshotRef.current = next
    }
  }, [manageInfo])

  useEffect(() => {
    setReviewPage(1)
  }, [reviewFilter])

  useEffect(() => {
    if (communityTab === 'posts') {
      setCommunityPage(1)
    }
  }, [communityTab])

  const reviewQueryParams = useMemo(
    () => ({ page: reviewPage - 1, size: REVIEW_PAGE_SIZE }),
    [reviewPage],
  )
  const { data: interviewReviewsData } =
    useBookmarkedInterviewReviews(reviewQueryParams)
  const { data: activityReviewsData } =
    useBookmarkedActivityReviews(reviewQueryParams)

  const reviewPageData =
    reviewFilter === 'ACTIVITY'
      ? activityReviewsData?.data
      : interviewReviewsData?.data
  const reviewSource = reviewPageData?.content ?? []
  const filteredReviewSource =
    reviewFilter === 'ACTIVITY'
      ? reviewSource
      : reviewSource.filter((review) => {
          const category = getReviewCategory(review.reviewCategory)
          return category ? category === reviewFilter : true
        })
  const filteredReviews = useMemo<ReviewListItemData[]>(
    () =>
      filteredReviewSource.map((review, index) => ({
        reviewId: review.reviewId ?? index,
        clubName: review.clubName,
        jobName: review.jobName,
        generation: review.generation,
        title: review.title,
        answerSummaries: review.answerSummaries ?? [],
        rate: review.rate ?? 0,
        likeCount: review.likeCount ?? 0,
        commentCount: review.commentCount ?? 0,
        category:
          reviewFilter === 'ACTIVITY'
            ? 'ACTIVITY'
            : (getReviewCategory(review.reviewCategory) ?? reviewFilter),
      })),
    [filteredReviewSource, reviewFilter],
  )
  const reviewTotalPages = Math.max(reviewPageData?.totalPages ?? 1, 1)

  const communityQueryParams = useMemo(
    () => ({
      page: communityPage - 1,
      size: COMMUNITY_PAGE_SIZE,
      sort: 'createdAt,desc',
    }),
    [communityPage],
  )
  const { data: communityPostsData } = useUserPosts(communityQueryParams)

  const communityPosts = useMemo<CommunityItem[]>(
    () =>
      (communityPostsData?.content ?? []).map((post) => ({
        id: post.postId,
        categoryName: post.categoryName,
        title: post.title,
        excerpt: post.excerpt,
        authorNickname: post.authorNickname,
        timeAgo: formatTimeAgo(post.createdAt),
        views: post.viewCount,
        likes: post.likeCount,
        comments: post.commentCount,
        thumbnailUrl: post.thumbnailUrl || '/images/default.svg',
      })),
    [communityPostsData],
  )

  const communityItems =
    communityTab === 'posts' ? communityPosts : MOCK_COMMUNITY_COMMENTS
  const communityTotalPages = Math.max(communityPostsData?.totalPages ?? 1, 1)

  const handleSelectSection = (next: SectionKey) => {
    setSectionParam(next)
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
          },
        )
      },
    })
  }

  const handleManageChange = (
    field: 'name' | 'subscriptionEmail' | 'emailNotifyAgree',
    value: string | boolean,
  ) => {
    setManageForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const commitManage = (override?: Partial<typeof manageForm>) => {
    if (isUpdatingManage) return
    const next = {
      ...manageForm,
      ...override,
    }
    const normalized = {
      name: next.name.trim(),
      subscriptionEmail: next.subscriptionEmail.trim(),
      emailNotifyAgree: next.emailNotifyAgree,
    }
    const snapshot = manageSnapshotRef.current

    if (
      snapshot.name === normalized.name &&
      snapshot.subscriptionEmail === normalized.subscriptionEmail &&
      snapshot.emailNotifyAgree === normalized.emailNotifyAgree
    ) {
      return
    }

    updateManage(
      {
        name: normalized.name || undefined,
        subscriptionEmail: normalized.subscriptionEmail || undefined,
        emailAgree: normalized.emailNotifyAgree,
      },
      {
        onSuccess: () => {
          manageSnapshotRef.current = normalized
          setManageForm(normalized)
        },
      },
    )
  }

  return (
    <div
      className={cn(
        'min-h-screen w-full',
        isDesktop ? 'bg-light-color-2' : 'bg-white-color',
      )}
    >
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
                {NAV_GROUPS.map((group) => {
                  const isGroupActive = activeGroup === group.key
                  return (
                    <div key={group.key} className="flex flex-col gap-2">
                      <div
                        className={cn(
                          'px-5 py-3 rounded-lg',
                          isGroupActive && 'bg-white-color',
                        )}
                      >
                        <span className="typo-body-1-2-sb text-black-color">
                          {group.label}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 px-5">
                        {group.items.map((item) => {
                          const isActive = section === item.key
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => handleSelectSection(item.key)}
                              className={cn(
                                'text-left h-10 flex items-center',
                                isActive
                                  ? 'typo-body-3-b text-grey-color-5'
                                  : 'typo-body-3-2-m text-grey-color-3',
                              )}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                      {group.key === 'settings' && (
                        <div className="px-5 pt-2">
                          <Button
                            variant="outlined-secondary"
                            size="small"
                            className="w-full justify-start"
                            onClick={logout}
                          >
                            로그아웃
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </aside>
            <main className="flex-1 min-w-0">
              {section === 'profile-basic' && (
                <BasicInfoSection
                  isDesktop
                  profile={profileData}
                  tempImageUrl={tempImageUrl}
                  fileInputRef={fileInputRef}
                  isUploading={isUploading}
                  isUpdating={isUpdating}
                  onProfileImageSelect={handleProfileImageChange}
                />
              )}
              {section === 'profile-activity' && (
                <ActivityCertificationSection
                  isDesktop
                  activityOngoing={activityOngoing}
                  onToggleOngoing={setActivityOngoing}
                  activityFileName={activityFileName}
                  activityFileRef={activityFileRef}
                  onSelectFile={(file) =>
                    setActivityFileName(file ? file.name : '')
                  }
                />
              )}
              {section === 'activity-review' && (
                <ReviewActivitySection
                  isDesktop
                  reviewFilter={reviewFilter}
                  onChangeFilter={setReviewFilter}
                  reviews={filteredReviews}
                  page={reviewPage}
                  totalPages={reviewTotalPages}
                  onPageChange={setReviewPage}
                />
              )}
              {section === 'activity-community' && (
                <CommunityActivitySection
                  isDesktop
                  communityTab={communityTab}
                  onChangeTab={setCommunityTab}
                  items={communityItems}
                  page={communityPage}
                  totalPages={communityTotalPages}
                  onPageChange={setCommunityPage}
                />
              )}
              {section === 'settings-account' && (
                <AccountSection
                  isDesktop
                  name={manageForm.name}
                  subscriptionEmail={manageForm.subscriptionEmail}
                  emailNotifications={manageForm.emailNotifyAgree}
                  isUpdating={isUpdatingManage}
                  onChangeName={(value) => handleManageChange('name', value)}
                  onChangeEmail={(value) =>
                    handleManageChange('subscriptionEmail', value)
                  }
                  onCommitManage={commitManage}
                  onToggleNotifications={(value) =>
                    handleManageChange('emailNotifyAgree', value)
                  }
                  onLogout={logout}
                />
              )}
            </main>
          </div>
        ) : (
          <MobileLayout
            profile={profileData}
            section={section}
            onChangeSection={handleSelectSection}
            reviewFilter={reviewFilter}
            onChangeReviewFilter={setReviewFilter}
            communityTab={communityTab}
            onChangeCommunityTab={setCommunityTab}
            reviews={filteredReviews}
            communityItems={communityItems}
            reviewPage={reviewPage}
            reviewTotalPages={reviewTotalPages}
            onChangeReviewPage={setReviewPage}
            communityPage={communityPage}
            communityTotalPages={communityTotalPages}
            onChangeCommunityPage={setCommunityPage}
            activityOngoing={activityOngoing}
            onToggleOngoing={setActivityOngoing}
            activityFileName={activityFileName}
            activityFileRef={activityFileRef}
            onSelectFile={(file) => setActivityFileName(file ? file.name : '')}
            tempImageUrl={tempImageUrl}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            isUpdating={isUpdating}
            onProfileImageSelect={handleProfileImageChange}
            manageForm={manageForm}
            isUpdatingManage={isUpdatingManage}
            onManageChange={handleManageChange}
            onCommitManage={commitManage}
            onLogout={logout}
          />
        )}
      </div>
    </div>
  )
}

function SectionShell({
  title,
  description,
  isDesktop,
  children,
  className,
  bodyClassName,
}: {
  title: string
  description?: string
  isDesktop: boolean
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={cn('bg-white-color rounded-2xl', className)}>
      <div
        className={cn(
          'border-b border-light-color-2',
          isDesktop ? 'px-[30px] py-[24px]' : 'px-5 py-6',
        )}
      >
        <div className="flex flex-col gap-1">
          <h2 className="typo-body-1-2-sb text-black-color">{title}</h2>
          {description && (
            <p
              className={cn(
                isDesktop ? 'typo-caption-2' : 'typo-caption-1',
                'text-grey-color-1',
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div
        className={cn(
          isDesktop ? 'px-[30px] py-[40px]' : 'px-5 py-6',
          bodyClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

function FormRow({
  label,
  isDesktop,
  children,
  alignTop = false,
}: {
  label: string
  isDesktop: boolean
  children: React.ReactNode
  alignTop?: boolean
}) {
  return (
    <div
      className={cn(
        'flex',
        isDesktop ? 'gap-12' : 'flex-col gap-2',
        alignTop ? 'items-start' : 'items-center',
      )}
    >
      <p
        className={cn(
          'typo-body-3-b text-black-color',
          isDesktop ? 'w-[220px]' : 'w-full',
        )}
      >
        {label}
      </p>
      <div className={cn(isDesktop ? 'flex-1' : 'w-full')}>{children}</div>
    </div>
  )
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-[26px] px-4 rounded-[100px] border text-center',
        active
          ? 'bg-main-color-3 border-main-color-1 text-main-color-1'
          : 'border-light-color-3 text-grey-color-4',
      )}
    >
      <span className="typo-caption-1">{children}</span>
    </button>
  )
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex items-center w-[39px] h-[20px] rounded-full transition-colors',
        checked ? 'bg-main-color-1' : 'bg-light-color-3',
      )}
    >
      <span
        className={cn(
          'absolute size-[16px] rounded-full bg-white-color transition-transform',
          checked ? 'translate-x-[19px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}

function BasicInfoSection({
  isDesktop,
  profile,
  tempImageUrl,
  fileInputRef,
  isUploading,
  isUpdating,
  onProfileImageSelect,
}: {
  isDesktop: boolean
  profile: {
    name?: string
    nickname?: string
    jobDto?: { name?: string }
    job?: { name?: string }
    active?: boolean
    profileImageUrl?: string
  } | null
  tempImageUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isUploading: boolean
  isUpdating: boolean
  onProfileImageSelect: (file?: File) => void
}) {
  const isBusy = isUploading || isUpdating
  const imageSrc = tempImageUrl || profile?.profileImageUrl

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
                isDesktop ? 'w-[130px] h-[121px]' : 'w-[120px] h-[120px]',
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
                <div className="w-full h-full animate-pulse bg-light-color-2 flex items-center justify-center">
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
        <div className={cn('flex flex-col', isDesktop ? 'gap-8' : 'gap-5')}>
          <FormRow label="닉네임" isDesktop={isDesktop}>
            <Input
              value={profile?.nickname ?? ''}
              placeholder="닉네임"
              readOnly
              className="h-[47px]"
            />
          </FormRow>
          <FormRow label="분야" isDesktop={isDesktop}>
            <Input
              value={profile?.jobDto?.name ?? profile?.job?.name ?? ''}
              placeholder="분야"
              readOnly
              className="h-[47px]"
            />
          </FormRow>
          <FormRow label="상태" isDesktop={isDesktop}>
            <Input
              value={profile ? (profile.active ? '활성' : '비활성') : ''}
              placeholder="현재 상태를 선택해주세요"
              readOnly
              className="h-[47px]"
            />
          </FormRow>
        </div>
      </div>
    </SectionShell>
  )
}

function ActivityCertificationSection({
  isDesktop,
  activityOngoing,
  onToggleOngoing,
  activityFileName,
  activityFileRef,
  onSelectFile,
}: {
  isDesktop: boolean
  activityOngoing: boolean
  onToggleOngoing: (next: boolean) => void
  activityFileName: string
  activityFileRef: React.RefObject<HTMLInputElement | null>
  onSelectFile: (file?: File) => void
}) {
  return (
    <SectionShell
      title="활동 인증하기"
      description="참여했던 활동이나 동아리를 모두 입력하고, 새로운 IT 경험을 시작해보세요"
      isDesktop={isDesktop}
    >
      <div className={cn('flex flex-col', isDesktop ? 'gap-10' : 'gap-6')}>
        <FormRow label="활동 기본 정보" isDesktop={isDesktop} alignTop>
          <div className="flex flex-col gap-4 w-full">
            <Input placeholder="동아리명" className="h-[47px]" />
            <div className="flex gap-2">
              <Input placeholder="기수" className="h-[47px]" />
              <Input placeholder="직군" className="h-[47px]" />
            </div>
          </div>
        </FormRow>
        <FormRow label="기간" isDesktop={isDesktop} alignTop>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <Input placeholder="yyyy.mm" className="h-[47px]" />
              <Input placeholder="yyyy.mm" className="h-[47px]" />
            </div>
            <div className="flex items-center gap-2">
              <CheckItem
                label={
                  <span className="typo-caption-2 text-grey-color-3">
                    활동 중
                  </span>
                }
                checked={activityOngoing}
                onChange={onToggleOngoing}
              />
            </div>
          </div>
        </FormRow>
        <FormRow label="인증하기" isDesktop={isDesktop} alignTop>
          <div className="flex flex-col gap-2 w-full">
            <input
              ref={activityFileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) => onSelectFile(event.target.files?.[0])}
            />
            <Input
              value={activityFileName}
              placeholder="인증할 서류를 PDF로 업로드해주세요"
              readOnly
              onClick={() => activityFileRef.current?.click()}
              className="bg-light-color-2 cursor-pointer h-[47px]"
            />
            <p className="typo-caption-2 text-grey-color-1">
              내부 인증 절차 이후 뱃지가 부여됩니다
            </p>
          </div>
        </FormRow>
      </div>
    </SectionShell>
  )
}

function ReviewActivitySection({
  isDesktop,
  reviewFilter,
  onChangeFilter,
  reviews,
  page,
  totalPages,
  onPageChange,
}: {
  isDesktop: boolean
  reviewFilter: ReviewFilter
  onChangeFilter: (value: ReviewFilter) => void
  reviews: ReviewListItemData[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <SectionShell
      title="후기 활동"
      description="모여잇 내 맞춤 콘텐츠 및 후기 정보의 기본 데이터로 활용됩니다"
      isDesktop={isDesktop}
      bodyClassName="pt-4"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          {REVIEW_FILTERS.map((filter) => (
            <FilterPill
              key={filter.value}
              active={reviewFilter === filter.value}
              onClick={() => onChangeFilter(filter.value)}
            >
              {filter.label}
            </FilterPill>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewListItem
              key={review.reviewId}
              review={review}
              isDesktop={isDesktop}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pt-6">
            <PaginationWithHook
              key={reviewFilter}
              totalPages={totalPages}
              initialPage={page}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </SectionShell>
  )
}

function CommunityActivitySection({
  isDesktop,
  communityTab,
  onChangeTab,
  items,
  page,
  totalPages,
  onPageChange,
}: {
  isDesktop: boolean
  communityTab: CommunityTab
  onChangeTab: (value: CommunityTab) => void
  items: CommunityItem[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <SectionShell
      title="커뮤니티 활동"
      description="모여잇 내 맞춤 콘텐츠 및 후기 정보의 기본 데이터로 활용됩니다"
      isDesktop={isDesktop}
      bodyClassName="pt-4"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <FilterPill
            active={communityTab === 'posts'}
            onClick={() => onChangeTab('posts')}
          >
            게시물
          </FilterPill>
          <FilterPill
            active={communityTab === 'comments'}
            onClick={() => onChangeTab('comments')}
          >
            댓글
          </FilterPill>
        </div>
        <div className="flex flex-col">
          {items.map((post) => (
            <CommunityCard
              key={post.id}
              type="horizontal"
              className={cn(
                'gap-6 pt-8 group cursor-pointer',
                isDesktop ? 'gap-6' : 'gap-4',
              )}
            >
              <CommunityCard.Content className="max-w-[656px] flex-col">
                <div className="flex flex-row gap-[5px] mb-2">
                  <Tag
                    label={post.categoryName}
                    kind="blogReview"
                    size={isDesktop ? 'large' : 'small'}
                    className="shrink-0"
                  />
                  <Tag
                    label="인기"
                    kind="clubDetail"
                    size={isDesktop ? 'large' : 'small'}
                    color="lightPurple"
                    className="shrink-0"
                  />
                </div>
                <CommunityCard.Title>{post.title}</CommunityCard.Title>
                <CommunityCard.Description>
                  {post.excerpt}
                </CommunityCard.Description>
                <CommunityCard.Meta
                  nickname={post.authorNickname}
                  timeAgo={post.timeAgo}
                  views={post.views}
                  likes={post.likes}
                  comments={post.comments}
                  className="mt-4"
                />
              </CommunityCard.Content>
              <CommunityCard.Image
                logoUrl={post.thumbnailUrl ?? '/images/default.svg'}
                alt={post.title}
              />
            </CommunityCard>
          ))}
        </div>
        {communityTab === 'posts' && totalPages > 1 && (
          <div className="pt-6">
            <PaginationWithHook
              totalPages={totalPages}
              initialPage={page}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </SectionShell>
  )
}

function AccountSection({
  isDesktop,
  name,
  subscriptionEmail,
  emailNotifications,
  isUpdating,
  onChangeName,
  onChangeEmail,
  onCommitManage,
  onToggleNotifications,
  onLogout,
}: {
  isDesktop: boolean
  name: string
  subscriptionEmail: string
  emailNotifications: boolean
  isUpdating: boolean
  onChangeName: (value: string) => void
  onChangeEmail: (value: string) => void
  onCommitManage: (override?: {
    name?: string
    subscriptionEmail?: string
    emailNotifyAgree?: boolean
  }) => void
  onToggleNotifications: (next: boolean) => void
  onLogout: () => void
}) {
  return (
    <SectionShell title="계정 관리" isDesktop={isDesktop}>
      <div className="flex flex-col gap-8">
        <FormRow label="이름" isDesktop={isDesktop}>
          <Input
            value={name}
            placeholder="이름"
            disabled={isUpdating}
            onChange={(event) => onChangeName(event.target.value)}
            onBlur={() => onCommitManage()}
            className="h-[47px]"
          />
        </FormRow>
        <FormRow label="소식받을 이메일" isDesktop={isDesktop}>
          <div className="flex flex-col gap-2">
            <Input
              value={subscriptionEmail}
              placeholder="000@moyeoit.com"
              disabled={isUpdating}
              onChange={(event) => onChangeEmail(event.target.value)}
              onBlur={() => onCommitManage()}
              className="h-[47px]"
            />
            <p className="typo-caption-2 text-grey-color-1">
              소식 받을 이메일 입력 전까지는 가입했던 소셜 이메일로 알림 전송
            </p>
          </div>
        </FormRow>
        <FormRow label="이메일 알림 여부" isDesktop={isDesktop}>
          <ToggleSwitch
            checked={emailNotifications}
            onChange={(next) => {
              onToggleNotifications(next)
              onCommitManage({ emailNotifyAgree: next })
            }}
          />
        </FormRow>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="h-[27px] px-4 rounded-[100px] bg-light-color-3 text-white-color typo-caption-1"
          >
            회원 탈퇴
          </button>
          <Button
            variant="none"
            className="h-[27px] px-4 rounded-[100px] bg-light-color-3 text-white-color typo-caption-1"
            onClick={onLogout}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </SectionShell>
  )
}

function MobileLayout({
  profile,
  section,
  onChangeSection,
  reviewFilter,
  onChangeReviewFilter,
  communityTab,
  onChangeCommunityTab,
  reviews,
  communityItems,
  reviewPage,
  reviewTotalPages,
  onChangeReviewPage,
  communityPage,
  communityTotalPages,
  onChangeCommunityPage,
  activityOngoing,
  onToggleOngoing,
  activityFileName,
  activityFileRef,
  onSelectFile,
  tempImageUrl,
  fileInputRef,
  isUploading,
  isUpdating,
  onProfileImageSelect,
  manageForm,
  isUpdatingManage,
  onManageChange,
  onCommitManage,
  onLogout,
}: {
  profile: {
    name?: string
    nickname?: string
    jobDto?: { name?: string }
    job?: { name?: string }
    active?: boolean
    profileImageUrl?: string
  } | null
  section: SectionKey
  onChangeSection: (section: SectionKey) => void
  reviewFilter: ReviewFilter
  onChangeReviewFilter: (value: ReviewFilter) => void
  communityTab: CommunityTab
  onChangeCommunityTab: (value: CommunityTab) => void
  reviews: ReviewListItemData[]
  communityItems: CommunityItem[]
  reviewPage: number
  reviewTotalPages: number
  onChangeReviewPage: (page: number) => void
  communityPage: number
  communityTotalPages: number
  onChangeCommunityPage: (page: number) => void
  activityOngoing: boolean
  onToggleOngoing: (next: boolean) => void
  activityFileName: string
  activityFileRef: React.RefObject<HTMLInputElement | null>
  onSelectFile: (file?: File) => void
  tempImageUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isUploading: boolean
  isUpdating: boolean
  onProfileImageSelect: (file?: File) => void
  manageForm: {
    name: string
    subscriptionEmail: string
    emailNotifyAgree: boolean
  }
  isUpdatingManage: boolean
  onManageChange: (
    field: 'name' | 'subscriptionEmail' | 'emailNotifyAgree',
    value: string | boolean,
  ) => void
  onCommitManage: (override?: {
    name?: string
    subscriptionEmail?: string
    emailNotifyAgree?: boolean
  }) => void
  onLogout: () => void
}) {
  const activeGroup = section.split('-')[0]

  const tabs = [
    {
      value: 'profile',
      label: '프로필',
      content: (
        <div className="flex flex-col gap-6">
          <BasicInfoSection
            isDesktop={false}
            profile={profile}
            tempImageUrl={tempImageUrl}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
            isUpdating={isUpdating}
            onProfileImageSelect={onProfileImageSelect}
          />
          <ActivityCertificationSection
            isDesktop={false}
            activityOngoing={activityOngoing}
            onToggleOngoing={onToggleOngoing}
            activityFileName={activityFileName}
            activityFileRef={activityFileRef}
            onSelectFile={onSelectFile}
          />
        </div>
      ),
    },
    {
      value: 'activity',
      label: '활동 내역',
      content: (
        <div className="flex flex-col gap-6">
          <ReviewActivitySection
            isDesktop={false}
            reviewFilter={reviewFilter}
            onChangeFilter={onChangeReviewFilter}
            reviews={reviews}
            page={reviewPage}
            totalPages={reviewTotalPages}
            onPageChange={onChangeReviewPage}
          />
          <CommunityActivitySection
            isDesktop={false}
            communityTab={communityTab}
            onChangeTab={onChangeCommunityTab}
            items={communityItems}
            page={communityPage}
            totalPages={communityTotalPages}
            onPageChange={onChangeCommunityPage}
          />
        </div>
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
          onChangeName={(value) => onManageChange('name', value)}
          onChangeEmail={(value) => onManageChange('subscriptionEmail', value)}
          onCommitManage={onCommitManage}
          onToggleNotifications={(value) =>
            onManageChange('emailNotifyAgree', value)
          }
          onLogout={onLogout}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <UnderLineTab
        tabs={tabs}
        value={activeGroup}
        onValueChange={(value) => {
          if (value === 'profile') onChangeSection('profile-basic')
          if (value === 'activity') onChangeSection('activity-review')
          if (value === 'settings') onChangeSection('settings-account')
        }}
      />
    </div>
  )
}
