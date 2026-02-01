'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { GreyMessage } from '@/assets/icons/GreyMessage'
import { GreyThumbsUp } from '@/assets/icons/GreyThumbsUp'
import MobileBookmarkEmptyIcon from '@/assets/icons/bookmark-mobile-empty.svg'
import MobileBookmarkFilledIcon from '@/assets/icons/bookmark-mobile-filled.svg'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import { ReviewProps } from '@/features/review/types'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'

function DocumentTypeIcon({ type }: { type: string }) {
  const normalized = type?.toUpperCase() ?? 'DOCUMENT'
  const isInterview = normalized === 'INTERVIEW'
  const isActivity = normalized === 'ACTIVITY'
  const bgClass = isActivity
    ? 'bg-[#d8dfff]'
    : isInterview
      ? 'bg-[#fff5ad]'
      : 'bg-[#eaffe9]'
  const textClass = isActivity
    ? 'text-[#3d5eff]'
    : isInterview
      ? 'text-[#ff9500]'
      : 'text-[#2da715]'
  const label = isActivity ? '활' : isInterview ? '면' : '서'
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shrink-0',
        bgClass,
        'size-10',
      )}
    >
      <span className={cn('font-semibold typo-body-1', textClass)}>
        {label}
      </span>
    </div>
  )
}

