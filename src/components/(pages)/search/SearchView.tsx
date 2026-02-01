'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookmarkEmptyIcon, SearchMainIcon, XIcon } from '@/assets/icons'
import { ReviewListItem } from '@/components/(pages)/review/explore/ReviewCards'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import CardOverlay from '@/components/molecules/card/CardOverlay'
import { CommunityCard } from '@/components/molecules/communityCard'
import { useBlogReviewSearch } from '@/features/blog-review/queries'
import type { BlogReviewItem } from '@/features/blog-review/types'
import { useBookmarkedClubs, useToggleBookmark } from '@/features/bookmark'
import { clubQueries } from '@/features/clubs/queries.factory'
import { reviewQueries } from '@/features/review/queries.factory'
import type { ReviewSearchItem } from '@/features/review/types'
import useDebouncedValue from '@/shared/hooks/useDebouncedValue'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'
import { cn } from '@/shared/utils/cn'

const REVIEW_TAB = {
  document: 'document',
  activity: 'activity',
  blog: 'blog',
} as const

type ReviewTabKey = keyof typeof REVIEW_TAB

type CommunityItem = {
  id: number
  category: string
  isHot?: boolean
  type?: 'QUESTION' | 'BASIC'
  title: string
  preview?: string
  nickname?: string
  timeAgo?: string
  views?: number
  likes?: number
  comments?: number
  imageUrl?: string
}

const COMMUNITY_SEED: CommunityItem[] = [
  {
    id: 1,
    category: '직장 생활',
    isHot: true,
    type: 'BASIC',
    title: '제목 넣어주세요',
    preview:
      '내용 미리보기 2줄로 넣어주세요 그런데, 나룻이 긴 농부는 소녀 편을 한 번 훑어보고는 그저 송아지 고삐를 풀어내면서, 어서들 집으로 가거라. 송진을 생채기에다 문질러 바르고는 그 달음으로 칡덩굴 있는 데로 내려가, 꽃 많이 달린 몇 줄기를 이빨로 끊어 가지고 ...',
    nickname: '닉네임',
    timeAgo: '14분 전',
    views: 200,
    likes: 200,
    comments: 200,
    imageUrl: '/images/default.svg',
  },
  {
    id: 2,
    category: '대학 생활',
    type: 'BASIC',
    title: '제목 넣어주세요',
    preview:
      '내용 미리보기 2줄로 넣어주세요 그런데, 나룻이 긴 농부는 소녀 편을 한 번 훑어보고는 그저 송아지 고삐를 풀어내면서, 어서들 집으로 가거라.',
    nickname: '닉네임',
    timeAgo: '14분 전',
    views: 200,
    likes: 200,
    comments: 200,
  },
  {
    id: 3,
    category: '자유',
    isHot: true,
    type: 'BASIC',
    title: '제목 넣어주세요',
    preview:
      '내용 미리보기 2줄로 넣어주세요 그런데, 나룻이 긴 농부는 소녀 편을 한 번 훑어보고는 그저 송아지 고삐를 풀어내면서, 어서들 집으로 가거라.',
    nickname: '닉네임',
    timeAgo: '14분 전',
    views: 200,
    likes: 200,
    comments: 200,
    imageUrl: '/images/default.svg',
  },
  {
    id: 4,
    category: '취업준비',
    isHot: true,
    type: 'QUESTION',
    title: '제목 넣어주세요',
    nickname: '닉네임',
    timeAgo: '14분 전',
    views: 200,
    likes: 200,
    comments: 200,
  },
]

function SearchTag({
  label,
  variant = 'neutral',
  className,
}: {
  label: string
  variant?: 'neutral' | 'hot' | 'accent'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1 typo-caption-2',
        variant === 'accent'
          ? 'bg-[#fe90ff]/20 text-[#fe90ff]'
          : variant === 'hot'
            ? 'bg-main-color-3 text-main-color-1'
            : 'bg-light-color-3 text-grey-color-3',
        className,
      )}
    >
      {label}
    </span>
  )
}

