'use client'

import React, { useState, useRef } from 'react'
import {
  ThumbsUp,
  MessageCircle,
  Link2 as LinkIcon,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ProfileIcon } from '@/assets/icons'
import { Button } from '@/components/atoms/Button/button'
import { DeleteConfirmDialog } from '@/components/molecules/deleteConfirmDialog'
import { ImageLightbox } from '@/components/molecules/imageLightbox'
import {
  usePostDetail,
  usePostComments,
  usePostPostComment,
  usePutPatchPostComment,
  useDeletePostComment,
  useTogglePostLike,
  useDeletePost,
  type PostComment,
} from '@/features/community'
import { useUserProfile } from '@/features/user/queries'
import AppPath from '@/shared/configs/appPath'
import { cn } from '@/shared/utils/cn'
import { formatDateToYYMMDD } from '@/shared/utils/dateFormat'

export default function CommunityDetailView() {
  const params = useParams()
  const router = useRouter()
  const postId = params.postId as string
  const [commentInput, setCommentInput] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    type: 'post' | 'comment'
    commentId: number | null
  }>({ open: false, type: 'post', commentId: null })
  const imageScrollRef = useRef<HTMLDivElement>(null)
  const isSubmittingCommentRef = useRef(false)
  const commentInputRef = useRef<HTMLInputElement | null>(null)
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null)
  const [replyInput, setReplyInput] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)

  const { data: post, isLoading, error } = usePostDetail(postId)
  const { data: comments, isLoading: isCommentsLoading } =
    usePostComments(postId)
  const { data: userProfile } = useUserProfile()
  const { mutate: postComment, isPending: isPostingComment } =
    usePostPostComment(postId, {
      onSuccess: () => setCommentInput(''),
    })
  const { mutate: patchComment, isPending: isPatchingComment } =
    usePutPatchPostComment(postId, {
      onSuccess: () => {
        setEditingCommentId(null)
        setCommentInput('')
      },
    })
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeletePostComment(postId, {
      onSuccess: () => setDeleteConfirm((prev) => ({ ...prev, open: false })),
    })
  const { mutate: toggleLike, isPending: isTogglingLike } =
    useTogglePostLike(postId)
  const { mutate: deletePostMutation, isPending: isDeletingPost } =
    useDeletePost(postId, {
      onSuccess: () => {
        setDeleteConfirm((prev) => ({ ...prev, open: false }))
        router.push(AppPath.community())
      },
    })

  const scrollImages = (direction: 'left' | 'right') => {
    const el = imageScrollRef.current
    if (!el) return
    el.scrollBy({
      left: direction === 'left' ? -312 : 312,
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-20">
          <p className="typo-body-2-r text-grey-color-3">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-20">
          <p className="typo-body-2-r text-grey-color-3">
            게시글을 불러올 수 없습니다.
          </p>
          <Button
            variant="outlined-primary"
            size="medium"
            onClick={() => router.back()}
            className="mt-4"
          >
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60) // 분 단위

    if (diff < 60) return `${diff}분 전`
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
    if (diff < 10080) return `${Math.floor(diff / 1440)}일 전`

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('링크가 복사되었습니다.')
  }

  const countVisibleComments = (items: PostComment[] | undefined): number => {
    if (!items) return 0
    return items.reduce((sum, comment) => {
      const selfCount = comment.isDeleted ? 0 : 1
      const childCount = comment.children?.length
        ? countVisibleComments(comment.children)
        : 0
      return sum + selfCount + childCount
    }, 0)
  }
  const commentCount =
    comments != null ? countVisibleComments(comments) : post.comment_count

  const renderCommentContent = (comment: PostComment) =>
    comment.isDeleted ? '삭제된 댓글입니다.' : comment.content

  const trimmedComment = commentInput.trim()
  const trimmedReply = replyInput.trim()

  const handleSubmitComment = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (
      !trimmedComment ||
      isPostingComment ||
      isPatchingComment ||
      isSubmittingCommentRef.current
    )
      return
    isSubmittingCommentRef.current = true
    if (editingCommentId != null) {
      patchComment(
        { commentId: editingCommentId, data: { content: trimmedComment } },
        {
          onSettled: () => {
            isSubmittingCommentRef.current = false
          },
        },
      )
    } else {
      postComment(
        { content: trimmedComment },
        {
          onSettled: () => {
            isSubmittingCommentRef.current = false
          },
        },
      )
    }
  }

  const handleReplySubmit = (parentCommentId: number, e?: React.FormEvent) => {
    e?.preventDefault()
    if (!trimmedReply || isPostingComment || isSubmittingCommentRef.current)
      return
    isSubmittingCommentRef.current = true
    postComment(
      { content: trimmedReply, parentId: parentCommentId },
      {
        onSettled: () => {
          isSubmittingCommentRef.current = false
        },
      },
    )
    setReplyInput('')
    setReplyTargetId(null)
  }

  const handleDeleteCommentClick = (commentId: number) => {
    setDeleteConfirm({ open: true, type: 'comment', commentId })
  }

  const handleDeleteCommentConfirm = () => {
    if (deleteConfirm.commentId !== null && !isDeletingComment) {
      deleteComment(deleteConfirm.commentId)
    }
  }

  const handleStartEdit = (comment: PostComment) => {
    setEditingCommentId(comment.id)
    setCommentInput(comment.content)
    setReplyTargetId(null)
    commentInputRef.current?.focus()
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setCommentInput('')
  }

  const isMyPost = userProfile?.nickname === post.nickname

  const handleToggleLike = () => {
    if (isTogglingLike) return
    toggleLike()
  }

  const handleDeletePostClick = () => {
    setDeleteConfirm({ open: true, type: 'post', commentId: null })
  }

  const handleDeletePostConfirm = () => {
    if (!isDeletingPost) deletePostMutation()
  }

  const renderComments = (items: PostComment[], depth = 0) => {
    return items.map((comment, index) => {
      const canReply = !comment.isDeleted
      const isMyComment = userProfile?.id === comment.userId
      const canEditDelete = !comment.isDeleted && isMyComment
      const leftPadding = depth * 24
      const uniqueKey = `comment-${comment.id}-${depth}-${index}`

      return (
        <div
          key={uniqueKey}
          className={cn(
            'flex flex-col gap-4 py-6',
            depth > 0
              ? 'bg-light-color-1 rounded-[8px] px-4 mb-4'
              : 'border-b border-light-color-3',
          )}
          style={depth > 0 ? { marginLeft: leftPadding } : undefined}
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center rounded-full border border-light-color-3 bg-light-color-2 shrink-0">
              {comment.profileImageUrl ? (
                <Image
                  src={comment.profileImageUrl}
                  alt={`${comment.nickname} 프로필`}
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <ProfileIcon className="h-10 w-10 text-grey-color-3" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    'typo-body-2-2-sb shrink-0',
                    isMyComment ? 'text-main-color-1' : 'text-black-color',
                  )}
                >
                  {comment.nickname ??
                    (comment.userId ? `유저${comment.userId}` : '익명')}
                </div>
                {canEditDelete && (
                  <div className="flex items-center gap-2 text-grey-color-3 typo-body-3-3-r shrink-0">
                    <button
                      type="button"
                      className="text-grey-color-3 hover:text-grey-color-4"
                      onClick={() => handleStartEdit(comment)}
                    >
                      수정
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      className="text-grey-color-3 hover:text-grey-color-4"
                      onClick={() => handleDeleteCommentClick(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[14px] leading-[1.5] text-grey-color-4 md:typo-body-2-3-m md:leading-6 whitespace-pre-line">
                {renderCommentContent(comment)}
              </p>
              <div className="flex items-center gap-2 text-[14px] text-grey-color-3 md:typo-button-m">
                <span>{formatDateToYYMMDD(comment.createdAt)}</span>
                {canReply && editingCommentId !== comment.id && (
                  <>
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
              </div>
            </div>
          </div>
          {replyTargetId === comment.id && (
            <div style={{ paddingLeft: 56 }}>
              <form
                onSubmit={(e) => handleReplySubmit(comment.id, e)}
                className="flex items-center gap-3 border border-light-color-3 rounded-[8px] px-4 py-3 text-[14px] text-grey-color-3"
              >
                <input
                  className="flex-1 bg-transparent outline-none placeholder:text-grey-color-1"
                  placeholder="답글을 입력하세요"
                  value={replyInput}
                  onChange={(event) => setReplyInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setReplyTargetId(null)
                      setReplyInput('')
                    }
                  }}
                />
                <button
                  type="submit"
                  className="text-[14px] font-semibold text-grey-color-3 disabled:opacity-40"
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
              </form>
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
    <div className="max-w-4xl mx-auto p-6">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-6">
        {post.hotPost && (
          <button
            type="button"
            className="px-3 py-1 bg-main-color-3 text-main-color-1 rounded-full typo-caption-2"
          >
            인기
          </button>
        )}
        <button
          type="button"
          className="px-3 py-1 bg-light-color-3 text-grey-color-3 rounded-full typo-caption-2 hover:bg-light-color-3 transition-colors"
        >
          {post.categoryName}
        </button>
      </div>

      {/* 제목 */}
      <h1 className="typo-title-1 text-black-color mb-4">{post.title}</h1>

      {/* 작성자 정보 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-light-color-3 flex items-center justify-center">
            {post.authorProfileImageUrl ? (
              <Image
                src={post.authorProfileImageUrl}
                alt={post.nickname}
                className="w-full h-full object-cover rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <User className="w-5 h-5 text-grey-color-3" />
            )}
          </div>
          <span className="typo-body-3-b text-black-color">
            {post.nickname}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isMyPost && (
            <>
              <Link
                href={AppPath.communityPostEdit(postId)}
                className="px-3 py-1.5 typo-body-3-3-r text-grey-color-4 hover:text-grey-color-5"
              >
                수정
              </Link>
              <span className="text-light-color-4">|</span>
              <button
                type="button"
                onClick={handleDeletePostClick}
                disabled={isDeletingPost}
                className="px-3 py-1.5 typo-body-3-3-r text-grey-color-4 hover:text-grey-color-5 disabled:opacity-50"
              >
                삭제
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 hover:bg-light-color-2 rounded-lg transition-colors"
          >
            <LinkIcon className="w-5 h-5 text-grey-color-3" />
          </button>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="mb-6">
        <p className="typo-body-2-r text-black-color whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* 이미지 가로 나열 (304x304, overflow 시 화살표로 스크롤) */}
      {post.image_url && post.image_url.length > 0 && (
        <div className="mb-4 relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollImages('left')}
            className="shrink-0 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-5 h-5 text-white-color" />
          </button>
          <div
            ref={imageScrollRef}
            className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth flex gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {post.image_url.map((url, i) => (
              <button
                type="button"
                key={url + i}
                onClick={() => {
                  setLightboxIndex(i)
                  setLightboxOpen(true)
                }}
                className="shrink-0 w-[304px] h-[304px] rounded-lg overflow-hidden bg-light-color-1 cursor-pointer block text-left"
              >
                <Image
                  src={url}
                  alt={`게시글 이미지 ${i + 1}`}
                  width={304}
                  height={304}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollImages('right')}
            className="shrink-0 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-5 h-5 text-white-color" />
          </button>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        onConfirm={
          deleteConfirm.type === 'post'
            ? handleDeletePostConfirm
            : handleDeleteCommentConfirm
        }
        type={deleteConfirm.type}
        isPending={isDeletingPost || isDeletingComment}
      />

      {/* 이미지 확대 라이트박스 */}
      {lightboxOpen && post.image_url && (
        <ImageLightbox
          images={post.image_url}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }
          onNext={() =>
            setLightboxIndex((prev) =>
              prev < post.image_url!.length - 1 ? prev + 1 : prev,
            )
          }
        />
      )}

      {/* 통계 정보 */}
      <div className="flex items-center justify-between py-4 border-b border-light-color-4 mb-6">
        <div className="flex items-center gap-4 text-grey-color-3 typo-body-3-3-r">
          <span>{formatDate(post.create_at)}</span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <span>조회</span>
            <span>{post.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.like_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comment_count}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isTogglingLike}
          className="flex items-center gap-1 px-4 py-2 border border-light-color-4 rounded-lg hover:bg-light-color-1 transition-colors disabled:opacity-50"
        >
          <ThumbsUp
            className={`w-5 h-5 ${post.liked ? 'fill-main-color-1 text-main-color-1' : 'text-grey-color-3'}`}
          />
          <span className="typo-body-3-b text-grey-color-4">
            {post.like_count}
          </span>
        </button>
      </div>

      {/* 댓글 영역 */}
      <section className="flex flex-col gap-8 pb-10 border-light-color-4 pt-6">
        <div>
          <div className="flex items-center gap-2 typo-title-2 text-black-color">
            <span>댓글</span>
            <span className="text-main-color-1">{commentCount}</span>
          </div>
        </div>
        <div>
          <form
            onSubmit={handleSubmitComment}
            className="flex items-center gap-4 border border-light-color-3 rounded-[8px] px-4 py-4 text-[14px] text-grey-color-3 md:typo-body-2-3-m"
          >
            <input
              ref={commentInputRef}
              className="flex-1 bg-transparent outline-none placeholder:text-grey-color-1"
              placeholder={
                editingCommentId != null
                  ? '댓글을 수정하세요'
                  : '댓글을 입력하세요'
              }
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
            />
            <button
              type="submit"
              className="text-[14px] font-semibold text-grey-color-3 md:typo-body-2-2-sb disabled:opacity-40"
              disabled={
                !trimmedComment || isPostingComment || isPatchingComment
              }
            >
              {editingCommentId != null ? '수정 완료' : '등록'}
            </button>
            {editingCommentId != null && (
              <button
                type="button"
                className="text-[14px] text-grey-color-2"
                onClick={handleCancelEdit}
              >
                취소
              </button>
            )}
          </form>
        </div>
        <div>
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
  )
}
