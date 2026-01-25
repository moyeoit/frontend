'use client'

import * as React from 'react'
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
import { BlogReviewCard, ReviewListItem } from './ReviewCards'

// 모바일 탭 옵션
const MOBILE_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'DOCUMENT', label: '서류/면접' },
  { value: 'ACTIVITY', label: '활동' },
  { value: 'BLOG', label: '블로그' },
]

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

  const isAllCategory = currentCategory === 'all'
  const isBlogCategory = currentCategory === 'BLOG'
  const isDocumentCategory = currentCategory === 'DOCUMENT'
  const useBlogLayout = isAllCategory || isBlogCategory
  const useDocumentLayout = isDocumentCategory
  const listTitle = isAllCategory ? '블로그 후기' : fieldLabel

  // BEST 후기는 전체 카테고리에서만 표시
  const showBestReviews = isAllCategory
  const showHero = isDesktop || currentCategory === 'all'

  // 모바일 탭 변경 핸들러
  const handleMobileTabChange = React.useCallback(
    (value: string) => {
      setCategory(value === 'all' ? null : value)
    },
    [setCategory],
  )

  return (
    <div className="bg-white-color">
      {/* 데스크탑 히어로 이미지 */}
      {isDesktop && (
        <div className="relative h-70 flex items-end justify-center px-5 py-18 overflow-hidden">
          <Image
            src={HERO_IMAGES.all}
            alt={`${fieldLabel} 히어로 이미지`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 모바일 히어로 섹션 */}
      {!isDesktop && (
        <div className="bg-grey-color-5 flex flex-col items-center justify-center px-5 h-32">
          <p className="typo-title-2-b text-white-color w-full px-5">후기</p>
        </div>
      )}

      {/* 모바일 탭 메뉴 */}
      {!isDesktop && (
        <div className="px-5 border-b border-light-color-4">
          <div className="flex gap-1">
            {MOBILE_TAB_OPTIONS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleMobileTabChange(tab.value)}
                className={cn(
                  'px-3 py-2.5 typo-body-2-sb whitespace-nowrap',
                  currentCategory === tab.value
                    ? 'text-black-color border-b-2 border-black-color'
                    : 'text-grey-color-1',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
                      type="button"
                      onClick={() => resetFilters()}
                      className="flex items-center gap-1 px-3 py-2 text-grey-color-2 typo-button-m h-8 cursor-pointer"
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

            {showBestReviews &&
              bestReviewsData?.content &&
              bestReviewsData.content.length > 0 && (
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
                <h2 className="typo-title-2">{listTitle}</h2>
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
                <div
                  className={cn(
                    'flex flex-col',
                    useBlogLayout ? (isDesktop ? 'gap-6' : 'gap-4') : 'gap-4',
                  )}
                >
                  {reviewsData.content.map((review) => {
                    if (useBlogLayout) {
                      return (
                        <BlogReviewCard
                          key={`${review.title}-${review.clubName}`}
                          review={review}
                          isDesktop={isDesktop}
                        />
                      )
                    }
                    // 서류/면접 후기 또는 기타 카테고리
                    return (
                      <ReviewListItem
                        key={`${review.title}-${review.clubName}`}
                        review={review}
                        isDesktop={isDesktop}
                      />
                    )
                  })}
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
