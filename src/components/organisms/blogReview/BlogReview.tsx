'use client'

import React from 'react'
import Image from 'next/image'
import MobileBookmarkEmptyIcon from '@/assets/icons/bookmark-mobile-empty.svg'
import MobileBookmarkFilledIcon from '@/assets/icons/bookmark-mobile-filled.svg'
import { Tag } from '@/components/atoms/tag/Tag'
import { useToggleBookmark } from '@/features/bookmark'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

export type BlogReviewData = {
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

type BlogReviewContextValue = {
  data: BlogReviewData
  isBookmarked: boolean
  handleBookmarkClick: (e: React.MouseEvent) => void
  handleCardClick: () => void
  isDesktop: boolean
}

const BlogReviewCtx = React.createContext<BlogReviewContextValue | null>(null)

function useBlogReviewContext() {
  const ctx = React.useContext(BlogReviewCtx)
  if (!ctx) {
    throw new Error(
      'BlogReview compound components must be used within BlogReview',
    )
  }
  return ctx
}

export interface BlogReviewProps {
  data: BlogReviewData
  isBookmarked?: boolean
  onBookmarkClick?: () => void
  onDetailClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function BlogReviewRoot({
  data,
  isBookmarked: initialIsBookmarked = false,
  onBookmarkClick,
  onDetailClick,
  className,
  children,
}: BlogReviewProps) {
  const { isDesktop } = useMediaQuery()
  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked)
  const toggleBookmark = useToggleBookmark()

  React.useEffect(() => {
    setIsBookmarked(initialIsBookmarked)
  }, [initialIsBookmarked])

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onBookmarkClick) {
      setIsBookmarked((prev) => !prev)
      onBookmarkClick()
    } else {
      if (!data.reviewId || data.reviewId === 0) {
        console.error('❌ 북마크 토글 실패: reviewId가 없습니다.', {
          data,
          reviewId: data.reviewId,
        })
        return
      }
      setIsBookmarked((prev) => !prev)
      toggleBookmark.mutate(
        { targetId: data.reviewId, type: 'BLOG_REVIEW' as const },
        {
          onError: () => setIsBookmarked((prev) => !prev),
        },
      )
    }
  }

  const handleCardClick = () => {
    if (onDetailClick) {
      onDetailClick()
    } else if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer')
    }
  }

  const ctxValue: BlogReviewContextValue = {
    data,
    isBookmarked,
    handleBookmarkClick,
    handleCardClick,
    isDesktop,
  }

  const hasCompoundChildren =
    React.Children.count(children) > 0 &&
    React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        typeof child.type !== 'string' &&
        'displayName' in child.type &&
        String(
          (child.type as { displayName?: string }).displayName,
        )?.startsWith('BlogReview.'),
    )

  return (
    <BlogReviewCtx.Provider value={ctxValue}>
      {hasCompoundChildren ? (
        <BlogReviewCompoundLayout className={className}>
          {children}
        </BlogReviewCompoundLayout>
      ) : (
        <BlogReviewDefaultLayout className={className} />
      )}
    </BlogReviewCtx.Provider>
  )
}

function BlogReviewCompoundLayout({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { isDesktop, handleCardClick } = useBlogReviewContext()

  const slots = React.useMemo(() => {
    const s: {
      thumbnail?: React.ReactNode
      tags?: React.ReactNode
      title?: React.ReactNode
      description?: React.ReactNode
      blogName?: React.ReactNode
      bookmark?: React.ReactNode
    } = {}
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child) || typeof child.type === 'string') return
      const name = (child.type as { displayName?: string }).displayName
      if (name === 'BlogReview.Thumbnail') s.thumbnail = child
      else if (name === 'BlogReview.Tags') s.tags = child
      else if (name === 'BlogReview.Title') s.title = child
      else if (name === 'BlogReview.Description') s.description = child
      else if (name === 'BlogReview.BlogName') s.blogName = child
      else if (name === 'BlogReview.BookmarkButton') s.bookmark = child
    })
    return s
  }, [children])

  const contentArea = (
    <div className="flex-1 flex flex-col gap-2 min-w-0">
      {slots.tags}
      {slots.title}
      {slots.description}
      {slots.blogName}
    </div>
  )

  if (isDesktop) {
    return (
      <div
        className={cn(
          'group relative flex gap-4 p-4 bg-white rounded-lg hover:border-main-color-1 transition-all cursor-pointer',
          className,
        )}
        onClick={handleCardClick}
      >
        {slots.thumbnail}
        {contentArea}
        {slots.bookmark}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 p-4 bg-white rounded-lg hover:border-main-color-1 transition-all cursor-pointer',
        className,
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap items-center">{slots.tags}</div>
        {slots.bookmark}
      </div>
      <div className="flex gap-3">
        {slots.thumbnail}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {slots.title}
          {slots.description}
          {slots.blogName}
        </div>
      </div>
    </div>
  )
}

