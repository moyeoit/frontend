'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CardOverlay } from '@/components/molecules/card'
import { PopularCommunityCardOverlay } from '@/components/molecules/popularCommunityCard'
import { PopularReviewCard } from '@/components/molecules/popularReviewCard'
import { useToggleBookmark, useBookmarkedClubs } from '@/features/bookmark'
import { useClubsList } from '@/features/clubs/queries'
import { usePopularPosts } from '@/features/community/queries'
import { ClubItem } from '@/features/explore/types'
import { useSearchReviews } from '@/features/review/queries'
import { HERO_IMAGES } from '@/shared/constants/category'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

export default function HomePage() {
  const { isDesktop } = useMediaQuery()
  const { data: popularClubsData } = useClubsList({
    page: 0,
    size: 4,
    sort: '인기순',
  })
  const { data: bookmarkedClubsData } = useBookmarkedClubs()
  const toggleBookmark = useToggleBookmark()

  const { data: popularPostsData } = usePopularPosts({
    page: 0,
    size: 3,
  })
  const { data: popularReviewsData } = useSearchReviews({
    page: 0,
    size: 3,
    sort: 'POPULAR',
  })
  const popularPosts = popularPostsData?.content || []
  const popularClubs = popularClubsData?.content || []
  const popularReviews = popularReviewsData?.content || []
  const bookmarkedClubs = bookmarkedClubsData?.data?.content || []
  const bookmarkedClubIds = new Set(bookmarkedClubs.map((club) => club.clubId))

  const handleBookmarkClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      e.stopPropagation()
      toggleBookmark.mutate({ targetId: clubId, type: 'CLUB' })
    },
    [toggleBookmark],
  )

  return (
    <div>
      {/* Hero 섹션 */}
      <div className="relative h-70 flex justify-center overflow-hidden w-full mx-auto">
        <Image
          src={HERO_IMAGES.all}
          alt="히어로 이미지"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 하단 푸터 제외한 컨테이너 내용물 전체 */}
      <div
        className={`py-8 max-w-[1100px] w-full mx-auto ${isDesktop ? 'flex flex-col gap-y-14' : 'flex flex-col gap-y-12'}`}
      >
        {/* 상단 버튼 2개  */}

        <div className={`flex flex-col ${isDesktop ? 'gap-y-16' : 'gap-y-12'}`}>
          {/* 인기 IT 동아리  */}
          <div>
            <div className="flex flex-row justify-between items-center px-5">
              <h2 className="typo-title-2 ">인기 IT 동아리</h2>
              <Link href="/club/explore">
                <div className="typo-button-m text-grey-color-3 cursor-pointer">
                  전체보기
                </div>
              </Link>
            </div>

            <div
              className={`mt-4 px-5 flex gap-4 ${isDesktop ? 'grid grid-cols-4' : 'flex flex-col'}`}
            >
              {popularClubs.map((club: ClubItem) => (
                <CardOverlay
                  key={club.clubId}
                  club={club as Parameters<typeof CardOverlay>[0]['club']}
                  isSubscribed={bookmarkedClubIds.has(club.clubId)}
                  onBookmarkClick={handleBookmarkClick}
                />
              ))}
            </div>
          </div>

          {/* 인기 후기 */}
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="flex flex-row justify-between items-center px-5">
                <h2 className="typo-title-2">인기 후기</h2>
                <Link href="/review/explore">
                  <div className="typo-button-m text-grey-color-3 cursor-pointer">
                    전체보기
                  </div>
                </Link>
              </div>
            </div>
            <div
              className={cn(
                isDesktop
                  ? 'px-5 grid grid-cols-3 gap-4 gap-y-4'
                  : 'pl-5 flex flex-nowrap overflow-x-auto gap-4 [&::-webkit-scrollbar]:hidden',
              )}
            >
              {popularReviews.map((review) => (
                <div
                  key={review.reviewId || review.title}
                  className={cn(!isDesktop && 'shrink-0')}
                >
                  <PopularReviewCard
                    className={cn(
                      'w-full max-w-[342px]',
                      !isDesktop && 'min-w-[280px]',
                    )}
                  >
                    <PopularReviewCard.Tag />
                    <PopularReviewCard.Profile
                      category={
                        review.category as 'DOCUMENT' | 'INTERVIEW' | 'ACTIVITY'
                      }
                      clubName={review.clubName}
                      generation={review.generation}
                      jobName={review.jobName}
                      ratingValue={review.rate}
                    />
                    <PopularReviewCard.Content>
                      {review.answerSummaries?.[0]?.answerSummary ||
                        review.title}
                    </PopularReviewCard.Content>
                    {review.reviewId && (
                      <PopularReviewCard.Link
                        reviewId={String(review.reviewId)}
                      />
                    )}
                  </PopularReviewCard>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={cn('flex flex-col', isDesktop ? 'gap-y-14' : 'gap-y-12')}
        >
          {/* 인기 커뮤니티 글 */}
          <div>
            <div className="flex flex-row justify-between items-center px-5 mb-4">
              <h2 className="typo-title-2">인기 커뮤니티 글</h2>
              <Link href="/community">
                <div className="typo-button-m text-grey-color-3 cursor-pointer">
                  전체보기
                </div>
              </Link>
            </div>

            <div
              className={cn(
                'flex gap-4 px-5',
                isDesktop ? 'flex-row' : 'flex-col',
              )}
            >
              {popularPosts.map((post) => (
                <PopularCommunityCardOverlay key={post.postId} post={post} />
              ))}
            </div>
          </div>

          {/* 하단 광고 배너 */}
          <div className="px-5 mb-12">
            <div className={`w-full h-full flex items-center justify-between`}>
              <Image
                src="/images/main-footer.svg"
                alt="main-footer"
                width={1060}
                height={264}
                className={`min-h-44 object-cover ${isDesktop ? 'rounded-[24px]' : 'rounded-[8px]'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
