'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import CardOverlay from '@/components/molecules/card/CardOverlay'
import { BlogReview } from '@/components/organisms/blogReview'
import Review from '@/components/organisms/review/Review'
import {
  useBookmarkedClubs,
  useBookmarkedInterviewReviews,
  useBookmarkedActivityReviews,
  useBookmarkedBlogReviews,
  useToggleBookmark,
  type BookmarkedBlogReview,
} from '@/features/bookmark'
import AppPath from '@/shared/configs/appPath'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

export function Bookmark() {
  const router = useRouter()
  const { isDesktop } = useMediaQuery()
  const { data: bookmarkedClubsData, isPending: isClubsLoading } =
    useBookmarkedClubs()
  const {
    data: bookmarkedInterviewReviewsData,
    isPending: isInterviewReviewsLoading,
  } = useBookmarkedInterviewReviews({
    page: 0,
    size: 10,
  })
  const {
    data: bookmarkedActivityReviewsData,
    isPending: isActivityReviewsLoading,
  } = useBookmarkedActivityReviews({
    page: 0,
    size: 10,
  })
  const { data: bookmarkedBlogReviewsData, isPending: isBlogReviewsLoading } =
    useBookmarkedBlogReviews({
      page: 0,
      size: 10,
    })
  const toggleBookmark = useToggleBookmark()

  const bookmarkedClubs = bookmarkedClubsData?.data?.content || []
  const bookmarkedInterviewReviews =
    bookmarkedInterviewReviewsData?.data?.content || []
  const bookmarkedActivityReviews =
    bookmarkedActivityReviewsData?.data?.content || []
  const bookmarkedBlogReviews = bookmarkedBlogReviewsData?.data?.content || []

  const handleClubBookmarkClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      e.stopPropagation()
      toggleBookmark.mutate({
        targetId: clubId,
        type: 'CLUB',
      })
    },
    [toggleBookmark],
  )

  const handleInterviewReviewBookmarkClick = React.useCallback(
    (reviewId: number) => {
      toggleBookmark.mutate({
        targetId: reviewId,
        type: 'INTERVIEW_REVIEW',
      })
    },
    [toggleBookmark],
  )

  const handleActivityReviewBookmarkClick = React.useCallback(
    (reviewId: number) => {
      toggleBookmark.mutate({
        targetId: reviewId,
        type: 'ACTIVITY_REVIEW',
      })
    },
    [toggleBookmark],
  )

  const handleBlogReviewBookmarkClick = React.useCallback(
    (reviewId: number) => {
      console.log('🔖 북마크 페이지 - 블로그 후기 북마크 토글:', {
        reviewId,
        targetId: reviewId, // 블로그 후기 API의 reviewId를 북마크 API의 targetId로 사용
        type: 'BLOG_REVIEW',
      })
      toggleBookmark.mutate({
        targetId: reviewId, // 블로그 후기 API의 reviewId를 북마크 API의 targetId로 사용
        type: 'BLOG_REVIEW',
      })
    },
    [toggleBookmark],
  )

  const handleReviewDetailClick = React.useCallback(
    (reviewId: number) => {
      router.push(AppPath.reviewDetail(String(reviewId)))
    },
    [router],
  )

  const tabs = [
    {
      value: 'clubs',
      label: 'IT 동아리',
      content: (
        <div className="w-full">
          {isClubsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-main-color-1 border-t-transparent rounded-full animate-spin"></div>
              <p className="typo-body-2-r text-grey-color-4 mt-4">로딩 중...</p>
            </div>
          ) : bookmarkedClubs.length === 0 ? (
            <div className="text-center py-20">
              <p className="typo-body-2-r text-grey-color-4">
                북마크한 IT 동아리가 없습니다
              </p>
            </div>
          ) : (
            <div
              className={`grid ${isDesktop ? 'grid-cols-3 gap-8' : 'grid-cols-1 gap-4'}`}
            >
              {bookmarkedClubs.map((club) => (
                <CardOverlay
                  key={club.clubId}
                  club={club}
                  isSubscribed={true}
                  onBookmarkClick={handleClubBookmarkClick}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'document-interview',
      label: '서류/면접 후기',
      content: (
        <div className="w-full">
          {isInterviewReviewsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-main-color-1 border-t-transparent rounded-full animate-spin"></div>
              <p className="typo-body-2-r text-grey-color-4 mt-4">로딩 중...</p>
            </div>
          ) : bookmarkedInterviewReviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="typo-body-2-r text-grey-color-4">
                북마크한 서류/면접 후기가 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedInterviewReviews.map((review, index) => {
                const reviewId = review.reviewId
                return (
                  <Review
                    key={reviewId || index}
                    data={{
                      clubName: review.clubName || '',
                      generation: review.generation || 0,
                      part: review.jobName || '',
                      rate: review.rate || 0,
                      title: review.title || '',
                      reviewCategory: [
                        'DOCUMENT',
                        'INTERVIEW',
                        'ACTIVITY',
                      ].includes(review.reviewCategory)
                        ? (review.reviewCategory as
                            | 'DOCUMENT'
                            | 'INTERVIEW'
                            | 'ACTIVITY')
                        : undefined,
                      likeCount: review.likeCount || 0,
                      commentCount: review.commentCount || 0,
                      qaPreviews:
                        review.answerSummaries?.map((summary) => ({
                          questionTitle: summary.questionTitleSummary || '',
                          answerValue: summary.answerSummary || '',
                        })) || [],
                    }}
                    isBookmarked={true}
                    onBookmarkClick={() =>
                      handleInterviewReviewBookmarkClick(reviewId!)
                    }
                    onDetailClick={
                      reviewId
                        ? () => handleReviewDetailClick(reviewId)
                        : undefined
                    }
                  />
                )
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'activity',
      label: '활동 후기',
      content: (
        <div className="w-full">
          {isActivityReviewsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-main-color-1 border-t-transparent rounded-full animate-spin"></div>
              <p className="typo-body-2-r text-grey-color-4 mt-4">로딩 중...</p>
            </div>
          ) : bookmarkedActivityReviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="typo-body-2-r text-grey-color-4">
                북마크한 활동 후기가 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedActivityReviews.map((review, index) => {
                const reviewId = review.reviewId
                return (
                  <Review
                    key={reviewId || index}
                    data={{
                      clubName: review.clubName || '',
                      generation: review.generation || 0,
                      part: review.jobName || '',
                      rate: review.rate || 0,
                      title: review.title || '',
                      reviewCategory: [
                        'DOCUMENT',
                        'INTERVIEW',
                        'ACTIVITY',
                      ].includes(review.reviewCategory)
                        ? (review.reviewCategory as
                            | 'DOCUMENT'
                            | 'INTERVIEW'
                            | 'ACTIVITY')
                        : undefined,
                      likeCount: review.likeCount || 0,
                      commentCount: review.commentCount || 0,
                      qaPreviews:
                        review.answerSummaries?.map((summary) => ({
                          questionTitle: summary.questionTitleSummary || '',
                          answerValue: summary.answerSummary || '',
                        })) || [],
                    }}
                    isBookmarked={true}
                    onBookmarkClick={() =>
                      handleActivityReviewBookmarkClick(reviewId!)
                    }
                    onDetailClick={
                      reviewId
                        ? () => handleReviewDetailClick(reviewId)
                        : undefined
                    }
                  />
                )
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'blog',
      label: '블로그 후기',
      content: (
        <div className="w-full">
          {isBlogReviewsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-main-color-1 border-t-transparent rounded-full animate-spin"></div>
              <p className="typo-body-2-r text-grey-color-4 mt-4">로딩 중...</p>
            </div>
          ) : bookmarkedBlogReviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="typo-body-2-r text-grey-color-4">
                북마크한 블로그 후기가 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedBlogReviews
                .map((review: BookmarkedBlogReview, index: number) => {
                  // 북마크 API 응답에서 id 또는 reviewId 사용
                  const reviewId = review.id || review.reviewId

                  if (!reviewId) {
                    console.error(
                      '❌ 북마크 블로그 후기: reviewId가 없습니다.',
                      review,
                    )
                    return null
                  }

                  return (
                    <BlogReview
                      key={reviewId || `bookmark-blog-${index}`}
                      data={{
                        reviewId: reviewId,
                        clubName: review.clubName || '',
                        generation: review.generation || 0,
                        part: review.jobName || '',
                        title: review.title || '',
                        content:
                          review.answerSummaries?.[0]?.answerSummary ||
                          '내용 없음',
                        url: undefined,
                        thumbnailUrl: review.imageUrl,
                        blogName: review.blogName,
                      }}
                      isBookmarked={true}
                      onBookmarkClick={() =>
                        handleBlogReviewBookmarkClick(reviewId)
                      }
                    />
                  )
                })
                .filter(Boolean)}
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <main className="w-full min-h-screen bg-white">
      <div className="max-w-275 mx-auto px-5 py-10 desktop:py-16">
        {/* 타이틀 */}
        <h1 className="typo-title-2-1-sb text-black-color mb-8">북마크</h1>

        {/* 탭 */}
        <UnderLineTab tabs={tabs} defaultValue="clubs" />
      </div>
    </main>
  )
}
