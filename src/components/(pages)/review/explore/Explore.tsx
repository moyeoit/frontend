'use client'

import * as React from 'react'
import { MessageCircle, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import { SideBar } from '@/components/atoms/sideBar/Sidebar'
import { Card } from '@/components/molecules/card'
import MobileFilterBar from '@/components/molecules/filterBar/MobileFilterBar'
import { MultiDropDown } from '@/components/molecules/multiDropDown/MultiDropDown'
import { PaginationWithHook } from '@/components/molecules/pagination'
import TabOverlay from '@/components/molecules/tab/TabOverlay'
import { useSearchReviews } from '@/features/review/queries'
import { HERO_IMAGES } from '@/shared/constants/category'
import {
  RESULT_FILTER_OPTIONS,
  REVIEW_CATEGORY_OPTIONS,
  REVIEW_SORT_OPTIONS,
} from '@/shared/constants/reviewFilters'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'
import { cn } from '@/shared/utils/cn'

const DEFAULT_SIZE_DESKTOP = 9
const DEFAULT_SIZE_MOBILE = 6

export function Explore() {
  const { isDesktop } = useMediaQuery()
  const router = useRouter()

  const [category, setCategory] = useQueryState('category')
  const [result, setResult] = useQueryState('result')
  const [sort, setSort] = useQueryState('sort')
  const [page, setPage] = useQueryState('page')

  const currentCategory = React.useMemo(() => category || 'all', [category])
  const currentSort = React.useMemo(() => sort || '인기순', [sort])
  const currentPage = React.useMemo(() => parseInt(page || '0'), [page])

  const resultArray = React.useMemo(() => {
    if (result === 'all') return ['all']
    if (result == null) return []
    return result.split(',').filter(Boolean)
  }, [result])

  const mappedResult =
    resultArray.length === 0 || resultArray.includes('all')
      ? undefined
      : resultArray[0]

  const resetFilters = React.useCallback(() => {
    router.replace('/review/explore')
  }, [router])

  const listParams = {
    page: currentPage,
    size: isDesktop ? DEFAULT_SIZE_DESKTOP : DEFAULT_SIZE_MOBILE,
    category: currentCategory !== 'all' ? currentCategory : undefined,
    result: mappedResult,
    sort: currentSort === '최신순' ? 'RECENT' : 'POPULAR',
  }

  const {
    data: reviewsData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useSearchReviews(listParams)

  const { data: bestReviewsData } = useSearchReviews({
    page: 0,
    size: isDesktop ? 4 : 3,
    sort: 'POPULAR',
  })

  const handleResultChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setResult('all')
      } else {
        setResult(values.length > 0 ? values.join(',') : null)
      }
    },
    [setResult],
  )

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setPage((newPage - 1).toString())
    },
    [setPage],
  )

  const fieldLabel = React.useMemo(
    () =>
      REVIEW_CATEGORY_OPTIONS.find((option) => option.value === currentCategory)
        ?.label || '전체',
    [currentCategory],
  )

  const showHero = isDesktop || currentCategory === 'all'

  return (
    <div className="bg-white-color">
      {showHero && (
        <div className="relative h-[280px] flex items-end justify-center px-5 py-18 overflow-hidden">
          <Image
            src={HERO_IMAGES.all}
            alt={`${fieldLabel} 히어로 이미지`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="w-full mx-auto flex justify-center">
        {isDesktop && (
          <div className="w-54 shrink-0 px-5 py-14">
            <SideBar
              options={REVIEW_CATEGORY_OPTIONS}
              value={currentCategory}
              onChange={(value) =>
                setCategory(value === 'all' ? null : (value as string))
              }
              className="w-full h-full"
            />
          </div>
        )}

        <div
          className={`${isDesktop ? 'px-5 mt-8 pt-6 pb-12' : 'pt-4 w-full'}`}
        >
          <div className="mx-auto max-w-[calc(17.625rem*3+1rem*2)]">
            <div
              className={`flex flex-row items-center justify-between gap-2 ${isDesktop ? 'mb-12' : 'pl-5 mb-6'}`}
            >
              {isDesktop ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <MultiDropDown
                      groups={RESULT_FILTER_OPTIONS}
                      value={resultArray}
                      onChange={(value) =>
                        handleResultChange(value as string[])
                      }
                      placeholder="결과"
                      maxSummary={1}
                      className="w-auto"
                    />
                    <button
                      onClick={() => resetFilters()}
                      className="flex items-center gap-1 px-3 py-2 text-grey-color-2 typo-button-m h-[32px] cursor-pointer"
                    >
                      <Image
                        src="/icons/reset.svg"
                        alt="reset"
                        width={20}
                        height={20}
                      />
                      초기화
                    </button>
                  </div>

                  <div className="flex">
                    <TabOverlay
                      options={REVIEW_SORT_OPTIONS}
                      value={currentSort as '인기순' | '최신순'}
                      onChange={(value) => setSort(value)}
                      onReset={() => setSort('인기순')}
                    />
                  </div>
                </>
              ) : (
                <MobileFilterBar
                  tabs={[
                    {
                      id: 'sort',
                      label: '정렬',
                      type: 'sort',
                      options: REVIEW_SORT_OPTIONS,
                      value: currentSort,
                      defaultValue: '인기순',
                      onChange: (value) => setSort(value as string),
                      onReset: () => setSort('인기순'),
                    },
                    {
                      id: 'result',
                      label: '결과',
                      type: 'multi',
                      options: RESULT_FILTER_OPTIONS,
                      value: resultArray,
                      defaultValue: [],
                      onChange: (value) =>
                        handleResultChange(value as string[]),
                      onReset: () => setResult(null),
                    },
                  ]}
                  onReset={resetFilters}
                />
              )}
            </div>

            {bestReviewsData?.content && bestReviewsData.content.length > 0 && (
              <section className={`${isDesktop ? 'mb-10' : 'mb-8 px-5'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="typo-title-2">BEST 후기</h2>
                  <span className="typo-body-4-m text-grey-color-3">
                    인기순 Top {bestReviewsData.content.length}
                  </span>
                </div>
                <div
                  className={`grid ${isDesktop ? 'grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}
                >
                  {bestReviewsData.content.map((review) => (
                    <BestReviewCard key={review.title} review={review} />
                  ))}
                </div>
              </section>
            )}

            <section className={`${isDesktop ? '' : 'px-5'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="typo-title-2">블로그 후기</h2>
                {isListFetching && (
                  <span className="typo-body-4-m text-grey-color-3">
                    불러오는 중...
                  </span>
                )}
              </div>

              {isListLoading ? (
                <div className="flex items-center justify-center py-10 text-grey-color-4">
                  후기 목록을 불러오는 중입니다.
                </div>
              ) : reviewsData && reviewsData.content.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviewsData.content.map((review) => (
                    <ReviewListItem
                      key={`${review.title}-${review.clubName}`}
                      review={review}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-10 text-grey-color-4">
                  등록된 후기가 없습니다.
                </div>
              )}

              {reviewsData && reviewsData.totalPages > 1 && (
                <div className="mt-8 mb-48">
                  <PaginationWithHook
                    totalPages={reviewsData.totalPages}
                    maxVisiblePages={5}
                    initialPage={currentPage + 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function BestReviewCard({
  review,
}: {
  review: {
    reviewId?: number
    clubName: string
    jobName: string
    title: string
    answerSummaries: { answerSummary: string }[]
    rate: number
    likeCount: number
    commentCount: number
  }
}) {
  const snippet = review.answerSummaries?.[0]?.answerSummary || ''
  const meta = [review.clubName, review.jobName].filter(Boolean).join(' · ')

  const content = (
    <Card
      size="col3Desktop"
      orientation="vertical"
      border={true}
      gap="12px"
      className="group cursor-pointer relative"
    >
      <Card.Image
        logoUrl="/images/default.svg"
        alt={review.title}
        interactive
        className="transition-transform duration-300 ease-out"
      />
      <Card.Content className="px-[6px]">
        <Card.Title>{review.title}</Card.Title>
        <Card.Description>{snippet}</Card.Description>
        <div className="flex items-center gap-2 mt-2">
          <StarRating
            value={review.rate}
            onChange={() => {}}
            disabled
            className="[&>button]:p-0"
          />
          <span className="typo-body-4-m text-grey-color-3">
            {review.rate.toFixed(1)}
          </span>
        </div>
        <Card.Meta part={meta} />
        <Card.Stats likes={review.likeCount} comments={review.commentCount} />
      </Card.Content>
    </Card>
  )

  if (review.reviewId) {
    return (
      <Link href={`/review/${review.reviewId}`} className="block">
        {content}
      </Link>
    )
  }

  return content
}

function ReviewListItem({
  review,
}: {
  review: {
    reviewId?: number
    clubName: string
    jobName: string
    generation: number
    title: string
    answerSummaries: { answerSummary: string }[]
    rate: number
    likeCount: number
    commentCount: number
    category?: string
  }
}) {
  const snippet = review.answerSummaries?.[0]?.answerSummary || ''
  const href = review.reviewId ? `/review/${review.reviewId}` : '#'
  const meta = [review.clubName, `${review.generation}기`, review.jobName]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link href={href} className="block">
      <div className="w-full border border-light-color-3 rounded-2xl p-4 bg-white transition-all hover:shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="typo-body-4-m text-grey-color-3">{meta}</div>
            <div className="flex items-center gap-2">
              <StarRating
                value={review.rate}
                onChange={() => {}}
                disabled
                className="[&>button]:p-0"
              />
              <span className="typo-body-4-m text-grey-color-3">
                {review.rate.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="typo-body-1 text-black-color line-clamp-1">
            {review.title}
          </div>
          <div className="typo-body-3-3r text-grey-color-4 line-clamp-2">
            {snippet}
          </div>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'px-3 py-1 rounded-full border text-xs',
                'border-light-color-3 text-grey-color-4',
              )}
            >
              {review.category || '후기'}
            </span>
            <div className="flex items-center gap-3 text-grey-color-3 typo-caption-m">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {review.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {review.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
