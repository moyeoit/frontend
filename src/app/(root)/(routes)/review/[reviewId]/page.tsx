'use client'

import React, { use, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Bookmark, Heart, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ProfileIcon } from '@/assets/icons'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import {
  BookmarkType,
  checkReviewBookmarkedFromLists,
  useToggleBookmark,
} from '@/features/bookmark'
import { useToggleReviewLike } from '@/features/like'
import { reviewKeys } from '@/features/review/keys'
import {
  useDeleteReviewComment,
  usePostReviewComment,
} from '@/features/review/mutations'
import { useReviewComments, useReviewDetail } from '@/features/review/queries'
import {
  ResultType,
  ReviewAnswer,
  ReviewAnswerItem,
  ReviewCategory,
  ReviewComment,
} from '@/features/review/types'
import { useUserProfile } from '@/features/user/queries'
import AppPath from '@/shared/configs/appPath'
import { useAuth } from '@/shared/providers/auth-provider'
import { formatDateToYYMMDD } from '@/shared/utils/dateFormat'

const RESULT_LABELS: Record<ResultType, string> = {
  [ResultType.Pass]: '합격',
  [ResultType.Failure]: '불합격',
  [ResultType.NotParticipateAfterPass]: '합격 후 참여하지 않음',
  [ResultType.Waiting]: '결과 대기중',
  [ResultType.Activity]: '활동 중',
  [ResultType.EndActivity]: '활동 종료',
}

const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  [ReviewCategory.Document]: '서류',
  [ReviewCategory.Interview]: '면접',
  [ReviewCategory.Activity]: '활동',
}

const isStructuredAnswer = (answer: ReviewAnswerItem): answer is ReviewAnswer =>
  typeof answer === 'object' &&
  answer !== null &&
  'answerType' in answer &&
  'question' in answer

const normalizeText = (value: string) => value.replace(/\s+/g, '').toLowerCase()

const includesKeyword = (title: string, keywords: string[]) => {
  const normalizedTitle = normalizeText(title)
  return keywords.some((keyword) =>
    normalizedTitle.includes(normalizeText(keyword)),
  )
}

const resolveReviewCategory = (
  category?: ReviewCategory | string,
  result?: ResultType | string,
): ReviewCategory => {
  if (category === ReviewCategory.Activity || category === 'ACTIVITY') {
    return ReviewCategory.Activity
  }
  if (category === ReviewCategory.Document || category === 'DOCUMENT') {
    return ReviewCategory.Document
  }
  if (category === ReviewCategory.Interview || category === 'INTERVIEW') {
    return ReviewCategory.Interview
  }

  if (result === ResultType.Activity || result === ResultType.EndActivity) {
    return ReviewCategory.Activity
  }

  return ReviewCategory.Interview
}

const formatResultLabel = (result?: ResultType | string) => {
  if (!result) return '결과 미정'
  return RESULT_LABELS[result as ResultType] ?? result
}

const difficultyLabel = (rate: number) => {
  if (!Number.isFinite(rate)) return '보통'
  if (rate >= 4.5) return '매우 쉬움'
  if (rate >= 3.5) return '쉬움'
  if (rate >= 2.5) return '보통'
  if (rate >= 1.5) return '어려움'
  return '매우 어려움'
}

const satisfactionLabel = (rate: number) => {
  if (!Number.isFinite(rate)) return '보통'
  if (rate >= 4.5) return '매우 만족'
  if (rate >= 3.5) return '만족'
  if (rate >= 2.5) return '보통'
  if (rate >= 1.5) return '불만족'
  return '매우 불만족'
}

const mapAnswerElementTitle = (
  answer: ReviewAnswer,
  rawValue: number | string,
) => {
  const parsed = typeof rawValue === 'number' ? rawValue : Number(rawValue)
  if (Number.isFinite(parsed)) {
    const matched = answer.question?.elements?.find(
      (element) => element.id === parsed,
    )
    if (matched?.elementTitle) {
      return matched.elementTitle
    }
  }
  return String(rawValue)
}

const answerToDisplayValues = (answer?: ReviewAnswer): string[] => {
  if (!answer) return []

  if (Array.isArray(answer.value)) {
    return answer.value
      .map((value) => mapAnswerElementTitle(answer, value))
      .filter((value) => value.trim().length > 0)
  }

  if (answer.value == null || answer.value === '') {
    return []
  }

  return [mapAnswerElementTitle(answer, answer.value)]
}

const answerToDisplayText = (
  answer: ReviewAnswer | undefined,
  fallback: string,
) => {
  const values = answerToDisplayValues(answer)
  if (!values.length) return fallback
  return values.join(' / ')
}

const findAnswerByKeywords = (answers: ReviewAnswer[], keywords: string[]) => {
  return answers.find((answer) =>
    includesKeyword(answer.question?.title ?? '', keywords),
  )
}

const renderAnswerText = (answer: ReviewAnswer) => {
  const values = answerToDisplayValues(answer)
  if (!values.length) {
    return '작성된 답변이 없습니다.'
  }

  if (Array.isArray(answer.value)) {
    return values.join(', ')
  }

  return values[0]
}

const isNoteAnswer = (title?: string) =>
  Boolean(title && (title.includes('후기') || title.includes('TIP')))

export default function Page({
  params,
}: {
  params: Promise<{ reviewId: string }>
}) {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { reviewId } = use(params)
  const numericReviewId = Number(reviewId)

  const {
    data: reviewDetail,
    isLoading,
    isError,
  } = useReviewDetail(numericReviewId)
  const { data: comments, isLoading: isCommentsLoading } =
    useReviewComments(numericReviewId)
  const { data: userProfile } = useUserProfile()

  const [commentInput, setCommentInput] = useState('')
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null)
  const [replyInput, setReplyInput] = useState('')

  const { mutate: postComment, isPending: isPostingComment } =
    usePostReviewComment(numericReviewId, {
      onSuccess: () => setCommentInput(''),
    })

  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteReviewComment(numericReviewId)

  const [likeState, setLikeState] = useState({
    liked: false,
    likeCount: 0,
  })

  const [bookmarkState, setBookmarkState] = useState<{
    isBookmarked: boolean
    type: BookmarkType
    targetId: number
  }>({
    isBookmarked: false,
    type: 'INTERVIEW_REVIEW',
    targetId: numericReviewId,
  })

  const queryClient = useQueryClient()

  const { mutate: toggleReviewLike, isPending: isTogglingLike } =
    useToggleReviewLike({
      onMutate: () => {
        const previous = likeState
        setLikeState((prev) => ({
          ...prev,
          liked: !prev.liked,
          likeCount: Math.max(0, prev.likeCount + (prev.liked ? -1 : 1)),
        }))
        return { previous }
      },
      onError: (_error, _variables, context) => {
        if (context?.previous) {
          setLikeState(context.previous as typeof likeState)
        }
      },
      onSuccess: (data) => {
        if (!data) return
        setLikeState((prev) => ({
          liked: data.liked ?? prev.liked,
          likeCount:
            typeof data.likeCount === 'number'
              ? data.likeCount
              : prev.likeCount,
        }))
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.detail(numericReviewId),
        })
      },
    })

  const { mutate: toggleBookmark, isPending: isTogglingBookmark } =
    useToggleBookmark({
      onMutate: () => {
        const previous = bookmarkState
        setBookmarkState((prev) => ({
          ...prev,
          isBookmarked: !prev.isBookmarked,
        }))
        return { previous }
      },
      onError: (_error, _variables, context) => {
        if (
          context &&
          typeof context === 'object' &&
          'previous' in context &&
          context.previous
        ) {
          setBookmarkState(context.previous as typeof bookmarkState)
        }
      },
      onSuccess: (data) => {
        setBookmarkState((prev) => ({
          ...prev,
          isBookmarked: data.isBookmarked,
        }))
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.detail(numericReviewId),
        })
      },
    })

  useEffect(() => {
    if (!reviewDetail) return

    let isCancelled = false
    let bookmarkType: 'INTERVIEW_REVIEW' | 'ACTIVITY_REVIEW'
    if (reviewDetail.reviewCategory) {
      bookmarkType =
        reviewDetail.reviewCategory === ReviewCategory.Activity
          ? 'ACTIVITY_REVIEW'
          : 'INTERVIEW_REVIEW'
    } else if (
      reviewDetail.result === ResultType.Activity ||
      reviewDetail.result === ResultType.EndActivity
    ) {
      bookmarkType = 'ACTIVITY_REVIEW'
    } else {
      bookmarkType = 'INTERVIEW_REVIEW'
    }

    setLikeState({
      liked: reviewDetail.liked ?? false,
      likeCount: reviewDetail.likeCount ?? 0,
    })

    setBookmarkState({
      isBookmarked: reviewDetail.isBookmarked ?? false,
      type: bookmarkType,
      targetId: numericReviewId,
    })

    if (typeof reviewDetail.isBookmarked === 'boolean') {
      return
    }

    const resolveBookmarkFromLists = async () => {
      try {
        const isBookmarked = await checkReviewBookmarkedFromLists(
          numericReviewId,
          bookmarkType,
        )

        if (isCancelled) return

        setBookmarkState((prev) => {
          if (prev.targetId !== numericReviewId || prev.type !== bookmarkType) {
            return prev
          }
          return {
            ...prev,
            isBookmarked,
          }
        })
      } catch {
        // 목록 조회 실패 시 상세 응답 기본값(false)을 유지
      }
    }

    resolveBookmarkFromLists()

    return () => {
      isCancelled = true
    }
  }, [numericReviewId, reviewDetail])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-color-2 flex items-center justify-center">
        <div className="text-center">
          <div className="typo-body-1-2-sb text-grey-color-1">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (isError || !reviewDetail) {
    return (
      <div className="min-h-screen bg-light-color-2 flex items-center justify-center">
        <div className="text-center">
          <div className="typo-body-1-2-sb text-grey-color-1">
            리뷰를 찾을 수 없습니다
          </div>
        </div>
      </div>
    )
  }

  const structuredAnswers = (reviewDetail.answers || []).filter(
    isStructuredAnswer,
  )

  const reviewCategory = resolveReviewCategory(
    reviewDetail.reviewCategory,
    reviewDetail.result,
  )

  const isActivityReview = reviewCategory === ReviewCategory.Activity
  const isInterviewReview = reviewCategory === ReviewCategory.Interview

  const reviewCategoryLabel = CATEGORY_LABELS[reviewCategory]
  const showPopularChip = isInterviewReview

  const ratingValue = Number.isFinite(reviewDetail.rate) ? reviewDetail.rate : 0
  const ratingLabel = isActivityReview
    ? satisfactionLabel(ratingValue)
    : difficultyLabel(ratingValue)
  const ratingTitle = isActivityReview ? '만족도' : '난이도'

  const resultTitle = isActivityReview
    ? '활동 여부'
    : isInterviewReview
      ? '면접 결과'
      : '서류 결과'

  const keyFocusAnswer = findAnswerByKeywords(
    structuredAnswers,
    isInterviewReview ? ['핵심 질문', '출제 질문'] : ['핵심 어필'],
  )
  const supportInfoAnswer = findAnswerByKeywords(
    structuredAnswers,
    isInterviewReview ? ['어필 요소'] : ['참고 정보'],
  )
  const contextInfoAnswer = findAnswerByKeywords(
    structuredAnswers,
    isInterviewReview ? ['면접 정황', '분위기'] : ['서술 방식'],
  )

  const timeInfoAnswer = findAnswerByKeywords(structuredAnswers, ['투자 시간'])
  const activityLevelAnswer = findAnswerByKeywords(structuredAnswers, [
    '활동 수준',
  ])
  const satisfactionAreaAnswer = findAnswerByKeywords(structuredAnswers, [
    '만족 영역',
  ])

  const keyFocusValues = answerToDisplayValues(keyFocusAnswer).slice(0, 4)
  const satisfactionAreaValues = answerToDisplayValues(
    satisfactionAreaAnswer,
  ).slice(0, 4)

  const supportInfoText = answerToDisplayText(
    supportInfoAnswer,
    isInterviewReview ? '전문성 / 직무 지식' : '공식 공고 / sns',
  )
  const contextInfoText = answerToDisplayText(
    contextInfoAnswer,
    isInterviewReview ? '무관심 / 차가움' : '데이터 성과 수치 서술',
  )

  const timeInfoText = answerToDisplayText(timeInfoAnswer, '주 5시간 미만')
  const activityLevelText = answerToDisplayText(
    activityLevelAnswer,
    '개인 흥미 수준',
  )

  const clubName = reviewDetail.club?.clubName ?? ''
  const generationLabel = reviewDetail.generation
    ? `${reviewDetail.generation}기`
    : ''
  const partLabel = reviewDetail.job?.name ?? ''
  const applicationMeta = [clubName, generationLabel, partLabel].filter(Boolean)

  const countVisibleComments = (items: ReviewComment[] | undefined): number => {
    if (!items) return 0

    return items.reduce((sum, comment) => {
      const selfCount = comment.deleted ? 0 : 1
      const childCount = comment.children?.length
        ? countVisibleComments(comment.children)
        : 0
      return sum + selfCount + childCount
    }, 0)
  }

  const commentCount =
    comments != null
      ? countVisibleComments(comments)
      : reviewDetail.commentCount

  const trimmedComment = commentInput.trim()
  const trimmedReply = replyInput.trim()

  const renderCommentContent = (comment: ReviewComment) =>
    comment.deleted ? '삭제된 댓글입니다.' : comment.content

  const renderPipeValues = (
    values: string[],
    fallback: string,
    valueClassName: string,
  ) => {
    const filtered = values.filter((value) => value.trim().length > 0)
    if (!filtered.length) {
      return <span className={valueClassName}>{fallback}</span>
    }

    return filtered.map((value, index) => (
      <React.Fragment key={`${value}-${index}`}>
        <span className={valueClassName}>{value}</span>
        {index < filtered.length - 1 && <span>｜</span>}
      </React.Fragment>
    ))
  }

  const redirectToLoginWithNotice = () => {
    if (typeof window !== 'undefined') {
      alert('로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.')
    }
    router.push(AppPath.login())
  }

  const ensureAuthenticated = () => {
    if (isAuthLoading) return false
    if (user) return true
    redirectToLoginWithNotice()
    return false
  }

  const handleToggleLike = () => {
    if (!ensureAuthenticated()) return
    if (isTogglingLike) return
    toggleReviewLike(numericReviewId)
  }

  const handleToggleBookmark = () => {
    if (!ensureAuthenticated()) return
    if (isTogglingBookmark) return
    toggleBookmark({
      targetId: numericReviewId,
      type: bookmarkState.type,
    })
  }

  const handleSubmitComment = () => {
    if (!ensureAuthenticated()) return
    if (!trimmedComment || isPostingComment) return
    postComment({
      reviewId: numericReviewId,
      content: trimmedComment,
      parentCommentId: null,
    })
  }

  const handleReplySubmit = (parentCommentId: number) => {
    if (!ensureAuthenticated()) return
    if (!trimmedReply || isPostingComment) return

    postComment({
      reviewId: numericReviewId,
      content: trimmedReply,
      parentCommentId,
    })

    setReplyInput('')
    setReplyTargetId(null)
  }

  const handleDeleteComment = (commentId: number) => {
    if (isDeletingComment) return
    deleteComment(commentId)
  }

  const renderComments = (
    items: ReviewComment[],
    depth = 0,
  ): React.ReactNode => {
    return items.map((comment) => {
      const isNested = depth > 0
      const canReply = !comment.deleted
      const canDelete =
        !comment.deleted && userProfile?.nickname === comment.nickname

      return (
        <div
          key={comment.id}
          className={
            isNested
              ? 'rounded-[8px] bg-light-color-1 px-4 py-5 md:px-5 md:py-6'
              : 'border-b border-light-color-3 py-6'
          }
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div className="h-8 w-8 overflow-hidden flex items-center justify-center rounded-full border border-light-color-3 bg-light-color-2 md:h-10 md:w-10">
              {comment.profileImageUrl ? (
                <Image
                  src={comment.profileImageUrl}
                  alt={`${comment.nickname} 프로필`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <ProfileIcon className="h-5 w-5 text-grey-color-3 md:h-6 md:w-6" />
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="typo-body-3-1-sb md:typo-body-2-2-sb text-black-color">
                {comment.nickname}
              </div>

              <p className="typo-button-m md:typo-body-2-3-m text-grey-color-4 whitespace-pre-line">
                {renderCommentContent(comment)}
              </p>

              <div className="flex flex-wrap items-center gap-1 text-grey-color-2 typo-button-m">
                <span>{formatDateToYYMMDD(comment.createDate)}</span>

                {canReply && (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-grey-color-2"
                    >
                      <Heart className="h-4 w-4" />
                      좋아요
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      className="text-grey-color-2"
                      onClick={() => {
                        if (!ensureAuthenticated()) return
                        setReplyTargetId(comment.id)
                        setReplyInput('')
                      }}
                    >
                      답글 달기
                    </button>
                  </>
                )}

                {canDelete && (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      className="text-grey-color-2"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {replyTargetId === comment.id && (
            <div className={isNested ? 'mt-3' : 'mt-4 pl-11 md:pl-14'}>
              <div className="flex items-center gap-3 rounded-[8px] border border-light-color-3 bg-white px-4 py-3 text-[14px] text-grey-color-3">
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-grey-color-1"
                  placeholder="답글을 입력하세요"
                  value={replyInput}
                  onChange={(event) => setReplyInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleReplySubmit(comment.id)
                    }
                    if (event.key === 'Escape') {
                      setReplyTargetId(null)
                      setReplyInput('')
                    }
                  }}
                />

                <button
                  type="button"
                  className="typo-button-b text-grey-color-3 disabled:opacity-40"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!trimmedReply || isPostingComment}
                >
                  등록
                </button>
              </div>
            </div>
          )}

          {comment.children && comment.children.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              {renderComments(comment.children, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-white-color">
      <div className="flex justify-center">
        <div className="w-full max-w-[918px] flex flex-col">
          <section className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-[65px] items-center justify-center rounded-full bg-light-color-3 px-3 py-1 text-grey-color-3 typo-caption-sb">
                {reviewCategoryLabel}
              </span>
              {showPopularChip && (
                <span className="hidden md:inline-flex w-[65px] items-center justify-center rounded-full bg-main-color-3 px-3 py-1 text-main-color-1 typo-caption-sb">
                  인기
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <h1 className="text-[18px] font-bold leading-[1.5] text-black-color md:typo-review-title">
                {reviewDetail.title}
              </h1>

              <div className="hidden md:flex items-center gap-2 pr-2">
                <button
                  type="button"
                  aria-pressed={likeState.liked}
                  onClick={handleToggleLike}
                  disabled={isTogglingLike}
                  className={`p-2 transition-colors disabled:opacity-40 ${
                    likeState.liked
                      ? 'text-main-color-1'
                      : 'text-grey-color-3 hover:text-grey-color-5'
                  }`}
                >
                  <ThumbsUp className="h-[26px] w-[26px]" />
                </button>

                <button
                  type="button"
                  aria-pressed={bookmarkState.isBookmarked}
                  onClick={handleToggleBookmark}
                  disabled={isTogglingBookmark}
                  className={`p-2 transition-colors disabled:opacity-40 ${
                    bookmarkState.isBookmarked
                      ? 'text-main-color-1'
                      : 'text-grey-color-3 hover:text-grey-color-5'
                  }`}
                >
                  <Bookmark className="h-[26px] w-[26px]" />
                </button>
              </div>
            </div>
          </section>

          <section className="px-5 py-6 md:py-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-[18px]">
              <div className="flex-1 bg-[#f4f6f8] rounded-[8.5px] px-6 py-4 flex flex-col gap-4 md:gap-[18px]">
                <div className="flex items-center gap-[10.5px]">
                  <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                    신청 내역
                  </span>
                  <div className="text-[12px] font-medium text-grey-color-5 flex flex-wrap items-center gap-[6px] md:typo-body-3-1-sb">
                    {applicationMeta.map((item, index) => (
                      <React.Fragment key={`${item}-${index}`}>
                        <span>{item}</span>
                        {index < applicationMeta.length - 1 && <span>｜</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-[26px]">
                  <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                    {ratingTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                      {ratingLabel}
                    </span>
                    <StarRating
                      value={ratingValue}
                      onChange={() => {}}
                      disabled
                      className="[&>button]:p-0 [&>button>svg]:h-[17px] [&>button>svg]:w-[17px] [&>button]:mr-[3px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-[10px]">
                  <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                    {resultTitle}
                  </span>
                  <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                    {formatResultLabel(reviewDetail.result)}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-[#f4f6f8] rounded-[8.5px] px-6 py-4 flex flex-col gap-4 md:gap-[18px]">
                {isActivityReview ? (
                  <>
                    <div className="flex items-center gap-[10.5px]">
                      <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                        투자 시간
                      </span>
                      <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                        {timeInfoText}
                      </span>
                    </div>

                    <div className="flex items-center gap-[10.5px]">
                      <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                        활동 수준
                      </span>
                      <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                        {activityLevelText}
                      </span>
                    </div>

                    <div className="flex items-start gap-[10.5px]">
                      <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                        만족 영역
                      </span>
                      <div className="text-[12px] font-medium text-main-color-1 flex flex-wrap items-center gap-[6px] md:typo-body-3-1-sb">
                        {renderPipeValues(
                          satisfactionAreaValues,
                          '직무 기술/실력 성장',
                          'text-main-color-1',
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-[10.5px]">
                      <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                        {isInterviewReview ? '핵심 질문' : '핵심 어필'}
                      </span>
                      <div className="text-[12px] font-medium text-main-color-1 flex flex-wrap items-center gap-[6px] md:typo-body-3-1-sb">
                        {renderPipeValues(
                          keyFocusValues,
                          '지원 동기',
                          'text-main-color-1',
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-[10.5px]">
                      <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                        {isInterviewReview ? '어필 요소' : '참고 정보'}
                      </span>
                      <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                        {supportInfoText}
                      </span>
                    </div>

                    <div className="flex items-center gap-[10.5px]">
                      <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                        {isInterviewReview ? '면접 정황' : '서술 방식'}
                      </span>
                      <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                        {contextInfoText}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="px-5 flex flex-col gap-7 pb-[60px] pt-5 md:gap-8">
            {(reviewDetail.answers || []).length > 0 ? (
              reviewDetail.answers.map((answer, index) => {
                const structured = isStructuredAnswer(answer)
                const title = structured
                  ? (answer.question?.title ?? `질문 ${index + 1}`)
                  : `질문 ${index + 1}`
                const content = structured
                  ? renderAnswerText(answer)
                  : String(answer)
                const noteStyle = structured && isNoteAnswer(title)

                return (
                  <div
                    key={structured ? answer.id : `answer-${index}`}
                    className="bg-white rounded-[8px] flex flex-col gap-4 md:border md:border-[#ccc] md:p-6"
                  >
                    {noteStyle ? (
                      <>
                        <div className="border-b border-[#ccc] pb-2 md:pb-4">
                          <p className="text-[15px] font-bold text-[#515151] md:typo-body-1-b">
                            {title}
                          </p>
                        </div>
                        <p className="text-[14px] leading-[25px] text-grey-color-4 whitespace-pre-line md:typo-body-2-3-m md:leading-[30px]">
                          {content}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-5 md:hidden">
                          <span className="text-[15px] font-bold text-main-color-1">
                            Q.
                          </span>
                          <div className="border-b border-[#ccc] pb-2">
                            <p className="text-[15px] font-bold text-[#515151]">
                              {title}
                            </p>
                          </div>
                          <p className="text-[14px] leading-[25px] text-grey-color-4 whitespace-pre-line">
                            {content}
                          </p>
                        </div>

                        <div className="hidden md:flex items-start gap-[6px]">
                          <span className="typo-body-1-b text-main-color-1">
                            Q.
                          </span>
                          <div className="flex-1 border-b border-[#ccc] pb-4">
                            <span className="typo-body-1-b text-[#515151]">
                              {title}
                            </span>
                          </div>
                        </div>

                        <div className="hidden md:flex items-start gap-3 pt-4">
                          <span className="typo-body-2-3-m text-grey-color-4">
                            A.
                          </span>
                          <p className="typo-body-2-3-m text-grey-color-4 leading-[30px] whitespace-pre-line">
                            {content}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="typo-body-2-3-m text-grey-color-4">
                아직 작성된 답변이 없습니다.
              </div>
            )}
          </section>

          <section className="flex flex-col gap-8 pb-10">
            <div className="px-5">
              <div className="flex items-center gap-2 typo-title-2 text-black-color">
                <span>댓글</span>
                <span className="text-main-color-1">{commentCount}</span>
              </div>
            </div>

            <div className="px-5">
              <div className="flex items-center gap-4 border border-light-color-3 rounded-[8px] px-4 py-4 text-[14px] text-grey-color-3 md:typo-body-2-3-m">
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-grey-color-1"
                  placeholder="댓글을 입력하세요"
                  value={commentInput}
                  onChange={(event) => setCommentInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSubmitComment()
                    }
                  }}
                />
                <button
                  type="button"
                  className="text-[14px] font-semibold text-grey-color-3 md:typo-body-2-2-sb disabled:opacity-40"
                  onClick={handleSubmitComment}
                  disabled={!trimmedComment || isPostingComment}
                >
                  등록
                </button>
              </div>
            </div>

            <div className="px-5">
              {isCommentsLoading ? (
                <div className="py-6 text-grey-color-3 typo-body-2-3-m">
                  댓글을 불러오는 중...
                </div>
              ) : commentCount > 0 ? (
                <div className="flex flex-col">
                  {renderComments(comments ?? [], 0)}
                </div>
              ) : (
                <div className="py-[88px] text-center typo-body-2-2-sb text-grey-color-1">
                  댓글을 작성해주세요
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
