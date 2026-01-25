'use client'

import { MessageCircle, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import { Card } from '@/components/molecules/card'
import { cn } from '@/shared/utils/cn'

type ReviewSummary = {
  questionTitleSummary?: string
  answerSummary: string
}

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

// 서류/면접 타입 아이콘 컴포넌트
function DocumentTypeIcon({
  type,
}: {
  type: 'DOCUMENT' | 'INTERVIEW' | string
}) {
  const isDocument = type === 'DOCUMENT'
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full size-10 shrink-0',
        isDocument ? 'bg-[#eaffe9]' : 'bg-[#fff5ad]',
      )}
    >
      <span
        className={cn(
          'typo-body-1 font-semibold',
          isDocument ? 'text-[#2da715]' : 'text-[#ff9500]',
        )}
      >
        {isDocument ? '서' : '면'}
      </span>
    </div>
  )
}

export function ReviewListItem({
  review,
  isDesktop = true,
}: {
  review: ReviewListItemData
  isDesktop?: boolean
}) {
  const href = review.reviewId ? `/review/${review.reviewId}` : '#'
  const meta = [review.clubName, `${review.generation}기`, review.jobName]
    .filter(Boolean)
    .join(' · ')

  // 답변 요약에서 메타 정보 추출
  const keyAppeal =
    review.answerSummaries?.find(
      (s) =>
        s.questionTitleSummary?.includes('핵심') ||
        s.questionTitleSummary?.includes('어필'),
    )?.answerSummary || '지원동기 외2'

  const referenceInfo =
    review.answerSummaries?.find(
      (s) =>
        s.questionTitleSummary?.includes('참고') ||
        s.questionTitleSummary?.includes('정보'),
    )?.answerSummary || '공식 공고'

  const writingStyle =
    review.answerSummaries?.find(
      (s) =>
        s.questionTitleSummary?.includes('서술') ||
        s.questionTitleSummary?.includes('방식'),
    )?.answerSummary || '데이터 성과 수치 서술'

  // 면접인 경우 출제 질문, 분위기 표시
  const isInterview = review.category === 'INTERVIEW'
  const questionInfo =
    review.answerSummaries?.find(
      (s) =>
        s.questionTitleSummary?.includes('질문') ||
        s.questionTitleSummary?.includes('출제'),
    )?.answerSummary || '지원동기 외2'

  const atmosphereInfo =
    review.answerSummaries?.find(
      (s) =>
        s.questionTitleSummary?.includes('분위기') ||
        s.questionTitleSummary?.includes('느낌'),
    )?.answerSummary || '차가움/무서움'

  return (
    <Link href={href} className="block">
      <div
        className={cn(
          'w-full bg-white border-b border-light-color-4 transition-all hover:bg-light-color-1',
          isDesktop ? 'p-5' : 'p-4',
        )}
      >
        <div className="flex flex-col gap-4">
          {/* 상단: 아이콘 + 메타정보 */}
          <div className="flex items-center gap-3">
            <DocumentTypeIcon type={review.category || 'DOCUMENT'} />
            <div className="flex flex-col">
              <span className="typo-body-4-m text-grey-color-5">{meta}</span>
              <div className="flex items-center gap-2">
                <StarRating
                  value={review.rate}
                  onChange={() => {}}
                  disabled
                  className="[&>button]:p-0 [&_svg]:w-[15px] [&_svg]:h-[15px]"
                />
                <span className="typo-body-4-m text-grey-color-4">난이도</span>
              </div>
            </div>
          </div>

          {/* 중단: 메타 정보 (핵심 어필, 참고 정보, 서술 방식) */}
          <div
            className={cn(
              'flex flex-wrap gap-x-4 gap-y-1 text-grey-color-5',
              isDesktop ? 'typo-body-4-m' : 'typo-caption-3',
            )}
          >
            {isInterview ? (
              <>
                <span>
                  <span className="text-grey-color-3">출제 질문 ｜</span>
                  {questionInfo}
                </span>
                <span>
                  <span className="text-grey-color-3">핵심 어필｜</span>
                  {keyAppeal}
                </span>
                <span>
                  <span className="text-grey-color-3">분위기｜</span>
                  {atmosphereInfo}
                </span>
              </>
            ) : (
              <>
                <span>
                  <span className="text-grey-color-3">핵심 어필 ｜</span>
                  {keyAppeal}
                </span>
                <span>
                  <span className="text-grey-color-3">참고 정보｜</span>
                  {referenceInfo}
                </span>
                <span>
                  <span className="text-grey-color-3">서술 방식｜</span>
                  {writingStyle}
                </span>
              </>
            )}
          </div>

          {/* 하단: 한줄평 */}
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                'text-black-color font-semibold',
                isDesktop ? 'typo-body-1' : 'typo-body-3-1',
              )}
            >
              {review.title}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-grey-color-3',
                  isDesktop ? 'typo-caption-r' : 'typo-caption-2',
                )}
              >
                자세히 보기
              </span>
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                className="-rotate-90"
              >
                <path
                  d="M2.25 3.375L4.5 5.625L6.75 3.375"
                  stroke="#8D8E8F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 좋아요/댓글 */}
          <div className="flex items-center justify-end gap-2 text-grey-color-3">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-5 h-5" />
              <span className="typo-body-3-3r">{review.likeCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
              <span className="typo-body-3-3r">{review.commentCount}</span>
            </span>
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
