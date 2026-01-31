'use client'

import React from 'react'
import Image from 'next/image'
import MobileBookmarkEmptyIcon from '@/assets/icons/bookmark-mobile-empty.svg'
import MobileBookmarkFilledIcon from '@/assets/icons/bookmark-mobile-filled.svg'
import { Tag } from '@/components/atoms/tag/Tag'
import { useToggleBookmark } from '@/features/bookmark'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

export interface BlogReviewProps {
  data: {
    reviewId: number
    clubName: string
    generation: number
    part: string
    title: string
    content?: string
    description?: string | null
    url?: string
    thumbnailUrl?: string
    blogName?: string
  }
  isBookmarked?: boolean
  onBookmarkClick?: () => void
  onDetailClick?: () => void
  className?: string
}

export const BlogReview: React.FC<BlogReviewProps> = ({
  data,
  isBookmarked: initialIsBookmarked = false,
  onBookmarkClick,
  onDetailClick,
  className,
}) => {
  const { isDesktop } = useMediaQuery()

  // 북마크 상태 관리
  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked)
  const toggleBookmark = useToggleBookmark()

  // 초기 isBookmarked prop이 변경되면 상태 업데이트
  React.useEffect(() => {
    setIsBookmarked(initialIsBookmarked)
  }, [initialIsBookmarked])

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onBookmarkClick) {
      setIsBookmarked((prev) => !prev)
      onBookmarkClick()
    } else {
      // reviewId가 없으면 에러
      if (!data.reviewId || data.reviewId === 0) {
        console.error('❌ 북마크 토글 실패: reviewId가 없습니다.', {
          data,
          reviewId: data.reviewId,
        })
        return
      }

      setIsBookmarked((prev) => !prev)

      const bookmarkPayload = {
        targetId: data.reviewId, // 블로그 후기 API의 reviewId를 북마크 API의 targetId로 사용
        type: 'BLOG_REVIEW' as const,
      }

      console.log('🔖 블로그 후기 북마크 토글:', {
        reviewId: data.reviewId,
        payload: bookmarkPayload,
        새로운상태: !isBookmarked,
      })

      toggleBookmark.mutate(bookmarkPayload, {
        onError: () => {
          // 에러 발생 시 이전 상태로 롤백
          setIsBookmarked((prev) => !prev)
        },
      })
    }
  }

  const handleCardClick = () => {
    if (onDetailClick) {
      onDetailClick()
    } else if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer')
    }
  }

  // PC 레이아웃
  if (isDesktop) {
    return (
      <div
        className={cn(
          'group relative flex gap-4 p-4 bg-white rounded-lg hover:border-main-color-1 transition-all cursor-pointer',
          className,
        )}
        onClick={handleCardClick}
      >
        {/* 썸네일 이미지 */}
        <div className="relative w-40 h-30 shrink-0 rounded-lg border border-light-color-3 overflow-hidden bg-grey-color-1">
          <Image
            src={data.thumbnailUrl || '/images/default.svg'}
            alt={data.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/default.svg'
            }}
          />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* 태그들 */}
          <div className="flex gap-2 flex-wrap">
            <Tag label={data.clubName} kind="blogReview" size="small" />
            <Tag
              label={`${data.generation}기`}
              kind="blogReview"
              size="small"
            />
            <Tag label={data.part} kind="blogReview" size="small" />
          </div>

          {/* 제목 */}
          <h3 className="typo-body-1-2-sb text-black-color line-clamp-1">
            {data.title}
          </h3>

          {/* 내용 미리보기 */}
          {(data.description || data.content) && (
            <p className="typo-body-3-3-r text-grey-color-5 line-clamp-2 flex-1">
              {data.description || data.content}
            </p>
          )}

          {/* 블로그명 */}
          {data.blogName && (
            <span className="typo-button-m text-grey-color-3 line-clamp-1">
              {data.blogName}
            </span>
          )}
        </div>

        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 z-10 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none"
          aria-label={isBookmarked ? '북마크 해제' : '북마크'}
        >
          {isBookmarked ? (
            <MobileBookmarkFilledIcon className="w-6 h-6" />
          ) : (
            <MobileBookmarkEmptyIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    )
  }

  // 모바일 레이아웃
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 p-4 bg-white rounded-lg hover:border-main-color-1 transition-all cursor-pointer',
        className,
      )}
      onClick={handleCardClick}
    >
      {/* 상단: 태그와 북마크 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap items-center">
          <Tag label={data.clubName} kind="blogReview" size="small" />
          <Tag label={`${data.generation}기`} kind="blogReview" size="small" />
          <Tag label={data.part} kind="blogReview" size="small" />
        </div>

        {/* 북마크 버튼 */}
        <button
          onClick={handleBookmarkClick}
          className="shrink-0 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none"
          aria-label={isBookmarked ? '북마크 해제' : '북마크'}
        >
          {isBookmarked ? (
            <MobileBookmarkFilledIcon className="w-6 h-6" />
          ) : (
            <MobileBookmarkEmptyIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 하단: 썸네일과 텍스트 콘텐츠 */}
      <div className="flex gap-3">
        {/* 썸네일 이미지 */}
        <div className="relative w-20 h-20 shrink-0 rounded-lg border border-light-color-3 overflow-hidden bg-grey-color-1">
          <Image
            src={data.thumbnailUrl || '/images/default.svg'}
            alt={data.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/default.svg'
            }}
          />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {/* 제목 */}
          <h3 className="typo-body-1-2-sb text-black-color line-clamp-1">
            {data.title}
          </h3>

          {/* 내용 미리보기 */}
          {(data.description || data.content) && (
            <p className="typo-body-3-3-r text-grey-color-5 line-clamp-2">
              {data.description || data.content}
            </p>
          )}

          {/* 블로그명 */}
          {data.blogName && (
            <span className="typo-button-m text-grey-color-3 line-clamp-1">
              {data.blogName}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogReview
