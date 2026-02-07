'use client'

import React from 'react'
import { BlogReview } from '@/components/organisms/blogReview'
import { useBlogReviewSearch } from '@/features/blog-review'
import { BlogReviewSearchRequest } from '@/features/blog-review/types'

export interface BlogReviewListProps {
  filters?: BlogReviewSearchRequest
  className?: string
}

export const BlogReviewList: React.FC<BlogReviewListProps> = ({
  filters = {},
  className,
}) => {
  const { data, isPending, isError, error } = useBlogReviewSearch({
    sort: 'POPULAR',
    ...filters,
  })

  if (isPending) {
    return (
      <div className={className}>
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-main-color-1 border-t-transparent rounded-full animate-spin"></div>
          <p className="typo-body-2-r text-grey-color-4 mt-4">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={className}>
        <div className="text-center py-20">
          <p className="typo-body-2-r text-red-500">
            블로그 리뷰를 불러오는데 실패했습니다.
          </p>
          <p className="typo-body-3-r text-grey-color-4 mt-2">
            {error?.message || '잠시 후 다시 시도해주세요.'}
          </p>
        </div>
      </div>
    )
  }

  if (!data || data.content.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-20">
          <p className="typo-body-2-r text-grey-color-4">
            검색 결과가 없습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {data.content.map((review) => (
          <BlogReview
            key={review.reviewId}
            data={{
              reviewId: review.reviewId,
              clubName: review.clubName,
              generation: review.generation,
              part: review.jobName,
              title: review.title,
              content: review.content,
              description: review.description,
              url: review.url,
              thumbnailUrl: review.imageUrl,
              blogName: review.blogName,
            }}
            isBookmarked={review.isBookmarked}
          />
        ))}
      </div>

      {/* 페이지네이션 정보 */}
      {data && (
        <div className="mt-6 text-center">
          <p className="typo-body-4-r text-grey-color-4">
            총 {data.totalElements}개의 블로그 리뷰 ({data.number + 1}/
            {data.totalPages} 페이지)
          </p>
        </div>
      )}
    </div>
  )
}

export default BlogReviewList
