'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import AppPath from '@/shared/configs/appPath'
import { cn } from '@/shared/utils/cn'

/* --------------------------------- Root --------------------------------- */

export type PopularReviewCardRootProps = React.HTMLAttributes<HTMLDivElement>

export function PopularReviewCardRoot({
  className,
  children,
  ...props
}: PopularReviewCardRootProps) {
  return (
    <div
      data-slot="popular-review-card"
      className={cn(
        'flex min-w-[230px] w-full flex-col justify-center rounded-lg bg-light-color-1 p-5 space-y-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* --------------------------------- Tag --------------------------------- */

export interface PopularReviewCardTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

export function PopularReviewCardTag({
  className,
  children = '인기',
  ...props
}: PopularReviewCardTagProps) {
  return (
    <span
      data-slot="popular-review-card-tag"
      className={cn(
        'inline-flex w-fit items-center justify-center rounded-[40px] px-3 py-1 typo-caption-2',
        'bg-main-color-3 text-main-color-1',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* --------------------------------- Profile (아바타 오른쪽: 위 동아리명·기수·파트명, 아래 난이도) --------------------------------- */

const REVIEW_CATEGORY_STYLES = {
  DOCUMENT: {
    initial: '서',
    avatarClassName: 'bg-[#EAFFE9] text-[#2DA715]',
    ratingLabel: '난이도',
  },
  INTERVIEW: {
    initial: '면',
    avatarClassName: 'bg-[#FFF5AD] text-[#FF9500]',
    ratingLabel: '난이도',
  },
  ACTIVITY: {
    initial: '활',
    avatarClassName: 'bg-[#DBEAFE] text-[#2563EB]',
    ratingLabel: '만족도',
  },
} as const

export type ReviewCategoryType = keyof typeof REVIEW_CATEGORY_STYLES

export interface PopularReviewCardProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 리뷰 타입 - DOCUMENT: 서, INTERVIEW: 면, ACTIVITY: 활 (API category 연결용) */
  category?: ReviewCategoryType
  /** 아바타에 표시할 글자 (category 없을 때 사용) */
  initial?: string
  /** 동아리명 (API 필드 - clubName, generation, jobName 함께 사용 시 label 대신 사용) */
  clubName?: string
  /** 기수 (API 필드) */
  generation?: number
  /** 파트명 (API 필드) */
  jobName?: string
  /** 1~5 별점 */
  ratingValue?: number
  /** 별점 라벨 (category 없을 때 사용) */
  ratingLabel?: string
}

const STAR_MAX = 5

export function PopularReviewCardProfile({
  category,
  initial,
  clubName,
  generation,
  jobName,
  ratingValue = 0,
  ratingLabel = '난이도',
  className,
  ...props
}: PopularReviewCardProfileProps) {
  const displayValue = Math.min(STAR_MAX, Math.max(0, ratingValue))

  const styleConfig = category ? REVIEW_CATEGORY_STYLES[category] : null
  const displayInitial = styleConfig?.initial ?? initial?.charAt(0) ?? '?'
  const avatarClassName =
    styleConfig?.avatarClassName ?? 'bg-[#EAFFE9] text-[#2DA715]'
  const displayRatingLabel = styleConfig?.ratingLabel ?? ratingLabel

  const metaLabel =
    clubName != null
      ? [clubName, generation != null ? `${generation}기` : null, jobName]
          .filter(Boolean)
          .join(' · ')
      : ''

  return (
    <div
      data-slot="popular-review-card-profile"
      className={cn('flex items-start gap-3', className)}
      {...props}
    >
      <span
        data-slot="popular-review-card-avatar"
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full typo-body-1-2-sb',
          avatarClassName,
        )}
      >
        {displayInitial}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="typo-button-m text-black-color truncate">
          {metaLabel}
        </span>
        <div className="flex items-center gap-2">
          <StarRating
            value={displayValue}
            onChange={() => {}}
            maxStars={STAR_MAX}
            disabled
            className="[&>button]:p-0 [&_svg]:w-4 [&_svg]:h-4"
          />
          <span className="typo-sm-body-1-5 text-grey-color-4 shrink-0">
            {displayRatingLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Content --------------------------------- */

export type PopularReviewCardContentProps =
  React.HTMLAttributes<HTMLParagraphElement>

export function PopularReviewCardContent({
  className,
  ...props
}: PopularReviewCardContentProps) {
  return (
    <p
      data-slot="popular-review-card-content"
      className={cn(
        'typo-button-m text-black-color min-w-0 overflow-hidden line-clamp-2 text-ellipsis whitespace-nowrap',
        className,
      )}
      {...props}
    />
  )
}

/* --------------------------------- Link --------------------------------- */

export interface PopularReviewCardLinkProps extends Omit<
  React.ComponentProps<typeof Link>,
  'href'
> {
  /** 리뷰 상세 페이지로 이동할 ID */
  reviewId: string
  children?: React.ReactNode
}

export function PopularReviewCardLink({
  reviewId,
  className,
  children = (
    <>
      자세히 보기 <ChevronRight className="w-4 h-4" />
    </>
  ),
  ...props
}: PopularReviewCardLinkProps) {
  return (
    <Link
      data-slot="popular-review-card-link"
      href={AppPath.reviewDetail(reviewId)}
      className={cn(
        'flex w-fit items-center gap-1 typo-sm-body-1-5 text-grey-color-3 hover:text-grey-color-2 transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

/* --------------------------------- Compound export --------------------------------- */

export const PopularReviewCard = {
  Root: PopularReviewCardRoot,
  Tag: PopularReviewCardTag,
  Profile: PopularReviewCardProfile,
  Content: PopularReviewCardContent,
  Link: PopularReviewCardLink,
}
