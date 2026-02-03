'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardOverlay } from '@/components/molecules/card'
import { PopularCommunityCardOverlay } from '@/components/molecules/popularCommunityCard'
import { PopularReviewCard } from '@/components/molecules/popularReviewCard'
import { usePopularClubs } from '@/features/clubs/queries'
import { HERO_IMAGES } from '@/shared/constants/category'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

// 더미 인기 후기 데이터
const DUMMY_POPULAR_REVIEWS = [
  {
    reviewId: '1',
    category: 'DOCUMENT' as const,
    clubName: '프론트엔드 개발 동아리',
    generation: 12,
    jobName: '프론트엔드 개발자',
    ratingValue: 4,
    content:
      '직무 경험이 없으면 힘들게 느껴 질 수도 있는 압박질문이 있었고, 실제 프로젝트 경험을 바탕으로 답변하는 것이 중요했습니다.',
  },
  {
    reviewId: '2',
    category: 'INTERVIEW' as const,
    clubName: '백엔드 개발 동아리',
    generation: 11,
    jobName: '백엔드 개발자',
    ratingValue: 5,
    content:
      '면접 준비를 철저히 했고, 동아리에서 진행한 프로젝트 경험이 큰 도움이 되었습니다. 기술 질문보다는 프로젝트 경험을 중심으로 질문이 나왔어요.',
  },
  {
    reviewId: '3',
    category: 'ACTIVITY' as const,
    clubName: '풀스택 개발 동아리',
    generation: 13,
    jobName: '풀스택 개발자',
    ratingValue: 4,
    content:
      '동아리 활동을 통해 다양한 기술 스택을 경험할 수 있었고, 협업 능력도 크게 향상되었습니다. 실제 서비스를 배포해본 경험이 인상적이었습니다.',
  },
] as const

// 더미 커뮤니티 글 데이터
const DUMMY_COMMUNITY_POSTS = [
  {
    postId: 1,
    title: '프론트엔드 개발자 취업 준비 팁 공유합니다',
    excerpt:
      '최근 프론트엔드 개발자로 취업에 성공했습니다. 면접 준비와 포트폴리오 작성에 도움이 되었던 경험을 공유하고자 합니다.',
    thumbnailUrl: '/images/default.svg',
    categoryId: 1,
    categoryName: '질문',
    postType: 'QUESTION',
    authorNickname: '개발자123',
    viewCount: 245,
    likeCount: 32,
    commentCount: 15,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
  },
  {
    postId: 2,
    title: 'React 19 신기능 정리 및 사용 후기',
    excerpt:
      'React 19의 새로운 기능들을 정리하고 실제 프로젝트에 적용해본 경험을 공유합니다.',
    thumbnailUrl: '/images/default.svg',
    categoryId: 2,
    categoryName: '자유',
    postType: 'GENERAL',
    authorNickname: 'React러버',
    viewCount: 512,
    likeCount: 67,
    commentCount: 23,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
  },
  {
    postId: 3,
    title: 'Next.js 15 App Router 마이그레이션 가이드',
    excerpt:
      '기존 프로젝트를 Next.js 15 App Router로 마이그레이션하면서 겪은 문제들과 해결 방법을 정리했습니다.',
    thumbnailUrl: '/images/default.svg',
    categoryId: 3,
    categoryName: 'IT동아리',
    postType: 'GENERAL',
    authorNickname: 'NextJS마스터',
    viewCount: 789,
    likeCount: 89,
    commentCount: 34,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
  },
] as const

export default function HomePage() {
  const { isDesktop } = useMediaQuery()
  const { data: popularClubs } = usePopularClubs()

  return (
    <div>
      {/* Hero 섹션 */}
      <div className="relative h-70 flex justify-center overflow-hidden w-full mx-auto">
        <Image
          src={HERO_IMAGES.all}
          alt="커뮤니티 히어로 이미지"
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

        <div className={`flex flex-col ${isDesktop ? 'gap-y-7' : 'gap-y-6'}`}>
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

            {/* CardOverlay 더미 테스트 */}
            <div
              className={`mt-4 px-5 flex gap-4 ${isDesktop ? 'grid grid-cols-4' : 'flex flex-col'}`}
            >
              <CardOverlay
                club={{
                  clubId: 1,
                  clubName: '더미 동아리 이름',
                  description:
                    '이것은 더미 데이터입니다. CardOverlay 컴포넌트가 어떻게 보이는지 확인하기 위한 테스트입니다.',
                  categories: ['개발', '프론트엔드'],
                  logoUrl: '/images/default.svg',
                  isRecruiting: true,
                }}
                isSubscribed={false}
                onBookmarkClick={(e, clubId) => {
                  e.stopPropagation()
                  console.log('북마크 클릭:', clubId)
                }}
              />
              <CardOverlay
                club={{
                  clubId: 1,
                  clubName: '더미 동아리 이름',
                  description:
                    '이것은 더미 데이터입니다. CardOverlay 컴포넌트가 어떻게 보이는지 확인하기 위한 테스트입니다.',
                  categories: ['개발', '프론트엔드'],
                  logoUrl: '/images/default.svg',
                  isRecruiting: true,
                }}
                isSubscribed={false}
                onBookmarkClick={(e, clubId) => {
                  e.stopPropagation()
                  console.log('북마크 클릭:', clubId)
                }}
              />
              <CardOverlay
                club={{
                  clubId: 1,
                  clubName: '더미 동아리 이름',
                  description:
                    '이것은 더미 데이터입니다. CardOverlay 컴포넌트가 어떻게 보이는지 확인하기 위한 테스트입니다.',
                  categories: ['개발', '프론트엔드'],
                  logoUrl: '/images/default.svg',
                  isRecruiting: true,
                }}
                isSubscribed={false}
                onBookmarkClick={(e, clubId) => {
                  e.stopPropagation()
                  console.log('북마크 클릭:', clubId)
                }}
              />
              <CardOverlay
                club={{
                  clubId: 1,
                  clubName: '더미 동아리 이름',
                  description:
                    '이것은 더미 데이터입니다. CardOverlay 컴포넌트가 어떻게 보이는지 확인하기 위한 테스트입니다.',
                  categories: ['개발', '프론트엔드'],
                  logoUrl: '/images/default.svg',
                  isRecruiting: true,
                }}
                isSubscribed={false}
                onBookmarkClick={(e, clubId) => {
                  e.stopPropagation()
                  console.log('북마크 클릭:', clubId)
                }}
              />
            </div>
          </div>

          <div
            className={`grid ${isDesktop ? 'grid-cols-4 gap-4 gap-y-4' : 'grid-cols-2 gap-3 gap-y-6'} ${!isDesktop ? 'justify-items-center' : ''}`}
          >
            {popularClubs?.content
              ? popularClubs.content.map((club) => (
                  <Link key={club.clubId} href={`/club/${club.clubId}`}>
                    <Card
                      size={isDesktop ? 'col4Desktop' : 'col4Phone'}
                      orientation="vertical"
                      border={true}
                      gap="12px"
                      className="group cursor-pointer relative"
                    >
                      <Card.Image
                        logoUrl={club.logoUrl}
                        alt={club.clubName}
                        interactive
                        className="transition-transform duration-300 ease-out"
                      />
                      <Card.Content className="px-[6px]">
                        <Card.Title>{club.clubName}</Card.Title>
                        <Card.Description>{club.description}</Card.Description>
                        <Card.Meta part={club.categories.join(' · ')} />
                      </Card.Content>
                      {club.isRecruiting && (
                        <div className="w-[61px] h-[29px] absolute top-[16px] left-[16px] bg-white text-grey-color-5 typo-caption-sb rounded-[73px] border border-light-color-3 z-10 px-3 py-1.5 text-center flex items-center justify-center leading-none">
                          모집중
                        </div>
                      )}
                    </Card>
                  </Link>
                ))
              : null}
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
              {DUMMY_POPULAR_REVIEWS.map((review) => (
                <div
                  key={review.reviewId}
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
                      category={review.category}
                      clubName={review.clubName}
                      generation={review.generation}
                      jobName={review.jobName}
                      ratingValue={review.ratingValue}
                    />
                    <PopularReviewCard.Content>
                      {review.content}
                    </PopularReviewCard.Content>
                    <PopularReviewCard.Link reviewId={review.reviewId} />
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
              {DUMMY_COMMUNITY_POSTS.map((post) => (
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