export default function Review({
  data,
  className,
  isBookmarked: initialIsBookmarked = false,
  onDetailClick,
  onLikeClick,
  onCommentClick,
  onBookmarkClick,
}: ReviewProps) {
  const { isDesktop } = useMediaQuery()

  // 북마크 상태 관리
  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked)

  // API 응답 구조에서 데이터 추출
  const clubName = data.club?.clubName || data.clubName || ''
  const part = data.job?.name || data.part || ''
  const generation = data.generation || data.cohort || ''
  const rate = data.rate
  const likeCount = data.likeCount || 0
  const commentCount = data.commentCount || 0
  const category =
    data.category || (data as { reviewType?: string }).reviewType || 'DOCUMENT'
  const answers = data.answers
  const answerSummaries = data.answerSummaries
  const qaPreviews = data.qaPreviews
  const title = data.title

  // 북마크 클릭 핸들러
  const handleBookmarkClick = () => {
    setIsBookmarked((prev) => !prev)
    onBookmarkClick?.()
  }

  // 한줄평 추출: "다음 지원자들을 위한 서류 TIP" 또는 "자유 후기"의 value
  const reviewContent = React.useMemo(() => {
    // 북마크 API 응답의 title 필드 우선 사용
    if (title) {
      return title
    }

    if (answers && answers.length > 0) {
      // "다음 지원자들을 위한 서류 TIP" 찾기
      const tipAnswer = answers.find(
        (answer) =>
          answer.question.title.includes('TIP') ||
          answer.question.title.includes('tip'),
      )
      if (tipAnswer && typeof tipAnswer.value === 'string') {
        return tipAnswer.value
      }

      // "자유 후기" 찾기
      const freeReviewAnswer = answers.find(
        (answer) =>
          answer.question.title.includes('자유 후기') ||
          answer.question.title.includes('자유후기'),
      )
      if (freeReviewAnswer && typeof freeReviewAnswer.value === 'string') {
        return freeReviewAnswer.value
      }

      // 마지막 주관식 답변 찾기
      const lastSubjectiveAnswer = answers
        .slice()
        .reverse()
        .find(
          (answer) =>
            answer.answerType === 'TEXT' ||
            answer.answerType === 'SINGLE_SUBJECTIVE',
        )
      if (
        lastSubjectiveAnswer &&
        typeof lastSubjectiveAnswer.value === 'string'
      ) {
        return lastSubjectiveAnswer.value
      }
    }
    // 기존 oneLineComment 호환
    return data.oneLineComment || ''
  }, [title, answers, data.oneLineComment])

  const summaryValue = React.useCallback(
    (keywords: string[], fallback: string) => {
      const summaryMatch = answerSummaries?.find((summary) =>
        keywords.some((keyword) =>
          summary.questionTitleSummary?.includes(keyword),
        ),
      )
      if (summaryMatch?.answerSummary) return summaryMatch.answerSummary

      const qaMatch = qaPreviews?.find((preview) =>
        keywords.some((keyword) => preview.questionTitle?.includes(keyword)),
      )
      if (qaMatch?.answerValue) return qaMatch.answerValue

      const answerMatch = answers?.find((answer) =>
        keywords.some((keyword) => answer.question.title?.includes(keyword)),
      )
      if (answerMatch && typeof answerMatch.value === 'string') {
        return answerMatch.value
      }

      return fallback
    },
    [answerSummaries, qaPreviews, answers],
  )

  const isInterview = category?.toUpperCase() === 'INTERVIEW'
  const isActivity = category?.toUpperCase() === 'ACTIVITY'

  const meta = [clubName, generation ? `${generation}기` : null, part]
    .filter(Boolean)
    .join(' · ')

  const keyAppeal = summaryValue(['핵심', '어필'], '지원동기 외2')
  const referenceInfo = summaryValue(['참고', '정보'], '공식 공고')
  const writingStyle = summaryValue(['서술', '방식'], '데이터 성과 수치 서술')
  const questionInfo = summaryValue(['질문', '출제'], '지원동기 외2')
  const atmosphereInfo = summaryValue(['분위기', '느낌'], '차가움/무서움')
  const timeInfo = summaryValue(['투자', '시간'], '주 5시간 미만')
  const activityLevel = summaryValue(['활동', '수준'], '개인 흥미 수준')
  const satisfactionInfo = summaryValue(
    ['만족', '영역'],
    '직무 기술/ 실력 성장 외4',
  )

  return (
    <div
      className={cn(
        'relative w-full bg-white border-b border-light-color-4 transition-all',
        isDesktop ? 'p-5' : 'p-4',
        className,
      )}
    >
      {onBookmarkClick && (
        <button
          onClick={handleBookmarkClick}
          className={cn(
            'absolute right-4 top-4 z-10 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none',
            !isDesktop && 'right-3 top-3',
          )}
          aria-label="북마크"
        >
          {isBookmarked ? (
            <MobileBookmarkFilledIcon className="w-6 h-6" />
          ) : (
            <MobileBookmarkEmptyIcon className="w-6 h-6" />
          )}
        </button>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <DocumentTypeIcon type={category} />
          <div className="flex flex-col">
            <span
              className={cn(
                'text-grey-color-5',
                isDesktop ? 'typo-body-4-m' : 'typo-caption-2',
              )}
            >
              {meta}
            </span>
            <div className="flex items-center gap-2">
              <StarRating
                value={rate}
                onChange={() => {}}
                disabled
                className="[&>button]:p-0 [&_svg]:w-[15px] [&_svg]:h-[15px]"
              />
              <span
                className={cn(
                  'text-grey-color-4',
                  isDesktop ? 'typo-body-4-m' : 'typo-caption-2',
                )}
              >
                {isActivity ? '만족도' : '난이도'}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'text-grey-color-5',
            isDesktop
              ? 'flex flex-wrap gap-x-4 gap-y-1 typo-body-4-m'
              : 'flex flex-col gap-1 typo-caption-3',
          )}
        >
          {isActivity ? (
            <>
              <span>
                <span className="text-grey-color-3">투자 시간 ｜</span>
                {timeInfo}
              </span>
              <span>
                <span className="text-grey-color-3">활동 수준｜</span>
                {activityLevel}
              </span>
              <span>
                <span className="text-grey-color-3">만족 영역｜</span>
                {satisfactionInfo}
              </span>
            </>
          ) : isInterview ? (
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

        {reviewContent && (
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                'text-black-color font-semibold',
                isDesktop ? 'typo-body-1' : 'typo-body-3-1',
              )}
            >
              {reviewContent}
            </p>
            {onDetailClick && (
              <button
                onClick={onDetailClick}
                className="flex items-center gap-1 typo-caption-2 text-grey-color-3 hover:text-grey-color-2 transition-colors"
              >
                <span>자세히 보기</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 text-grey-color-3">
          <button
            onClick={onLikeClick}
            className="flex items-center gap-1 typo-body-3-3r"
          >
            <GreyThumbsUp />
            <span>{likeCount}</span>
          </button>
          <button
            onClick={onCommentClick}
            className="flex items-center gap-1 typo-body-3-3r"
          >
            <GreyMessage />
            <span>{commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