function SearchBlogReviewItem({
  review,
  isDesktop,
}: {
  review: BlogReviewItem
  isDesktop: boolean
}) {
  const handleClick = () => {
    if (review.url) {
      window.open(review.url, '_blank', 'noopener,noreferrer')
    }
  }

  if (isDesktop) {
    return (
      <div
        className="border-b border-light-color-3 py-8 flex gap-5 items-start cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleClick()
        }}
      >
        <div className="relative w-[224px] h-[152px] rounded-[12px] border border-light-color-3 overflow-hidden shrink-0 bg-white-color">
          <img
            src={review.imageUrl || '/images/default.svg'}
            alt={review.title}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <SearchTag label={review.clubName} />
              <SearchTag label={`${review.generation}기`} />
              <SearchTag label={review.jobName} variant="accent" />
            </div>
            <button
              type="button"
              className="flex items-center justify-center size-6 text-grey-color-3"
              aria-label="북마크"
              onClick={(event) => event.stopPropagation()}
            >
              <BookmarkEmptyIcon className="size-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="typo-body-1-2-sb text-black-color line-clamp-1">
              {review.title}
            </p>
            <p className="typo-body-3-3-r text-grey-color-5 line-clamp-2">
              {review.description || review.content || ''}
            </p>
            <p className="typo-button-m text-grey-color-3">{review.blogName}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-light-color-3 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <SearchTag label={review.clubName} className="px-2 py-[2px]" />
          <SearchTag
            label={`${review.generation}기`}
            className="px-2 py-[2px]"
          />
          <SearchTag
            label={review.jobName}
            variant="accent"
            className="px-2 py-[2px]"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center size-5 text-grey-color-3"
          aria-label="북마크"
          onClick={(event) => event.stopPropagation()}
        >
          <BookmarkEmptyIcon className="size-4" />
        </button>
      </div>
      <div
        className="mt-3 flex gap-3 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleClick()
        }}
      >
        <div className="relative size-[88px] rounded-[12px] border border-light-color-3 overflow-hidden shrink-0 bg-white-color">
          <img
            src={review.imageUrl || '/images/default.svg'}
            alt={review.title}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="typo-body-3-1-sb text-black-color line-clamp-1">
            {review.title}
          </p>
          <p className="typo-sm-body-1-5 text-grey-color-5 line-clamp-2">
            {review.description || review.content || ''}
          </p>
          <p className="typo-caption-2 text-grey-color-3">{review.blogName}</p>
        </div>
      </div>
    </div>
  )
}

