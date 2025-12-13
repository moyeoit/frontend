'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/molecules/card'
import CardOverlay from '@/components/molecules/card/CardOverlay'
import { useToggleClubSubscription } from '@/features/clubs/mutations'
import { usePopularClubs } from '@/features/clubs/queries'
import { usePopularPremiumReviews } from '@/features/review/queries'
import { useUserSubscribes } from '@/features/subscribe/queries'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

export default function HomePage() {
  const { isDesktop } = useMediaQuery()
  const { data: popularClubs } = usePopularClubs()
  const { data: popularPremiumReviews } = usePopularPremiumReviews()
  const { data: subscribesData } = useUserSubscribes()
  const toggleSubscription = useToggleClubSubscription()

  const subscribes = subscribesData?.data?.content || []
  const subscribedClubIds = new Set(subscribes.map((s) => s.clubId))

  const handleBookmarkClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      e.stopPropagation()
      toggleSubscription.mutate(clubId)
    },
    [toggleSubscription],
  )

  return (
    <div>
      <div className="h-[280px] flex items-end justify-center px-5 py-14 relative">
        <Image
          src="/images/mainBanner.gif"
          alt="메인 배너"
          width={1440}
          height={280}
          unoptimized
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="max-w-7xl w-full relative z-10"></div>
      </div>

      {/* 하단 푸터 제외한 컨테이너 내용물 전체 */}
      <div className=" py-8 max-w-[1100px] w-full mx-auto">
        
        {/* 인기 IT 동아리  */}
        <div className="px-5">
          <div className="flex flex-row justify-between items-center">
            <h2 className="typo-title-2-b">인기 IT 동아리</h2>
            <Link href="/club/explore">
              <div
                className={`${isDesktop ? 'typo-button-m' : 'text-[12px]'} text-grey-color-3 cursor-pointer`}
              >
                전체보기
              </div>
            </Link>
          </div>

          <div
            className={`grid ${isDesktop ? 'grid-cols-4 gap-4' : 'grid-cols-1 gap-4'} mt-4`}
          >
            {popularClubs?.content?.map((club) => (
              <CardOverlay
                key={club.clubId}
                club={club}
                isSubscribed={subscribedClubIds.has(club.clubId)}
                onBookmarkClick={handleBookmarkClick}
              />
            ))}
          </div>
        </div>

        {/* IT 동아리 프리미엄 후기 */}
        <div className={`${isDesktop ? 'mt-16' : 'mt-12'} px-5`}>
          <div>
            <h2 className="typo-title-2-m">인기 후기</h2>
          </div>

          <div
            className={`grid ${isDesktop ? 'grid-cols-2 gap-6' : 'grid-cols-1 gap-4'} mt-6 ${isDesktop ? 'mb-16' : 'mb-12'}`}
          >
            {popularPremiumReviews?.content
              ? popularPremiumReviews.content.map((review) => (
                  <Link
                    key={review.reviewId}
                    href={`/review/${review.reviewId}`}
                  >
                    <Card
                      size={isDesktop ? 'col3Desktop' : 'homeReviewPhone'}
                      orientation="horizontal"
                      border={true}
                      gap="12px"
                      className="group cursor-pointer relative"
                    >
                      <Card.Image
                        logoUrl={review.imageUrl}
                        alt={review.title}
                        interactive
                        className="transition-transform duration-300 ease-out"
                      />
                      <Card.Content className="px-[6px]">
                        <Card.Title>{review.title}</Card.Title>
                        <Card.Description>{review.headLine}</Card.Description>
                        <Card.Meta part={review.identifier.join(' · ')} />
                        <Card.Stats
                          likes={review.likeCount}
                          comments={review.commentCount}
                        />
                      </Card.Content>
                    </Card>
                  </Link>
                ))
              : null}
          </div>
        </div>

        {/* 하단 광고 배너 */}
        <div className="mx-5 mb-12">
          <Image
            width={1060}
            height={264}
            src="/icons/main.svg"
            alt="main"
            className="w-full h-full object-cover rounded-[24px]"
          />
        </div>
      </div>
    </div>
  )
}
