'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { GreyMessage } from '@/assets/icons/GreyMessage'
import { GreyThumbsUp } from '@/assets/icons/GreyThumbsUp'
import MobileBookmarkEmptyIcon from '@/assets/icons/bookmark-mobile-empty.svg'
import MobileBookmarkFilledIcon from '@/assets/icons/bookmark-mobile-filled.svg'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import { ReviewProps } from '@/features/review/types'
import { cn } from '@/shared/utils/cn'
import { getProfileImage } from '@/shared/utils/profile'

export default function Review({
  data,
  className,
  isBookmarked: initialIsBookmarked = false,
  onDetailClick,
  onLikeClick,
  onCommentClick,
  onBookmarkClick,
}: ReviewProps) {
  // 북마크 상태 관리
  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked)

  // API 응답 구조에서 데이터 추출
  const clubName = data.club?.clubName || data.clubName || ''
  const part = data.job?.name || data.part || ''
  const generation = data.generation || data.cohort || ''
  const rate = data.rate
  const likeCount = data.likeCount || 0
  const commentCount = data.commentCount || 0
  const result = data.result
  const answers = data.answers
  const position = data.position || part

  // 기존 호환 필드
  const nickname = data.nickname
  const oneLineComment = data.oneLineComment
  const qaPreviews = data.qaPreviews
  const title = data.title

  const profileImageUrl = getProfileImage(position)
  const displayName = nickname || clubName.charAt(0)

  // 북마크 클릭 핸들러
  const handleBookmarkClick = () => {
    setIsBookmarked((prev) => !prev)
    onBookmarkClick?.()
  }

  // answers 배열에서 태그 정보 추출 (질문 title | element title, 2개 이상이면 첫 번째만 표시하고 외N)
  const tags = React.useMemo(() => {
    if (answers && answers.length > 0) {
      return answers.slice(0, 3).map((answer) => {
        const questionTitle = answer.question.title
        const elements = answer.question.elements || []

        // value가 배열인 경우
        if (Array.isArray(answer.value) && answer.value.length > 0) {
          const firstValueId = answer.value[0]
          const firstElement = elements.find((el) => el.id === firstValueId)

          if (firstElement) {
            const firstElementTitle = firstElement.title
            // 여러 개 선택된 경우 첫 번째만 표시하고 "외N" 형식으로 표시
            if (answer.value.length > 1) {
              const additionalCount = answer.value.length - 1
              return `${questionTitle} | ${firstElementTitle} 외${additionalCount}`
            }
            // 단일 선택인 경우
            return `${questionTitle} | ${firstElementTitle}`
          }
        }

        // value가 단일 숫자인 경우 (INTEGER)
        if (typeof answer.value === 'number') {
          const element = elements.find((el) => el.id === answer.value)
          if (element) {
            return `${questionTitle} | ${element.title}`
          }
        }

        // element를 찾을 수 없는 경우 질문 title만 반환
        return questionTitle
      })
    }
    // 기존 qaPreviews 호환 (북마크 API 응답)
    if (qaPreviews && qaPreviews.length > 0) {
      return qaPreviews.slice(0, 3).map((qa) => {
        const questionTitle = qa.questionTitle
        const answerValue = qa.answerValue
        if (answerValue) {
          return `${questionTitle} | ${answerValue}`
        }
        return questionTitle
      })
    }
    return []
  }, [answers, qaPreviews])

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
    return oneLineComment || ''
  }, [title, answers, oneLineComment])

  return (
    <div
      className={cn(
        'relative w-full bg-light-color-1 rounded-lg p-6 space-y-4',
        className,
      )}
    >
      {/* 북마크 아이콘 */}
      {onBookmarkClick && (
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 z-10 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none"
          aria-label="북마크"
        >
          {isBookmarked ? (
            <MobileBookmarkFilledIcon className="w-6 h-6" />
          ) : (
            <MobileBookmarkEmptyIcon className="w-6 h-6" />
          )}
        </button>
      )}

      {/* 상단: 프로필 및 정보 */}
      <div className="flex items-start gap-3">
        {/* 프로필 이미지 */}
        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-[#EAFFE9] flex items-center justify-center">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="typo-body-2-sb text-[#2DA715]">
              {displayName.charAt(0)}
            </span>
          )}
        </div>

        {/* 오른쪽 영역: 동아리명·기수·파트명·합격여부 및 별점 */}
        <div className="flex-1 flex flex-col gap-2">
          {/* 동아리명 · 기수 · 파트명 · 합격여부 */}
          <div className="flex items-center gap-1 typo-button-m text-grey-color-5">
            <span className="truncate">{clubName}</span>
            <span>·</span>
            <span>{generation + '기'}</span>
            <span>·</span>
            <span className="truncate">{part}</span>
            {result && (
              <>
                <span>·</span>
                <span>
                  {result === 'PASS'
                    ? '합격'
                    : result === 'FAIL'
                      ? '불합격'
                      : result}
                </span>
              </>
            )}
          </div>

          {/* 별점 (난이도) */}
          <div className="flex items-center gap-2">
            <StarRating
              value={rate}
              onChange={() => {}}
              disabled
              className="[&>button]:p-0 [&_svg]:w-4 [&_svg]:h-4"
            />
            <span className="typo-sm-body-1-5 text-grey-color-4">난이도</span>
          </div>
        </div>
      </div>

      {/* 태그 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 typo-button-m text-grey-color-3">
          {tags.map((tag, index) => {
            const parts = tag.split(' | ')
            const questionTitle = parts[0]
            const elementTitle = parts.slice(1).join(' | ')

            return (
              <React.Fragment key={index}>
                <span>
                  {questionTitle}
                  {elementTitle && (
                    <>
                      {' | '}
                      <span className="text-grey-color-5">{elementTitle}</span>
                    </>
                  )}
                </span>
                {/* {index < tags.length - 1 && <span>|</span>} */}
              </React.Fragment>
            )
          })}
        </div>
      )}

      {/* 한줄평 내용 */}
      {reviewContent && (
        <div className="space-y-2">
          <p className="typo-body-1-2-sb text-black-color font-semibold">
            {reviewContent}
          </p>

          {/* 자세히 보기 링크 */}
          {onDetailClick && (
            <button
              onClick={onDetailClick}
              className="flex items-center gap-1 typo-sm-body-1-5 text-grey-color-3 hover:text-grey-color-2 transition-colors"
            >
              <span>자세히 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 하단: 좋아요 및 댓글 */}
      <div className="flex justify-end items-center gap-4 pt-2">
        <button
          onClick={onLikeClick}
          className="flex items-center gap-1 typo-body-4-m text-grey-color-3 hover:text-grey-color-2 transition-colors"
        >
          <GreyThumbsUp />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={onCommentClick}
          className="flex items-center gap-1 typo-body-4-m text-grey-color-3 hover:text-grey-color-2 transition-colors"
        >
          <GreyMessage />
          <span>{commentCount}</span>
        </button>
      </div>
    </div>
  )
}
