'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BellFilledIcon, BellIcon } from '@/assets/icons'
import { ClubAlertEmailDialog } from '@/components/(pages)/club/detail/components/ClubAlertEmailDialog'
import {
  buildClubDetailEmailPromptKey,
  resolveClubDetailPromptOnAlertClick,
} from '@/components/(pages)/club/detail/utils'
import { Button } from '@/components/atoms/Button/button'
import { useToggleClubSubscription } from '@/features/clubs/mutations'
import {
  useClubDetails,
  useUserSubscriptionCheck,
} from '@/features/clubs/queries'
import AppPath from '@/shared/configs/appPath'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { useAuth } from '@/shared/providers/auth-provider'
import { tokenCookies } from '@/shared/utils/cookies'

interface DetailProps {
  clubId: number
}

export default function Detail({ clubId }: DetailProps) {
  const router = useRouter()
  const { isDesktop } = useMediaQuery()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { data: clubDetails } = useClubDetails(Number(clubId))
  const { data: subscriptionData } = useUserSubscriptionCheck(Number(clubId))
  const toggleSubscriptionMutation = useToggleClubSubscription()

  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false)
  const isSubscribed = subscriptionData?.subscribed ?? false

  const promptUserId = React.useMemo(() => {
    if (user?.id) {
      return String(user.id)
    }

    return tokenCookies.getUserId()
  }, [user?.id])

  const promptSeenKey = React.useMemo(() => {
    if (!promptUserId) return null
    return buildClubDetailEmailPromptKey(promptUserId)
  }, [promptUserId])

  const handleOpenHomepage = React.useCallback(() => {
    if (!clubDetails?.homepageUrl) return

    window.open(clubDetails.homepageUrl, '_blank', 'noopener,noreferrer')
  }, [clubDetails?.homepageUrl])

  const handleConfirmSubscription = React.useCallback(async () => {
    try {
      await toggleSubscriptionMutation.mutateAsync(Number(clubId))
    } catch (error) {
      console.error('알림 구독 토글 실패:', error)
      throw error
    }
  }, [clubId, toggleSubscriptionMutation])

  const handleAlertClick = React.useCallback(async () => {
    if (isAuthLoading) return

    if (!promptUserId) {
      router.push(AppPath.login())
      return
    }

    const seen =
      typeof window !== 'undefined' &&
      promptSeenKey != null &&
      localStorage.getItem(promptSeenKey) === 'true'

    const promptDecision = resolveClubDetailPromptOnAlertClick(Boolean(seen))

    if (promptDecision.shouldOpenDialog) {
      if (typeof window !== 'undefined' && promptSeenKey != null) {
        localStorage.setItem(promptSeenKey, String(promptDecision.nextSeen))
      }
      setIsEmailDialogOpen(true)
      return
    }

    await handleConfirmSubscription()
  }, [
    handleConfirmSubscription,
    isAuthLoading,
    promptSeenKey,
    promptUserId,
    router,
  ])

  const detailContent =
    clubDetails?.detailContent?.trim() ||
    '동아리 상세 정보가 아직 등록되지 않았습니다.'

  return (
    <>
      <div
        className={
          isDesktop
            ? 'mx-auto w-full max-w-[920px] px-5 pb-[144px] pt-[56px]'
            : 'w-full pb-[140px] pt-4'
        }
      >
        <div
          className={isDesktop ? 'h-[306px] w-full' : 'h-[232px] w-full px-5'}
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-light-color-3">
            <Image
              src={clubDetails?.imageUrl || '/images/default.svg'}
              alt={clubDetails?.clubName || '동아리 썸네일'}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className={isDesktop ? 'mt-6 px-5' : 'mt-4 px-5'}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-4 pl-2">
              <h1
                className={
                  isDesktop
                    ? 'min-w-0 flex-1 truncate typo-title-1-3-m text-black-color'
                    : 'min-w-0 flex-1 truncate typo-title-3 text-black-color'
                }
              >
                {clubDetails?.clubName || '동아리명'}
              </h1>
            </div>

            {isDesktop && (
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="solid"
                  size="medium"
                  className="h-12 px-6 typo-body-3-b"
                  onClick={handleOpenHomepage}
                  disabled={!clubDetails?.homepageUrl}
                >
                  홈페이지 지원
                </Button>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-light-color-4 text-grey-color-2"
                  onClick={handleAlertClick}
                  disabled={toggleSubscriptionMutation.isPending}
                  aria-label={isSubscribed ? '알림 구독 해제' : '알림 구독'}
                >
                  {isSubscribed ? (
                    <BellFilledIcon width={24} height={24} />
                  ) : (
                    <BellIcon width={24} height={24} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={isDesktop ? 'mt-6 px-5' : 'mt-4 px-5'}>
          <section
            className={
              isDesktop
                ? 'rounded-2xl bg-light-color-2 p-6'
                : 'rounded-2xl bg-light-color-2 p-6'
            }
          >
            <h2
              className={
                isDesktop
                  ? 'typo-title-3 text-black-color'
                  : 'typo-body-1-b text-black-color'
              }
            >
              동아리 소개
            </h2>
            <p
              className={
                isDesktop
                  ? 'mt-4 whitespace-pre-wrap typo-body-3-3-r text-black-color'
                  : 'mt-4 whitespace-pre-wrap typo-button-m text-black-color'
              }
            >
              {detailContent}
            </p>
          </section>
        </div>
      </div>

      {!isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-light-color-3 bg-white-color px-5 pb-5 pt-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outlined-secondary"
              size="medium"
              className="flex-1"
              onClick={handleAlertClick}
              disabled={toggleSubscriptionMutation.isPending}
            >
              <BellFilledIcon width={20} height={20} role="img" />
              모집 알림 받기
            </Button>
            <Button
              type="button"
              variant="solid"
              size="medium"
              className="flex-1"
              onClick={handleOpenHomepage}
              disabled={!clubDetails?.homepageUrl}
            >
              홈페이지 바로가기
            </Button>
          </div>
        </div>
      )}

      <ClubAlertEmailDialog
        open={isEmailDialogOpen}
        isDesktop={isDesktop}
        onOpenChange={setIsEmailDialogOpen}
        onConfirmSubscription={handleConfirmSubscription}
      />
    </>
  )
}
