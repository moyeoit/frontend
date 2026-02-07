'use client'

import * as React from 'react'
import { Bell } from 'lucide-react'
import Image from 'next/image'
import BasicReview from '@/components/(pages)/club/basicReview/BasicReview'
import PremiumReview from '@/components/(pages)/club/premiumReview/PremiumReview'
import { Tag } from '@/components/atoms'
import { SubscriptionButton } from '@/components/atoms/SubscriptionButton'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import { Card } from '@/components/molecules/card'
import { RecruitmentButtons } from '@/components/molecules/recruitmentButton'
import { useToggleClubSubscription } from '@/features/clubs/mutations'
import {
  useClubDetails,
  useClubRecruits,
  useUserSubscriptionCheck,
} from '@/features/clubs/queries'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

interface DetailProps {
  clubId: number
}

/**
 * 동아리 상세 페이지 (썸네일, 동아리명, 구독 버튼, 슬로건, 상세 내용, 후기, 모집 정보)
 */

// URL 유효성 검사 함수 (삭제예정)
function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export default function Detail({ clubId }: DetailProps) {
  const { data: recruitsData } = useClubRecruits(clubId)
  const { isDesktop } = useMediaQuery()

  const {
    data: clubDetails,
    isLoading: isClubLoading,
    error,
  } = useClubDetails(Number(clubId))

  const toggleSubscriptionMutation = useToggleClubSubscription()

  // 구독 상태 확인
  const { data: subscriptionData, isLoading: isSubscriptionLoading } =
    useUserSubscriptionCheck(Number(clubId))
  const isSubscribed = subscriptionData?.subscribed ?? false

  const isLoading = isClubLoading || isSubscriptionLoading

  const handleSubscribe = React.useCallback(async () => {
    try {
      await toggleSubscriptionMutation.mutateAsync(Number(clubId))
    } catch (error) {
      console.error('구독 실패:', error)
    }
  }, [clubId, toggleSubscriptionMutation])

  if (isLoading) {
    return (
      <div className="flex justify-center w-full mx-auto max-w-[1440px]">
        <div className="w-180 max-w-[720px] px-5">
          <div className="text-center py-20">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (error || !clubDetails) {
    return (
      <div className="flex justify-center w-full mx-auto max-w-[1440px]">
        <div className="w-180 max-w-[720px] px-5">
          <div className="text-center py-20 text-red-500">
            데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      </div>
    )
  }

  // 상세 내용 컴포넌트 렌더링 함수
  const renderDetailContent = () => (
    <div className="mt-12 w-full">
      {/* 동아리 소개  */}
      {clubDetails.club.bio && (
        <div className="mb-20">
          <div className="typo-title-3 mb-4">동아리 소개</div>
          <div className="typo-body-3-3-r">{clubDetails.club.bio}</div>
        </div>
      )}

      {/* 히스토리 */}
      {(clubDetails.club.slogan ||
        clubDetails.club.establishment ||
        clubDetails.club.totalParticipant ||
        clubDetails.club.operation) && (
        <div className="mb-20">
          <div className="typo-title-3 mb-4">히스토리</div>
          {clubDetails.club.slogan && (
            <div className="mb-4 typo-body-3-3-r">
              {clubDetails.club.slogan}
            </div>
          )}
          <div className="flex flex-row gap-4 mb-20">
            {clubDetails.club.establishment && (
              <div className="flex flex-col justify-center items-center w-full px-12 py-6 bg-white rounded-[16px]">
                <div className="typo-caption-m">설립 연도</div>
                <div className="typo-body-1-b">
                  {clubDetails.club.establishment}년
                </div>
              </div>
            )}
            {clubDetails.club.totalParticipant && (
              <div className="flex flex-col justify-center items-center w-full px-12 py-6 bg-white rounded-[16px]">
                <div className="typo-caption-m">총 참가자 수</div>
                <div className="typo-body-1-b">
                  {clubDetails.club.totalParticipant}명
                </div>
              </div>
            )}
            {clubDetails.club.operation && (
              <div className="flex flex-col justify-center items-center w-full px-12 py-6 bg-white rounded-[16px]">
                <div className="typo-caption-m">운영 기수</div>
                <div className="typo-body-1-b">
                  {clubDetails.club.operation}기
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 주요 활동 내용 */}
      {clubDetails.activities && clubDetails.activities.length > 0 && (
        <div className="mb-20">
          <div className="typo-title-3 mb-4">주요 활동 내용</div>
          <div className="flex flex-col gap-8">
            {clubDetails.activities.map((activity, index) => (
              <Card
                key={activity.activityOrder || index}
                size="col3Desktop"
                orientation="horizontal"
                className="h-37"
              >
                <Card.Image
                  logoUrl={activity.imageUrl}
                  alt={`${activity.activityName} 이미지`}
                  className="w-56 h-37 mr-4"
                />
                <Card.Content className="py-2 h-37">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="typo-button-m text-main-color-1">
                      {activity.hashtag}
                    </span>
                  </div>
                  <Card.Title className="typo-body-1-b mb-2">
                    {activity.activityName}
                  </Card.Title>
                  <Card.Description className="typo-body-3-3-r text-black-color line-clamp-4">
                    {activity.activityDescribe}
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 활동 방식 */}
      {(clubDetails.club.offline || clubDetails.club.online) && (
        <div className="mb-20">
          <div className="typo-title-3 mb-4">활동 방식</div>
          <div>
            {clubDetails.club.offline && (
              <div className="mb-6 flex items-center">
                <Tag
                  kind="clubDetail"
                  size="none"
                  color="white"
                  label="오프라인"
                  className="w-20 h-8 px-3 py-1 mr-4 rounded-full typo-body-3-b"
                />
                <div className="typo-body-3-3-r">
                  {clubDetails.club.offline}
                </div>
              </div>
            )}
            {clubDetails.club.online && (
              <div className="mb-6 flex items-center">
                <Tag
                  kind="clubDetail"
                  size="none"
                  color="white"
                  label="온라인"
                  className="w-20 h-8 px-3 py-1 mr-4 rounded-full typo-body-3-b"
                />
                <div className="typo-body-3-3-r">{clubDetails.club.online}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 활동 일정 */}
      {clubDetails.clubSchedules && clubDetails.clubSchedules.length > 0 && (
        <div className="mb-20">
          <div className="typo-title-3 mb-4">활동 일정</div>
          <div>
            {clubDetails.clubSchedules.map((schedule, index) => (
              <div key={index} className="mb-6 flex items-center">
                <Tag
                  kind="clubDetail"
                  size="none"
                  color={schedule.period === '공통' ? 'purple' : 'lightPurple'}
                  label={`${schedule.periodValue}주차`}
                  className="min-w-[64px] w-fit h-8 px-3 py-1 mr-4 rounded-full typo-body-3-b"
                />
                <div className="typo-body-3-3-r">{schedule.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 활동 장소  */}
      {(clubDetails.club.location || clubDetails.club.address) && (
        <div className="mb-20">
          <div className="typo-title-3 mb-4">활동 장소</div>
          <div className="mb-4 typo-body-3-3-r">
            {clubDetails.club.significant}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col w-full bg-white rounded-[16px] px-8 py-4 gap-1">
              {clubDetails.club.location && (
                <div className="flex items-center">
                  <div className="typo-button-b mr-4">장소</div>
                  <div className="typo-button-m">
                    {clubDetails.club.location}
                  </div>
                </div>
              )}
              {clubDetails.club.address && (
                <div className="flex items-center">
                  <div className="typo-button-b mr-4">주소</div>
                  <div className="typo-button-m">
                    {clubDetails.club.address}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 지원 과정 */}
      {clubDetails.club.process && clubDetails.club.process.length > 0 && (
        <div className="mb-36">
          <div className="typo-title-3 mb-4">지원 과정</div>
          {clubDetails.club.process.map((processStep, index) => (
            <div key={index} className="mb-6 flex items-center">
              <Tag
                kind="clubDetail"
                size="none"
                color="white"
                label={`${index + 1}차`}
                className="w-16 h-8 px-3 py-1 mr-4 rounded-full typo-body-3-b"
              />
              <div className="typo-body-3-3-r">{processStep}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex justify-center py-15 w-full mx-auto max-w-[1440px]">
      <div className="w-180 max-w-[720px]">
        {/* Detail 섹션 */}
        <div className="px-5">
          <div className="relative w-full aspect-[3/2] border border-light-color-3 rounded-lg overflow-hidden mb-12">
            <Image
              src={
                isValidUrl(clubDetails.club.imageUrl)
                  ? clubDetails.club.imageUrl!
                  : '/images/default.svg'
              }
              alt={`${clubDetails.club.name} 썸네일`}
              fill
              className="w-full h-full object-cover"
            />
          </div>

          {/* 동아리 정보 섹션 */}
          <div className="mb-12">
            {/* 로고, 동아리명, 구독 버튼 */}
            <div className="flex items-center gap-4 mb-6">
              {/* 로고 */}
              <div className="w-16 h-16 border border-light-color-3 rounded-[16px] shrink-0">
                {isValidUrl(clubDetails.club.imageUrl) && (
                  <Image
                    src={clubDetails.club.imageUrl!}
                    alt={clubDetails.club.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-[16px]"
                  />
                )}
              </div>
              {/* 동아리명 */}
              <div className="flex-1">
                <div className="typo-title-1">{clubDetails.club.name}</div>
              </div>
              {/* 구독 버튼 */}
              <SubscriptionButton
                icon={<Bell size={20} />}
                isSubscribed={isSubscribed}
                onClick={handleSubscribe}
              />
            </div>

            {/* 슬로건 */}
            <div className="bg-white rounded-[16px] py-4">
              <div className="text-center typo-body-3-2-m text-grey-color-4">
                {clubDetails.club.slogan}
              </div>
            </div>
          </div>
        </div>
        <UnderLineTab
          className="px-5"
          defaultValue="상세 내용"
          tabs={[
            {
              value: '상세 내용',
              label: '상세 내용',
              content: renderDetailContent(),
            },
            {
              value: '일반 후기',
              label: '일반 후기',
              content: (
                <BasicReview
                  recruitsData={recruitsData || null}
                  clubId={clubId}
                />
              ),
            },
            {
              value: '프리미엄 후기',
              label: '프리미엄 후기',
              content: (
                <PremiumReview
                  recruitsData={recruitsData || null}
                  clubId={clubId}
                />
              ),
            },
          ]}
        />
      </div>
      <div className="w-80 px-5 top-15">
        {/* 위 */}
        <div className="bg-light-color-2 px-8 py-6 rounded-2xl">
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

        {/* 아래 - 버튼들 */}
        <div
          className={
            isDesktop
              ? 'mt-4 space-y-2'
              : 'fixed bottom-0 left-0 right-0 bg-white-color px-5 py-3 pb-5'
          }
        >
          <div className={isDesktop ? 'space-y-2' : 'flex flex-row gap-2'}>
            <RecruitmentButtons
              homepageUrl={recruitsData?.homepageUrl}
              noticeUrl={recruitsData?.noticeUrl || undefined}
              isDesktop={isDesktop}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
