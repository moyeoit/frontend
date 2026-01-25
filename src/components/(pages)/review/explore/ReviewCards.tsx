'use client'

import { MessageCircle, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import { Card } from '@/components/molecules/card'
import { cn } from '@/shared/utils/cn'

type ReviewSummary = { answerSummary: string }

export type ReviewListItemData = {
  reviewId?: number
  clubName: string
  jobName: string
  generation: number
  title: string
  answerSummaries: ReviewSummary[]
  rate: number
  likeCount: number
  commentCount: number
  category?: string
}

export type BlogReviewCardData = {
  reviewId?: number
  clubName: string
  generation: number
  jobName: string
  title: string
  answerSummaries: ReviewSummary[]
}

export function ReviewListItem({ review }: { review: ReviewListItemData }) {
  const snippet = review.answerSummaries?.[0]?.answerSummary || ''
  const href = review.reviewId ? `/review/${review.reviewId}` : '#'
  const meta = [review.clubName, `${review.generation}기`, review.jobName]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link href={href} className="block">
      <div className="w-full border border-light-color-3 rounded-2xl p-4 bg-white transition-all hover:shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="typo-body-4-m text-grey-color-3">{meta}</div>
            <div className="flex items-center gap-2">
              <StarRating
                value={review.rate}
                onChange={() => {}}
                disabled
                className="[&>button]:p-0"
              />
              <span className="typo-body-4-m text-grey-color-3">
                {review.rate.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="typo-body-1 text-black-color line-clamp-1">
            {review.title}
          </div>
          <div className="typo-body-3-3r text-grey-color-4 line-clamp-2">
            {snippet}
          </div>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'px-3 py-1 rounded-full border text-xs',
                'border-light-color-3 text-grey-color-4',
              )}
            >
              {review.category || '후기'}
            </span>
            <div className="flex items-center gap-3 text-grey-color-3 typo-caption-m">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {review.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {review.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function BlogReviewCard({
  review,
  isDesktop,
}: {
  review: BlogReviewCardData
  isDesktop: boolean
}) {
  const snippet = review.answerSummaries?.[0]?.answerSummary || ''
  const href = review.reviewId ? `/review/${review.reviewId}` : '#'
  const tags = [
    review.clubName,
    review.generation ? `${review.generation}기` : null,
    review.jobName,
  ].filter(Boolean)

  return (
    <Link href={href} className="block">
      <Card
        orientation="horizontal"
        border={true}
        gap={isDesktop ? '24px' : '16px'}
        pad={isDesktop ? '24px' : '16px'}
        className="group cursor-pointer border border-light-color-3 rounded-[16px] transition-all duration-300 w-full"
      >
        <Card.Image
          alt={review.title}
          interactive
          ImageWidth={isDesktop ? '10.5rem' : '7rem'}
          className="transition-transform duration-300 ease-out"
        />
        <Card.Content className="flex flex-col justify-between min-w-0">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border text-xs border-light-color-3 text-grey-color-4"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <Card.Title>{review.title}</Card.Title>
              <Card.Description>{snippet}</Card.Description>
            </div>
          </div>
        </Card.Content>
      </Card>
    </Link>
  )
}
