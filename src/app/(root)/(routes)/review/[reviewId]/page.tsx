'use client'

import React, { use, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Bookmark, Heart, ThumbsUp } from 'lucide-react'
import { ProfileIcon } from '@/assets/icons'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import {
  BookmarkTargetType,
  BookmarkToggleData,
  useToggleBookmark,
} from '@/features/bookmark'
import { useToggleReviewLike } from '@/features/like'
import {
  useDeleteReviewComment,
  usePostReviewComment,
} from '@/features/review/mutations'
import { useReviewComments, useReviewDetail } from '@/features/review/queries'
import {
  ResultType,
  ReviewAnswer,
  ReviewAnswerItem,
  ReviewComment,
} from '@/features/review/types'
import { useUserProfile } from '@/features/user/queries'
import { formatDateToYYMMDD } from '@/shared/utils/dateFormat'

const RESULT_LABELS: Record<ResultType, string> = {
  [ResultType.Pass]: '합격',
  [ResultType.Failure]: '불합격',
  [ResultType.NotParticipateAfterPass]: '합격 후 참여하지 않음',
  [ResultType.Waiting]: '결과 대기중',
  [ResultType.Activity]: '활동 중',
  [ResultType.EndActivity]: '활동 종료',
}

const isStructuredAnswer = (answer: ReviewAnswerItem): answer is ReviewAnswer =>
  typeof answer === 'object' &&
  answer !== null &&
  'answerType' in answer &&
  'question' in answer

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

const renderAnswerText = (answer: ReviewAnswer) => {
  const value = answer.value

  if (Array.isArray(value)) {
    const mappedValues =
      answer.answerType === 'ARRAY_INTEGER' &&
      Array.isArray(answer.question?.elements)
        ? value.map((elementId) => {
            const element = answer.question.elements.find(
              (item) => item.id === Number(elementId),
            )
            return element?.elementTitle ?? String(elementId)
          })
        : value.map((item) => String(item))
    return mappedValues.join(', ')
  }

  if (value == null || value === '') {
    return '작성된 답변이 없습니다.'
  }

  return String(value)
}

const isNoteAnswer = (title?: string) =>
  Boolean(title && (title.includes('후기') || title.includes('TIP')))