function BlogReviewDefaultLayout({ className }: { className?: string }) {
  const {
    data,
    isBookmarked,
    handleBookmarkClick,
    handleCardClick,
    isDesktop,
  } = useBlogReviewContext()

  const thumbnail = (
    <BlogReviewThumbnailImpl
      src={data.thumbnailUrl}
      alt={data.title}
      isDesktop={isDesktop}
    />
  )
  const tags = (
    <div className="flex gap-2 flex-wrap">
      <Tag label={data.clubName} kind="blogReview" size="small" />
      <Tag label={`${data.generation}기`} kind="blogReview" size="small" />
      <Tag label={data.part} kind="blogReview" size="small" />
    </div>
  )
  const title = (
    <h3 className="typo-body-1-2-sb text-black-color line-clamp-1">
      {data.title}
    </h3>
  )
  const description =
    data.description || data.content ? (
      <p
        className={cn(
          'typo-body-3-3-r text-grey-color-5 line-clamp-2',
          isDesktop && 'flex-1',
        )}
      >
        {data.description || data.content}
      </p>
    ) : null
  const blogName = data.blogName ? (
    <span className="typo-button-m text-grey-color-3 line-clamp-1">
      {data.blogName}
    </span>
  ) : null
  const bookmark = (
    <button
      onClick={handleBookmarkClick}
      className={cn(
        'flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none',
        isDesktop ? 'absolute top-4 right-4 z-10' : 'shrink-0',
      )}
      aria-label={isBookmarked ? '북마크 해제' : '북마크'}
    >
      {isBookmarked ? (
        <MobileBookmarkFilledIcon className="w-6 h-6" />
      ) : (
        <MobileBookmarkEmptyIcon className="w-6 h-6" />
      )}
    </button>
  )

  if (isDesktop) {
    return (
      <div
        className={cn(
          'group relative flex gap-4 p-4 bg-white rounded-lg hover:border-main-color-1 transition-all cursor-pointer',
          className,
        )}
        onClick={handleCardClick}
      >
        {thumbnail}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {tags}
          {title}
          {description}
          {blogName}
        </div>
        {bookmark}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 p-4 bg-white rounded-lg hover:border-main-color-1 transition-all cursor-pointer',
        className,
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap items-center">{tags}</div>
        {bookmark}
      </div>
      <div className="flex gap-3">
        {thumbnail}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {title}
          {description}
          {blogName}
        </div>
      </div>
    </div>
  )
}

function BlogReviewThumbnailImpl({
  src,
  alt,
  isDesktop,
}: {
  src?: string
  alt: string
  isDesktop: boolean
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 rounded-lg border border-light-color-3 overflow-hidden bg-grey-color-1',
        isDesktop ? 'w-40 h-30' : 'w-20 h-20',
      )}
    >
      <Image
        src={src || '/images/default.svg'}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/images/default.svg'
        }}
      />
    </div>
  )
}

export function BlogReviewThumbnail({
  children,
  src,
  alt,
}: {
  children?: React.ReactNode
  src?: string
  alt?: string
}) {
  const { data, isDesktop } = useBlogReviewContext()
  const wrapperClass = cn(
    'relative shrink-0 rounded-lg border border-light-color-3 overflow-hidden bg-grey-color-1',
    isDesktop ? 'w-40 h-30' : 'w-20 h-20',
  )
  if (children) {
    return <div className={wrapperClass}>{children}</div>
  }
  const imgSrc = src ?? data?.thumbnailUrl
  const imgAlt = alt ?? data?.title ?? ''
  return (
    <BlogReviewThumbnailImpl src={imgSrc} alt={imgAlt} isDesktop={isDesktop} />
  )
}
BlogReviewThumbnail.displayName = 'BlogReview.Thumbnail'

export function BlogReviewTags({ children }: { children?: React.ReactNode }) {
  const { data } = useBlogReviewContext()
  const content =
    children ??
    (data && (
      <>
        <Tag label={data.clubName} kind="blogReview" size="small" />
        <Tag label={`${data.generation}기`} kind="blogReview" size="small" />
        <Tag label={data.part} kind="blogReview" size="small" />
      </>
    ))
  return <div className="flex gap-2 flex-wrap">{content}</div>
}
BlogReviewTags.displayName = 'BlogReview.Tags'

export function BlogReviewTitle({ children }: { children?: React.ReactNode }) {
  const { data } = useBlogReviewContext()
  const content = children ?? data?.title
  return (
    <h3 className="typo-body-1-2-sb text-black-color line-clamp-1">
      {content}
    </h3>
  )
}
BlogReviewTitle.displayName = 'BlogReview.Title'

export function BlogReviewDescription({
  children,
}: {
  children?: React.ReactNode
}) {
  const { data, isDesktop } = useBlogReviewContext()
  const content = children ?? data?.description ?? data?.content
  if (content == null) return null
  return (
    <p
      className={cn(
        'typo-body-3-3-r text-grey-color-5 line-clamp-2',
        isDesktop && 'flex-1',
      )}
    >
      {content}
    </p>
  )
}
BlogReviewDescription.displayName = 'BlogReview.Description'

export function BlogReviewBlogName({
  children,
}: {
  children?: React.ReactNode
}) {
  const { data } = useBlogReviewContext()
  const content = children ?? data?.blogName
  if (content == null) return null
  return (
    <span className="typo-button-m text-grey-color-3 line-clamp-1">
      {content}
    </span>
  )
}
BlogReviewBlogName.displayName = 'BlogReview.BlogName'

export function BlogReviewBookmarkButton() {
  const { isBookmarked, handleBookmarkClick, isDesktop } =
    useBlogReviewContext()
  return (
    <button
      onClick={handleBookmarkClick}
      className={cn(
        'flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none',
        isDesktop && 'absolute top-4 right-4 z-10',
      )}
      aria-label={isBookmarked ? '북마크 해제' : '북마크'}
    >
      {isBookmarked ? (
        <MobileBookmarkFilledIcon className="w-6 h-6" />
      ) : (
        <MobileBookmarkEmptyIcon className="w-6 h-6" />
      )}
    </button>
  )
}
BlogReviewBookmarkButton.displayName = 'BlogReview.BookmarkButton'
