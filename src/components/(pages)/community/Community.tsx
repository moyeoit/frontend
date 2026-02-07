'use client'

import * as React from 'react'
import type useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'
import { Carousel } from '@/components/atoms/Carousel'
import { Tag } from '@/components/atoms/tag'
import { CommunityCard } from '@/components/molecules/communityCard'
import { PaginationWithHook } from '@/components/molecules/pagination'
import { PopularCommunityCard } from '@/components/molecules/popularCommunityCard'
import { PostButton } from '@/components/molecules/postButton'
import { usePopularPosts, usePosts } from '@/features/community/queries'
import { HERO_IMAGES } from '@/shared/constants/category'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'
import { formatTimeAgo } from '@/shared/utils/dateFormat'

const CATEGORIES = [
  '전체',
  '인기',
  '질문',
  '자유',
  'IT동아리',
  '대학생활',
  '직장생활',
  '이직/커리어',
  '취업준비',
] as const

export function Community() {
  const { isDesktop } = useMediaQuery()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('전체')
  const [popularPage, setPopularPage] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(0)
  const [carouselApi, setCarouselApi] = React.useState<
    ReturnType<typeof useEmblaCarousel>[1] | null
  >(null)

  const { data: popularPostsData } = usePopularPosts({
    page: popularPage,
    size: 3,
  })
  const popularPosts = popularPostsData?.content || []
  const isFirst = popularPostsData?.first ?? true
  const isLast = popularPostsData?.last ?? false

  const categoryName =
    selectedCategory === '전체' ? undefined : selectedCategory
  const { data: postsData } = usePosts({
    categoryName,
    page: currentPage,
    size: 8,
  })
  const posts = postsData?.content || []
  const totalPages = postsData?.totalPages ?? 0

  const handlePageChange = React.useCallback((newPage: number) => {
    setCurrentPage(newPage - 1)
  }, [])

  const handleCategoryChange = React.useCallback((category: string) => {
    setSelectedCategory(category)
    setCurrentPage(0)
  }, [])

  const handleNext = React.useCallback(() => {
    if (!carouselApi) return

    const currentIndex = carouselApi.selectedScrollSnap()
    const totalSlides = carouselApi.scrollSnapList().length
    const isLastSlide = currentIndex >= totalSlides - 1

    if (isLastSlide && !isLast) {
      setPopularPage((prev) => prev + 1)
    } else {
      carouselApi.scrollNext()
    }
  }, [carouselApi, isLast])

  const handlePrev = React.useCallback(() => {
    if (!carouselApi) return

    const currentIndex = carouselApi.selectedScrollSnap()
    const isFirstSlide = currentIndex === 0

    if (isFirstSlide && !isFirst && popularPage > 0) {
      setPopularPage((prev) => prev - 1)
    } else {
      carouselApi.scrollPrev()
    }
  }, [carouselApi, isFirst, popularPage])

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
      <div className={cn('flex flex-col max-w-[1100px] mx-auto')}>
        {isDesktop && (
          <>
            <div className="flex items-center justify-between mb-4 mt-8">
              <div className="typo-title-2-b text-black-color">
                🔥 오늘 가장 인기있는
              </div>
              <div className="flex items-center">
                <button
                  onClick={handlePrev}
                  disabled={
                    carouselApi
                      ? !carouselApi.canScrollPrev() && isFirst
                      : isFirst
                  }
                  className="inline-flex items-center justify-center w-10 h-10 rounded-tl-[6px] rounded-bl-[6px] bg-white border border-light-color-3 hover:bg-light-color-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    carouselApi
                      ? !carouselApi.canScrollNext() && isLast
                      : isLast
                  }
                  className="inline-flex items-center justify-center w-10 h-10 rounded-tr-[6px] rounded-br-[6px] bg-white border border-light-color-3 hover:bg-light-color-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            <Carousel
              opts={{
                align: 'start',
                loop: false,
                slidesToScroll: 3,
                duration: 25,
              }}
              setApi={setCarouselApi}
            >
              <Carousel.Content className="gap-4">
                {popularPosts.map((post) => (
                  <Carousel.Item
                    key={post.postId}
                    className="basis-1/3 shrink-0"
                  >
                    <PopularCommunityCard
                      postType={post.postType}
                      postId={post.postId}
                    >
                      <div className="flex flex-row gap-[5px] mb-2">
                        <Tag
                          label={post.categoryName}
                          kind="blogReview"
                          size="large"
                          className="shrink-0"
                        />
                        <Tag
                          label="인기"
                          kind="clubDetail"
                          size="large"
                          color="lightPurple"
                          className="shrink-0"
                        />
                      </div>
                      <PopularCommunityCard.Title>
                        {post.title}
                      </PopularCommunityCard.Title>
                      <PopularCommunityCard.Description>
                        {post.excerpt}
                      </PopularCommunityCard.Description>
                      <PopularCommunityCard.Meta
                        likes={post.likeCount}
                        comments={post.commentCount}
                        className="mt-3"
                      />
                    </PopularCommunityCard>
                  </Carousel.Item>
                ))}
              </Carousel.Content>
            </Carousel>
          </>
        )}

        <div
          className={cn(
            'mt-8 max-w-[800px] mx-auto',
            !isDesktop && 'w-full overflow-x-hidden',
          )}
        >
          {/* 카테고리 및 글 작성 버튼 */}
          <div
            className={cn(
              'flex items-center gap-2 max-w-[800px] mx-auto',
              !isDesktop && 'overflow-x-auto flex-nowrap pl-5',
              !isDesktop &&
                '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
            )}
          >
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category ? 'solid' : 'outlined-primary'
                }
                size="small"
                onClick={() => handleCategoryChange(category)}
                className="shrink-0 cursor-pointer"
              >
                {category}
              </Button>
            ))}
            {isDesktop && (
              <div className="ml-[42px]">
                <PostButton />
              </div>
            )}
          </div>
          <div className={cn('mt-4 mb-28', !isDesktop && 'px-5')}>
            {posts.map((post) => (
              <CommunityCard
                key={post.postId}
                type="horizontal"
                postType={post.postType}
                postId={post.postId}
                className={cn(
                  'gap-6 pt-8 group cursor-pointer relative',
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
                  </div>
                  <CommunityCard.Title>{post.title}</CommunityCard.Title>
                  <CommunityCard.Description>
                    {post.excerpt}
                  </CommunityCard.Description>
                  <CommunityCard.Meta
                    nickname={post.authorNickname}
                    timeAgo={formatTimeAgo(post.createdAt)}
                    views={post.viewCount}
                    likes={post.likeCount}
                    comments={post.commentCount}
                    className="mt-4"
                  />
                </CommunityCard.Content>
                <CommunityCard.Image
                  logoUrl={post.thumbnailUrl}
                  alt={post.title}
                />
              </CommunityCard>
            ))}
            {totalPages > 1 && (
              <div className="mt-8">
                <PaginationWithHook
                  totalPages={totalPages}
                  maxVisiblePages={5}
                  initialPage={currentPage + 1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
