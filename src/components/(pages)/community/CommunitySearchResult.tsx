'use client'

import * as React from 'react'
import { Tag } from '@/components/atoms/tag'
import { CommunityCard } from '@/components/molecules/communityCard'
import { PaginationWithHook } from '@/components/molecules/pagination'
import { useSearchPosts } from '@/features/community'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'
import { formatTimeAgo } from '@/shared/utils/dateFormat'

interface CommunitySearchResultProps {
  keyword: string
  onTotalElementsChange?: (totalElements: number) => void
}

export default function CommunitySearchResult({
  keyword,
  onTotalElementsChange,
}: CommunitySearchResultProps) {
  const { isDesktop } = useMediaQuery()
  const [currentPage, setCurrentPage] = React.useState(0)

  React.useEffect(() => {
    setCurrentPage(0)
  }, [keyword])

  const { data: searchedPostsData, isLoading } = useSearchPosts({
    keyword,
    page: currentPage,
    size: 8,
  })

  const searchedPosts = searchedPostsData?.content || []
  const totalPages = searchedPostsData?.totalPages ?? 0
  const totalElements = searchedPostsData?.totalElements ?? 0

  React.useEffect(() => {
    onTotalElementsChange?.(totalElements)
  }, [onTotalElementsChange, totalElements])

  const handlePageChange = React.useCallback((newPage: number) => {
    setCurrentPage(newPage - 1)
  }, [])

  return (
    <div
      className={cn(
        'mt-4 mb-28 max-w-[800px] mx-auto w-full',
        !isDesktop && 'px-5',
      )}
    >
      <div>
        {isLoading ? (
          <div className="pt-20 typo-body-3-3-r text-grey-color-4">
            검색 중...
          </div>
        ) : searchedPosts.length === 0 ? (
          <div className="pt-20">
            <p className="typo-body-1-b text-grey-color-4">
              <span className="text-main-color-1">{keyword}</span> 에 대한 검색
              결과가 없어요
            </p>
            <p className="mt-2 typo-body-2-3-m text-grey-color-4">
              검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해
              보세요.
            </p>
            <p className="typo-body-2-3-m text-grey-color-4">
              두 단어 이상을 검색하신 경우, 정확하게 띄어쓰기를 한 후 검색해
              보세요.
            </p>
          </div>
        ) : (
          <>
            {searchedPosts.map((post) => (
              <CommunityCard
                key={post.postId}
                type="horizontal"
                postType={post.postType}
                postId={post.postId}
                className={cn(
                  'gap-6 pt-8 group cursor-pointer relative',
                  isDesktop ? 'gap-6' : 'gap-4',
                )}
              >
                <CommunityCard.Content className="flex-col">
                  <div className="flex flex-row gap-[5px] mb-2">
                    <Tag
                      label={post.categoryName}
                      kind="blogReview"
                      size={isDesktop ? 'large' : 'small'}
                      className="shrink-0"
                    />
                  </div>
                  <CommunityCard.Title>{post.title}</CommunityCard.Title>
                  <CommunityCard.Description>
                    {post.excerpt}
                  </CommunityCard.Description>
                  <CommunityCard.Meta
                    nickname={post.authorNickname}
                    timeAgo={formatTimeAgo(post.createdAt)}
                    views={post.viewCount}
                    likes={post.likeCount}
                    comments={post.commentCount}
                    className="mt-4"
                  />
                </CommunityCard.Content>
                <CommunityCard.Image
                  logoUrl={post.thumbnailUrl}
                  alt={post.title}
                />
              </CommunityCard>
            ))}
            {totalPages > 1 && (
              <div className="mt-8">
                <PaginationWithHook
                  totalPages={totalPages}
                  maxVisiblePages={5}
                  initialPage={currentPage + 1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
