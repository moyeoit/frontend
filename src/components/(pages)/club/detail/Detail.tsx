'use client'

import * as React from 'react'
import Image from 'next/image'
import MobileBookmarkEmptyIcon from '@/assets/icons/bookmark-mobile-empty.svg'
import MobileBookmarkFilledIcon from '@/assets/icons/bookmark-mobile-filled.svg'
import ClubDetailActivityReviewContent from '@/components/(pages)/club/detail/ClubDetailActivityReviewContent'
import ClubDetailBlogReviewContent from '@/components/(pages)/club/detail/ClubDetailBlogReviewContent'
import ClubDetailContent from '@/components/(pages)/club/detail/ClubDetailContent'
import ClubDetailDocumentInterviewContent from '@/components/(pages)/club/detail/ClubDetailDocumentInterviewContent'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import { EmailConfirmDialog } from '@/components/molecules/emailConfirmDialog/EmailConfirmDialog'
import { RecruitmentButtons } from '@/components/molecules/recruitmentButton'
import { useToggleClubSubscription } from '@/features/clubs/mutations'
import {
  useClubDetails,
  useClubRecruits,
  useUserSubscriptionCheck,
} from '@/features/clubs/queries'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

interface DetailProps {
  clubId: number
}

/**
 * 동아리 상세 페이지 (썸네일, 동아리명, 구독 버튼, 슬로건, 상세 내용, 후기, 모집 정보)
 */

export default function Detail({ clubId }: DetailProps) {
  const { data: recruitsData } = useClubRecruits(clubId)
  const { isDesktop } = useMediaQuery()

  const { data: clubDetails } = useClubDetails(Number(clubId))

  const toggleSubscriptionMutation = useToggleClubSubscription()

  // 구독 상태 확인
  const { data: subscriptionData } = useUserSubscriptionCheck(Number(clubId))
  const isSubscribed = subscriptionData?.subscribed ?? false

  // 이메일 확인 다이얼로그 상태
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false)

  const handleSubscribe = React.useCallback(async () => {
    try {
      await toggleSubscriptionMutation.mutateAsync(Number(clubId))
    } catch (error) {
      console.error('구독 실패:', error)
    }
  }, [clubId, toggleSubscriptionMutation])

  // 모집 정보 섹션 내용
  const recruitmentInfoContent = (
    <div className="w-full bg-light-color-2 px-8 py-6 rounded-2xl">
      {/* 모집 파트 */}
      <div className="flex gap-2 mb-3">
        <div className="w-18 typo-button-b">모집 파트</div>
        <div className="flex-1 typo-button-m text-grey-color-5">
          {recruitsData?.recruitmentPart?.join(', ')}
        </div>
      </div>

      {/* 자격 요건 */}
      <div className="flex gap-2 mb-3">
        <div className="w-18 typo-button-b">자격 요건</div>
        <div className="flex-1 typo-button-m text-grey-color-5">
          {recruitsData?.qualification}
        </div>
      </div>

      {/* 모집 일정 */}
      <div className="flex gap-2 mb-3">
        <div className="w-18 typo-button-b">모집 일정</div>
        <div className="flex-1 typo-button-m text-grey-color-5">
          {recruitsData?.recruitmentSchedule || '-'}
        </div>
      </div>

      {/* 활동 기간 */}
      <div className="flex gap-2 mb-3">
        <div className="w-18 typo-button-b">활동 기간</div>
        <div className="flex-1 typo-button-m text-grey-color-5">
          {recruitsData?.activityPeriod || '-'}
        </div>
      </div>

      {/* 활동 방식 */}
      <div className="flex gap-2 mb-3">
        <div className="w-18 typo-button-b">활동 방식</div>
        <div className="flex-1 typo-button-m text-grey-color-5">
          {recruitsData?.activityMethod || '-'}
        </div>
      </div>

      {/* 활동비 */}
      <div className="flex gap-2">
        <div className="w-18 typo-button-b">활동비</div>
        <div className="flex-1 typo-button-m text-grey-color-5">
          {recruitsData?.activityFee || '-'}
        </div>
      </div>
    </div>
  )

  // 버튼 섹션 내용
  const recruitmentButtonsContent = (
    <RecruitmentButtons
      homepageUrl={recruitsData?.homepageUrl}
      noticeUrl={recruitsData?.noticeUrl || undefined}
      isDesktop={isDesktop}
      onNoticeClick={() => setIsEmailDialogOpen(true)}
    />
  )

  return (
    <div
      className={cn(
        isDesktop
          ? 'flex justify-center py-36 w-full mx-auto max-w-[1440px]'
          : 'flex flex-col w-full mx-auto max-w-[1440px] py-4',
      )}
    >
      <div className={isDesktop ? 'w-180 max-w-[720px]' : 'w-full'}>
        {/* Detail 섹션 */}
        <div className="px-5">
          <div
            className={`relative w-full aspect-3/2 border border-light-color-3 rounded-lg overflow-hidden mb-12 ${isDesktop ? 'mb-6' : 'mb-4 px-5'}`}
          >
            <Image
              src={clubDetails?.club.imageUrl || '/images/default.svg'}
              alt={`${clubDetails?.club.name} 썸네일`}
              fill
              className="w-full h-full object-cover"
            />
          </div>

          {/* 동아리 정보 섹션 */}
          <div className={`relative ${isDesktop ? 'mb-12' : 'mb-4'}`}>
            {/* 로고, 동아리명, 구독 버튼 */}
            <div
              className={`flex items-center gap-4 ${isDesktop ? 'mb-6' : 'mb-4'}`}
            >
              {/* 로고 */}
              <div
                className={`${isDesktop ? 'w-14 h-14' : 'w-12 h-12'} border border-light-color-3 rounded-[16px] shrink-0`}
              >
                {clubDetails?.club.imageUrl && (
                  <Image
                    src={clubDetails?.club.imageUrl || '/images/default.svg'}
                    alt={clubDetails?.club.name || ''}
                    width={isDesktop ? 56 : 48}
                    height={isDesktop ? 56 : 48}
                    className="w-full h-full object-cover rounded-[16px]"
                  />
                )}
              </div>
              {/* 동아리명 */}
              <div className="flex-1">
                <div
                  className={`${isDesktop ? 'typo-title-1-3-m' : 'typo-title-3'}`}
                >
                  {clubDetails?.club.name}
                </div>
              </div>
              {/* 구독 버튼 */}
              <button
                onClick={handleSubscribe}
                className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none shrink-0"
                aria-label={isSubscribed ? '구독 해제' : '구독'}
              >
                {isSubscribed ? (
                  <MobileBookmarkFilledIcon className="w-6 h-6" />
                ) : (
                  <MobileBookmarkEmptyIcon className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* 슬로건 */}
            <div className="bg-light-color-2 rounded-2xl py-4 px-6">
              <div
                className={`text-center text-grey-color-4 ${isDesktop ? 'typo-body-3-2-m ' : 'typo-button-m'}`}
              >
                {clubDetails?.club.slogan}
              </div>
            </div>
          </div>
        </div>

        {/* 모바일: 모집 정보 섹션 */}
        {!isDesktop && (
          <div className={`${isDesktop ? 'mt-8 mb-12 ' : 'pb-8 mt-4 px-5'}`}>
            {recruitmentInfoContent}
          </div>
        )}

        <div className={isDesktop ? '' : '[&>div:first-child]:pl-5'}>
          <UnderLineTab
            defaultValue="상세 내용"
            tabs={[
              {
                value: '상세 내용',
                label: '상세 내용',
                content: <ClubDetailContent clubDetails={clubDetails} />,
              },
              {
                value: '활동 후기',
                label: '활동 후기',
                content: (
                  <ClubDetailActivityReviewContent
                    clubId={clubId}
                    clubDetails={clubDetails}
                    recruitsData={recruitsData || null}
                  />
                ),
              },
              {
                value: '서류/면접 후기',
                label: '서류/면접 후기',
                content: <ClubDetailDocumentInterviewContent clubId={clubId} />,
              },
              {
                value: '블로그 후기',
                label: '블로그 후기',
                content: <ClubDetailBlogReviewContent clubId={clubId} />,
              },
            ]}
          />
        </div>
      </div>
      {/* 데스크톱: 모집 정보 섹션 */}
      {isDesktop && (
        <div className="w-90 px-5 sticky top-5 self-start">
          {recruitmentInfoContent}
          {/* 버튼들 */}
          <div className="mt-4 space-y-2">
            <div className="space-y-2">{recruitmentButtonsContent}</div>
          </div>
        </div>
      )}

      {/* 모바일: 버튼들 */}
      {!isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 bg-white-color px-5 py-3 pb-5 ">
          <div className="flex flex-row gap-2">{recruitmentButtonsContent}</div>
        </div>
      )}

      {/* 이메일 확인 다이얼로그 */}
      <EmailConfirmDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />
    </div>
  )
}