export function SearchView() {
  const { isDesktop } = useMediaQuery()
  const [query, setQuery] = useQueryState('q')
  const [tab, setTab] = useQueryState('tab')
  const [reviewType, setReviewType] = useQueryState('reviewType')
  const [inputValue, setInputValue] = React.useState(query ?? '')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setInputValue(query ?? '')
  }, [query])

  const debouncedKeyword = useDebouncedValue(inputValue, 300)

  React.useEffect(() => {
    const trimmed = debouncedKeyword.trim()
    if ((query ?? '') === trimmed) return
    setQuery(trimmed ? trimmed : null)
  }, [debouncedKeyword, query, setQuery])

  const activeTab =
    tab === 'review' || tab === 'community' ? tab : ('club' as const)
  const activeReviewType: ReviewTabKey =
    reviewType === 'activity' || reviewType === 'blog' ? reviewType : 'document'

  const hasKeyword = debouncedKeyword.trim().length > 0

  const clubSize = isDesktop ? 8 : 5
  const reviewSize = isDesktop ? 7 : 3
  const blogSize = isDesktop ? 6 : 3

  const { data: clubsData } = useQuery({
    ...clubQueries.list({
      page: 0,
      size: clubSize,
      search: debouncedKeyword.trim(),
    }),
    enabled: hasKeyword,
  })

  const { data: bookmarkedClubsData } = useBookmarkedClubs()
  const toggleBookmark = useToggleBookmark()

  const bookmarkedClubIds = new Set(
    (bookmarkedClubsData?.data?.content ?? []).map((club) => club.clubId),
  )

  const handleClubBookmarkClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      event.stopPropagation()
      toggleBookmark.mutate({ targetId: clubId, type: 'CLUB' })
    },
    [toggleBookmark],
  )

  const { data: allReviewsData } = useQuery({
    ...reviewQueries.searchList({
      title: debouncedKeyword.trim(),
      page: 0,
      size: reviewSize,
    }),
    enabled: hasKeyword,
  })

  const { data: activityReviewsData } = useQuery({
    ...reviewQueries.searchList({
      title: debouncedKeyword.trim(),
      page: 0,
      size: reviewSize,
      category: 'ACTIVITY',
    }),
    enabled: hasKeyword,
  })

  const { data: blogReviewsData } = useBlogReviewSearch(
    {
      title: debouncedKeyword.trim(),
      page: 0,
      size: blogSize,
    },
    {
      enabled: hasKeyword,
    },
  )

  const clubs = clubsData?.content ?? []
  const allReviews = allReviewsData?.content ?? []
  const activityReviews = activityReviewsData?.content ?? []
  const documentReviews = allReviews.filter(
    (review) => review.category !== 'ACTIVITY',
  )
  const blogReviews = blogReviewsData?.content ?? []

  const totalReviews = hasKeyword ? (allReviewsData?.totalElements ?? 0) : 0
  const activityCount = hasKeyword
    ? (activityReviewsData?.totalElements ?? 0)
    : 0
  const documentCount = Math.max(0, totalReviews - activityCount)
  const blogCount = hasKeyword ? (blogReviewsData?.totalElements ?? 0) : 0

  const clubCount = hasKeyword ? (clubsData?.totalElements ?? clubs.length) : 0
  const reviewCount = documentCount + activityCount + blogCount

  const filteredCommunity = React.useMemo(() => {
    if (!hasKeyword) return []
    const keyword = debouncedKeyword.trim().toLowerCase()
    return COMMUNITY_SEED.filter((item) =>
      [item.title, item.preview, item.category]
        .filter(Boolean)
        .some((text) => text!.toLowerCase().includes(keyword)),
    )
  }, [debouncedKeyword, hasKeyword])

  const communityCount = filteredCommunity.length

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    setQuery(trimmed ? trimmed : null)
  }

  const handleClear = () => {
    setInputValue('')
    setQuery(null)
    inputRef.current?.focus()
  }

  const emptyState = hasKeyword ? (
    <div className="flex items-center justify-center py-14">
      <p
        className={cn(
          'text-grey-color-5',
          isDesktop ? 'typo-title-3' : 'typo-body-3-b',
        )}
      >
        “{debouncedKeyword.trim()}”에 해당하는 결과가 없습니다
      </p>
    </div>
  ) : null

  return (
    <div className="bg-white-color">
      <div className="w-full flex justify-center">
        <div
          className={cn(
            'w-full max-w-[1100px] flex flex-col gap-6',
            isDesktop ? 'px-5 py-8' : 'px-5 py-6',
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-4 w-full max-w-[675px]"
              role="search"
              aria-label="search"
            >
              <div className="flex-1 h-12 rounded-full bg-white-color flex items-center justify-between border border-main-color-1 px-4 py-3">
                <Input
                  ref={inputRef}
                  placeholder="검색어를 입력해주세요"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  aria-label="search"
                  className="bg-transparent border-none"
                />
                <SearchMainIcon
                  width={24}
                  height={24}
                  role="img"
                  aria-label="search"
                />
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center size-[34px] text-grey-color-4 hover:text-black-color transition-colors"
                aria-label="clear"
              >
                <XIcon width={24} height={24} role="img" aria-label="clear" />
              </button>
            </form>
          </div>

          <UnderLineTab
            className="w-full max-w-[1060px] mx-auto"
            value={activeTab}
            onValueChange={(value) => setTab(value)}
            tabs={[
              {
                value: 'club',
                label: `IT 동아리 ${clubCount}`,
                content: (
                  <div className="w-full">
                    {clubs.length === 0 ? (
                      emptyState
                    ) : (
                      <div
                        className={cn(
                          isDesktop
                            ? 'grid grid-cols-4 gap-4'
                            : 'flex flex-col gap-4',
                        )}
                      >
                        {clubs.map((club) => (
                          <CardOverlay
                            key={club.clubId}
                            club={club}
                            isSubscribed={bookmarkedClubIds.has(club.clubId)}
                            onBookmarkClick={handleClubBookmarkClick}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                value: 'review',
                label: `후기 ${reviewCount}`,
                content: (
                  <div className="w-full">
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Button
                        variant="outlined-primary"
                        size="small"
                        className={cn(
                          'typo-caption-1',
                          activeReviewType === 'document'
                            ? 'bg-main-color-3 text-main-color-1 border-main-color-1'
                            : 'border-light-color-3 text-grey-color-4',
                        )}
                        onClick={() => setReviewType(REVIEW_TAB.document)}
                      >
                        서류/면접 후기 {documentCount}
                      </Button>
                      <Button
                        variant="outlined-primary"
                        size="small"
                        className={cn(
                          'typo-caption-1',
                          activeReviewType === 'activity'
                            ? 'bg-main-color-3 text-main-color-1 border-main-color-1'
                            : 'border-light-color-3 text-grey-color-4',
                        )}
                        onClick={() => setReviewType(REVIEW_TAB.activity)}
                      >
                        활동 후기 {activityCount}
                      </Button>
                      <Button
                        variant="outlined-primary"
                        size="small"
                        className={cn(
                          'typo-caption-1',
                          activeReviewType === 'blog'
                            ? 'bg-main-color-3 text-main-color-1 border-main-color-1'
                            : 'border-light-color-3 text-grey-color-4',
                        )}
                        onClick={() => setReviewType(REVIEW_TAB.blog)}
                      >
                        블로그 후기 {blogCount}
                      </Button>
                    </div>

                    {activeReviewType === 'blog' ? (
                      <div className="mt-4">
                        {blogReviews.length === 0 ? (
                          emptyState
                        ) : (
                          <div className="flex flex-col">
                            {blogReviews.map((review) => (
                              <SearchBlogReviewItem
                                key={review.reviewId}
                                review={review}
                                isDesktop={isDesktop}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        {(activeReviewType === 'activity'
                          ? activityReviews
                          : documentReviews
                        ).length === 0 ? (
                          emptyState
                        ) : (
                          <div className="flex flex-col">
                            {(activeReviewType === 'activity'
                              ? activityReviews
                              : documentReviews
                            ).map((review: ReviewSearchItem) => (
                              <ReviewListItem
                                key={review.reviewId}
                                review={review}
                                isDesktop={isDesktop}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                value: 'community',
                label: `커뮤니티 ${communityCount}`,
                content: (
                  <div className="w-full">
                    {filteredCommunity.length === 0 ? (
                      emptyState
                    ) : (
                      <div className="flex flex-col">
                        {filteredCommunity.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              'border-b border-light-color-3',
                              isDesktop ? 'py-8' : 'py-4',
                            )}
                          >
                            <div className="flex items-center gap-1 mb-3">
                              <SearchTag label={item.category} />
                              {item.isHot && (
                                <SearchTag label="인기" variant="hot" />
                              )}
                            </div>
                            <CommunityCard className="group" type="horizontal">
                              <CommunityCard.Content>
                                <CommunityCard.Title>
                                  {item.type === 'QUESTION' && (
                                    <span className="text-main-color-1 mr-1">
                                      Q.
                                    </span>
                                  )}
                                  {item.title}
                                </CommunityCard.Title>
                                <CommunityCard.Description>
                                  {item.preview}
                                </CommunityCard.Description>
                                <CommunityCard.Meta
                                  nickname={item.nickname}
                                  timeAgo={item.timeAgo}
                                  views={item.views}
                                  likes={item.likes}
                                  comments={item.comments}
                                  className="mt-2"
                                />
                              </CommunityCard.Content>
                              {item.imageUrl && (
                                <CommunityCard.Image
                                  logoUrl={item.imageUrl}
                                  alt={item.title}
                                />
                              )}
                            </CommunityCard>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchView
