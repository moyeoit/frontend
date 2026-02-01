'use client'

import * as React from 'react'
import Image from 'next/image'
import { Button } from '@/components/atoms/Button'
import { Carousel } from '@/components/atoms/Carousel'
import { Tag } from '@/components/atoms/tag'
import { CommunityCard } from '@/components/molecules/communityCard'
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
  const { data: popularPostsData } = usePopularPosts({ page: 0, size: 3 })
  const popularPosts = popularPostsData?.content || []

  const categoryName =
    selectedCategory === '전체' ? undefined : selectedCategory
  const { data: postsData } = usePosts({
    categoryName,
    page: 0,
    size: 20,
  })
  const posts = postsData?.content || []

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
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              slidesToScroll: 3,
            }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4 mt-8">
              <div className="typo-title-2-b text-black-color">
                🔥 지금 가장 인기있는
              </div>
              <div className="flex items-center gap-2">
                <Carousel.Previous />
                <Carousel.Next />
              </div>
            </div>
            <Carousel.Content className="-ml-4">
              {popularPosts.map((post) => (
                <Carousel.Item
                  key={post.postId}
                  className="pl-4 basis-1/3 shrink-0"
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
              'flex items-center gap-2',
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
                onClick={() => setSelectedCategory(category)}
                className="shrink-0 cursor-pointer"
              >
                {category}
              </Button>
            ))}
            <PostButton />
          </div>
          <div className={cn('mt-4 mb-28', !isDesktop && 'px-5')}>
            {posts.map((post) => (
              <CommunityCard
                key={post.postId}
                type="horizontal"
                postType={post.postType}
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
          </div>
        </div>
      </div>
    </div>
  )
}