export default function Page({
  params,
}: {
  params: Promise<{ reviewId: string }>
}) {
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
  const bookmarkType: BookmarkTargetType = 'INTERVIEW_REVIEW'
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
  const [bookmarkState, setBookmarkState] = useState<BookmarkToggleData>({
    isBookmarked: false,
    type: bookmarkType,
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
        if (context?.previous) setLikeState(context.previous)
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['reviews', 'detail', numericReviewId],
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
        if (context?.previous) setBookmarkState(context.previous)
      },
      onSuccess: (data) => {
        setBookmarkState((prev) => ({
          ...prev,
          isBookmarked: data.isBookmarked,
        }))
      },
    })

  useEffect(() => {
    if (!reviewDetail) return
    setLikeState({
      liked: reviewDetail.liked ?? false,
      likeCount: reviewDetail.likeCount ?? 0,
    })
    setBookmarkState({
      isBookmarked: reviewDetail.isBookmarked ?? false,
      type: bookmarkType,
      targetId: numericReviewId,
    })
  }, [bookmarkType, numericReviewId, reviewDetail])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-color-2 flex items-center justify-center">
        <div className="text-center">
          <div className="typo-body-1-2-m text-grey-color-1">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (isError || !reviewDetail) {
    return (
      <div className="min-h-screen bg-light-color-2 flex items-center justify-center">
        <div className="text-center">
          <div className="typo-body-1-2-m text-grey-color-1">
            리뷰를 찾을 수 없습니다
          </div>
        </div>
      </div>
    )
  }

  const ratingValue = Number.isFinite(reviewDetail.rate) ? reviewDetail.rate : 0
  const countVisibleComments = (items: typeof comments): number => {
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
  const appealTags = (reviewDetail.answers || [])
    .filter(isStructuredAnswer)
    .map((answer) => answer.question?.title)
    .filter((title): title is string => Boolean(title))
    .slice(0, 4)
  const keyQuestions = (reviewDetail.answers || [])
    .filter(isStructuredAnswer)
    .map((answer) => answer.question?.title)
    .filter((title): title is string => Boolean(title))
    .slice(0, 3)
  const trimmedComment = commentInput.trim()
  const trimmedReply = replyInput.trim()

  const renderCommentContent = (comment: ReviewComment) =>
    comment.deleted ? '삭제된 댓글입니다.' : comment.content

  const handleToggleLike = () => {
    if (isTogglingLike) return
    toggleReviewLike(numericReviewId)
  }

  const handleToggleBookmark = () => {
    if (isTogglingBookmark) return
    toggleBookmark({
      targetId: numericReviewId,
      type: bookmarkType,
    })
  }

  const handleSubmitComment = () => {
    if (!trimmedComment || isPostingComment) return
    postComment({
      reviewId: numericReviewId,
      content: trimmedComment,
      parentCommentId: null,
    })
  }

  const handleReplySubmit = (parentCommentId: number) => {
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

  const renderComments = (items: ReviewComment[], depth = 0) => {
    return items.map((comment) => {
      const canReply = !comment.deleted
      const canDelete =
        !comment.deleted && userProfile?.nickname === comment.nickname
      const leftPadding = depth * 24

      return (
        <div
          key={comment.id}
          className="flex flex-col gap-4 py-6 border-b border-light-color-3"
          style={depth > 0 ? { paddingLeft: leftPadding } : undefined}
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center rounded-full border border-light-color-3 bg-light-color-2">
              {comment.profileImageUrl ? (
                <img
                  src={comment.profileImageUrl}
                  alt={`${comment.nickname} 프로필`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProfileIcon className="h-6 w-6 text-grey-color-3" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="typo-body-2-2-sb text-black-color">
                {comment.nickname}
              </div>
              <p className="text-[14px] leading-[1.5] text-grey-color-4 md:typo-body-2-3-m md:leading-6 whitespace-pre-line">
                {renderCommentContent(comment)}
              </p>
              <div className="flex items-center gap-2 text-[14px] text-grey-color-3 md:typo-button-m">
                <span>{formatDateToYYMMDD(comment.createDate)}</span>
                {canReply && (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-grey-color-2"
                    >
                      <Heart className="h-4 w-4" />
                      좋아요
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      className="text-grey-color-2"
                      onClick={() => {
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
            <div style={{ paddingLeft: 56 }}>
              <div className="flex items-center gap-3 border border-light-color-3 rounded-[8px] px-4 py-3 text-[14px] text-grey-color-3">
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
                  className="text-[14px] font-semibold text-grey-color-3 disabled:opacity-40"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!trimmedReply || isPostingComment}
                >
                  등록
                </button>
                <button
                  type="button"
                  className="text-[14px] text-grey-color-2"
                  onClick={() => {
                    setReplyTargetId(null)
                    setReplyInput('')
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
          {comment.children && comment.children.length > 0 && (
            <div className="flex flex-col">
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
              <span className="inline-flex w-[65px] items-center justify-center rounded-full bg-light-color-3 px-3 py-1 text-grey-color-3 typo-caption-sb md:hidden">
                서류
              </span>
              <span className="hidden md:inline-flex w-[65px] items-center justify-center rounded-full bg-light-color-3 px-3 py-1 text-grey-color-3 typo-caption-sb">
                면접
              </span>
              <span className="hidden md:inline-flex w-[65px] items-center justify-center rounded-full bg-[#f1eeff] px-3 py-1 text-main-color-1 typo-caption-sb">
                인기
              </span>
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
            <div className="flex flex-col gap-4 md:flex-row md:gap-[18px]">
              <div className="flex-1 bg-[#f4f6f8] rounded-[8.5px] px-6 py-4 flex flex-col gap-4 md:gap-[18px]">
                <div className="flex items-center gap-[10.5px]">
                  <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                    신청 내역
                  </span>
                  <div className="text-[12px] font-medium text-grey-color-5 flex flex-wrap items-center gap-[6px] md:typo-body-3-1-sb">
                    <span>{reviewDetail.club?.clubName}</span>
                    <span className="hidden md:inline">·</span>
                    <span className="md:hidden">｜</span>
                    <span>{reviewDetail.generation}기</span>
                    <span className="hidden md:inline">·</span>
                    <span className="md:hidden">｜</span>
                    <span>{reviewDetail.job?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-[26px]">
                  <span className="text-[13px] font-semibold text-grey-color-3 md:typo-body-3-2-m">
                    난이도
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                      {difficultyLabel(ratingValue)}
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
                    <span className="md:hidden">서류 결과</span>
                    <span className="hidden md:inline">면접 결과</span>
                  </span>
                  <span className="text-[12px] font-medium text-grey-color-5 md:typo-body-3-1-sb">
                    {formatResultLabel(reviewDetail.result)}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-[#f4f6f8] rounded-[8.5px] px-6 py-4 flex flex-col gap-4 md:gap-[18px]">
                <div className="flex flex-wrap items-center gap-[10.5px]">
                  <span className="text-[13px] font-semibold text-grey-color-3 md:hidden">
                    핵심 어필
                  </span>
                  <span className="hidden md:inline typo-body-3-2-m text-grey-color-3">
                    핵심 질문
                  </span>
                  <div className="text-[12px] font-medium text-main-color-1 flex flex-wrap items-center gap-[6px] md:hidden">
                    {appealTags.length > 0 ? (
                      appealTags.map((tag, index) => (
                        <React.Fragment key={tag}>
                          <span>{tag}</span>
                          {index < appealTags.length - 1 && <span>｜</span>}
                        </React.Fragment>
                      ))
                    ) : (
                      <span>지원 동기</span>
                    )}
                  </div>
                  <div className="hidden md:flex typo-body-3-1-sb text-main-color-1 flex-wrap items-center gap-[6px]">
                    {keyQuestions.length > 0 ? (
                      keyQuestions.map((tag, index) => (
                        <React.Fragment key={tag}>
                          <span>{tag}</span>
                          {index < keyQuestions.length - 1 && <span>｜</span>}
                        </React.Fragment>
                      ))
                    ) : (
                      <span>지원 동기</span>
                    )}
                  </div>
                </div>
                <div className="md:hidden flex flex-col gap-2">
                  <div className="flex items-center gap-[10.5px]">
                    <span className="text-[13px] font-semibold text-grey-color-3">
                      참고 정보
                    </span>
                    <span className="text-[12px] font-medium text-grey-color-5">
                      공식 공고 / sns
                    </span>
                  </div>
                  <div className="flex items-center gap-[10.5px]">
                    <span className="text-[13px] font-semibold text-grey-color-3">
                      서술 방식
                    </span>
                    <span className="text-[12px] font-medium text-grey-color-5">
                      데이터 성과 수치 서술
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-[10.5px]">
                  <span className="typo-body-3-2-m text-grey-color-3">
                    어필 요소
                  </span>
                  <span className="typo-body-3-1-sb text-grey-color-5">
                    전문성 / 직무 지식
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-[10.5px]">
                  <span className="typo-body-3-2-m text-grey-color-3">
                    면접 정황
                  </span>
                  <span className="typo-body-3-1-sb text-grey-color-5">
                    무관심 / 차가움
                  </span>
                </div>
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
              ) : (comments ?? []).length > 0 ? (
                <div className="flex flex-col">
                  {renderComments(comments ?? [], 0)}
                </div>
              ) : (
                <div className="py-6 text-grey-color-3 typo-body-2-3-m">
                  아직 댓글이 없습니다.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
