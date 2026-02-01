'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StarRating } from '@/components/atoms/StarRating/StarRating'
import { SideBar } from '@/components/atoms/sideBar/Sidebar'
import MobileFilterBar from '@/components/molecules/filterBar/MobileFilterBar'
import { MultiDropDown } from '@/components/molecules/multiDropDown/MultiDropDown'
import { PaginationWithHook } from '@/components/molecules/pagination'
import TabOverlay from '@/components/molecules/tab/TabOverlay'
import { BlogReview } from '@/components/organisms/blogReview'
import Review from '@/components/organisms/review/Review'
import { useBlogReviewSearch } from '@/features/blog-review/queries'
import { useSearchReviews } from '@/features/review/queries'
import { HERO_IMAGES } from '@/shared/constants/category'
import {
  RESULT_FILTER_OPTIONS,
  REVIEW_CATEGORY_OPTIONS,
  REVIEW_SORT_OPTIONS,
} from '@/shared/constants/reviewFilters'
import AppPath from '@/shared/configs/appPath'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'
import { cn } from '@/shared/utils/cn'

// 모바일 탭 옵션
const MOBILE_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'DOCUMENT', label: '서류/면접' },
  { value: 'ACTIVITY', label: '활동' },
  { value: 'BLOG', label: '블로그' },
]

const CLUB_FILTER_OPTIONS = [
  {
    title: '동아리명',
    options: [{ label: '전체', value: 'all' }],
  },
]

const GENERATION_FILTER_OPTIONS = [
  {
    title: '기수',
    options: [{ label: '전체', value: 'all' }],
  },
]

const PART_FILTER_OPTIONS = [
  {
    title: '파트',
    options: [{ label: '전체', value: 'all' }],
  },
]

const TYPE_FILTER_OPTIONS = [
  {
    title: '종류',
    options: [
      { label: '전체', value: 'all' },
      { label: '서류', value: 'DOCUMENT' },
      { label: '면접', value: 'INTERVIEW' },
    ],
  },
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
  const [documentType, setDocumentType] = useQueryState('type')
  const [clubFilter, setClubFilter] = React.useState<string[]>([])
  const [generationFilter, setGenerationFilter] = React.useState<string[]>([])
  const [partFilter, setPartFilter] = React.useState<string[]>([])

  const currentCategory = React.useMemo(() => category || 'all', [category])
  const currentSort = React.useMemo(() => sort || '인기순', [sort])
  const currentPage = React.useMemo(() => parseInt(page || '0'), [page])
  const currentDocumentType = React.useMemo(() => {
    if (documentType === 'DOCUMENT' || documentType === 'INTERVIEW') {
      return documentType
    }
    return null
  }, [documentType])

  const isAllCategory = currentCategory === 'all'
  const isBlogCategory = currentCategory === 'BLOG'
  const isDocumentCategory = currentCategory === 'DOCUMENT'
  const useBlogLayout = isAllCategory || isBlogCategory

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
    setClubFilter([])
    setGenerationFilter([])
    setPartFilter([])
    setDocumentType(null)
  }, [router, setDocumentType, setClubFilter, setGenerationFilter, setPartFilter])

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

  const {
    data: blogReviewsData,
    isLoading: isBlogLoading,
    isFetching: isBlogFetching,
  } = useBlogReviewSearch(
    {
      page: currentPage,
      size: isDesktop ? DEFAULT_SIZE_DESKTOP : DEFAULT_SIZE_MOBILE,
      sort: currentSort === '최신순' ? 'RECENT' : 'POPULAR',
    },
    { enabled: useBlogLayout },
  )

  const { data: bestReviewsData } = useSearchReviews({
    page: 0,
    size: 6,
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

  const handleTypeChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all') || values.length === 0) {
        setDocumentType(null)
      } else {
        setDocumentType(values[0])
      }
    },
    [setDocumentType],
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

  const listTitle = isAllCategory ? '블로그 후기' : fieldLabel
  const showTypeFilter = isDocumentCategory
  const showResultFilter = isDocumentCategory

  const filteredReviews = React.useMemo(() => {
    const content = reviewsData?.content ?? []
    if (!isDocumentCategory || !currentDocumentType) return content
    return content.filter(
      (review) =>
        (review.category || '').toUpperCase() === currentDocumentType,
    )
  }, [reviewsData, isDocumentCategory, currentDocumentType])

  const listContent = useBlogLayout
    ? blogReviewsData?.content ?? []
    : filteredReviews

  const listIsLoading = useBlogLayout ? isBlogLoading : isListLoading
  const listIsFetching = useBlogLayout ? isBlogFetching : isListFetching
  const totalPages = useBlogLayout
    ? blogReviewsData?.totalPages ?? 0
    : reviewsData?.totalPages ?? 0

  // BEST 후기는 전체 카테고리에서만 표시
  const showBestReviews = isAllCategory
  const bestListRef = React.useRef<HTMLDivElement | null>(null)

  const handleBestScroll = React.useCallback(
    (direction: 'left' | 'right') => {
      const list = bestListRef.current
      if (!list) return
      const card = list.querySelector<HTMLElement>('[data-best-card]')
      const styles = window.getComputedStyle(list)
      const gapValue =
        parseFloat(styles.columnGap || styles.gap || '0') || 0
      const cardWidth = card?.offsetWidth || (isDesktop ? 342 : 230)
      const delta = cardWidth + gapValue
      list.scrollBy({
        left: direction === 'left' ? -delta : delta,
        behavior: 'smooth',
      })
    },
    [isDesktop],
  )

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
          <div className={cn('mx-auto', isDesktop ? 'max-w-[802px]' : 'w-full')}>
            <div
              className={`flex flex-row items-center justify-between gap-2 ${isDesktop ? 'mb-12' : 'pl-5 mb-6'}`}
            >
              {isDesktop ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <MultiDropDown
                      groups={CLUB_FILTER_OPTIONS}
                      value={clubFilter}
                      onChange={(value) => setClubFilter(value as string[])}
                      placeholder="동아리명"
                      maxSummary={1}
                      className="w-auto"
                    />
                    <MultiDropDown
                      groups={GENERATION_FILTER_OPTIONS}
                      value={generationFilter}
                      onChange={(value) =>
                        setGenerationFilter(value as string[])
                      }
                      placeholder="기수"
                      maxSummary={1}
                      className="w-auto"
                    />
                    <MultiDropDown
                      groups={PART_FILTER_OPTIONS}
                      value={partFilter}
                      onChange={(value) => setPartFilter(value as string[])}
                      placeholder="파트"
                      maxSummary={1}
                      className="w-auto"
                    />
                    {showTypeFilter && (
                      <MultiDropDown
                        groups={TYPE_FILTER_OPTIONS}
                        value={
                          currentDocumentType ? [currentDocumentType] : []
                        }
                        onChange={(value) =>
                          handleTypeChange(value as string[])
                        }
                        placeholder="종류"
                        maxSummary={1}
                        className="w-auto"
                      />
                    )}
                    {showResultFilter && (
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
                    )}
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
                      id: 'club',
                      label: '동아리명',
                      type: 'multi',
                      options: CLUB_FILTER_OPTIONS,
                      value: clubFilter,
                      defaultValue: [],
                      onChange: (value) =>
                        setClubFilter(value as string[]),
                      onReset: () => setClubFilter([]),
                    },
                    {
                      id: 'generation',
                      label: '기수',
                      type: 'multi',
                      options: GENERATION_FILTER_OPTIONS,
                      value: generationFilter,
                      defaultValue: [],
                      onChange: (value) =>
                        setGenerationFilter(value as string[]),
                      onReset: () => setGenerationFilter([]),
                    },
                    {
                      id: 'part',
                      label: '파트',
                      type: 'multi',
                      options: PART_FILTER_OPTIONS,
                      value: partFilter,
                      defaultValue: [],
                      onChange: (value) =>
                        setPartFilter(value as string[]),
                      onReset: () => setPartFilter([]),
                    },
                    ...(showTypeFilter
                      ? [
                          {
                            id: 'type',
                            label: '종류',
                            type: 'multi' as const,
                            options: TYPE_FILTER_OPTIONS,
                            value: currentDocumentType
                              ? [currentDocumentType]
                              : [],
                            defaultValue: [],
                            onChange: (value: string[] | string) =>
                              handleTypeChange(value as string[]),
                            onReset: () => setDocumentType(null),
                          },
                        ]
                      : []),
                    ...(showResultFilter
                      ? [
                          {
                            id: 'result',
                            label: '결과',
                            type: 'multi' as const,
                            options: RESULT_FILTER_OPTIONS,
                            value: resultArray,
                            defaultValue: [],
                            onChange: (value: string[] | string) =>
                              handleResultChange(value as string[]),
                            onReset: () => setResult(null),
                          },
                        ]
                      : []),
                  ]}
                  onReset={resetFilters}
                />
              )}
            </div>

            {showBestReviews &&
              bestReviewsData?.content &&
              bestReviewsData.content.length > 0 && (
                <section className={`${isDesktop ? 'mb-12' : 'mb-8 px-5'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="typo-title-2">BEST 후기</h2>
                    {isDesktop && (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="typo-caption-2 text-grey-color-3"
                        >
                          전체보기
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleBestScroll('left')}
                            className="w-6 h-6 flex items-center justify-center text-grey-color-3 hover:text-grey-color-4"
                            aria-label="이전"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBestScroll('right')}
                            className="w-6 h-6 flex items-center justify-center text-grey-color-3 hover:text-grey-color-4"
                            aria-label="다음"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    ref={bestListRef}
                    className={cn(
                      'flex overflow-x-auto scroll-smooth',
                      isDesktop ? 'gap-4' : 'gap-3',
                      isDesktop ? 'pb-1' : 'pb-2',
                    )}
                  >
                    {bestReviewsData.content.map((review) => (
                      <BestReviewCard
                        key={review.reviewId ?? review.title}
                        review={review}
                      />
                    ))}
                  </div>
                </section>
              )}

            <section className={`${isDesktop ? '' : 'px-5'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="typo-title-2">{listTitle}</h2>
                {listIsFetching && (
                  <span className="typo-body-4-m text-grey-color-3">
                    불러오는 중...
                  </span>
                )}
              </div>

              {listIsLoading ? (
                <div className="flex items-center justify-center py-10 text-grey-color-4">
                  후기 목록을 불러오는 중입니다.
                </div>
              ) : listContent.length > 0 ? (
                <div
                  className={cn(
                    'flex flex-col',
                    useBlogLayout ? (isDesktop ? 'gap-0' : 'gap-0') : 'gap-0',
                  )}
                >
                  {listContent.map((review) => {
                    if (useBlogLayout) {
                      const blogReview = review as {
                        reviewId: number
                        clubName: string
                        generation: number
                        jobName: string
                        title: string
                        content?: string
                        description?: string | null
                        url?: string
                        imageUrl?: string
                        blogName?: string
                        isBookmarked?: boolean
                      }
                      return (
                        <BlogReview
                          key={`${blogReview.reviewId}-${blogReview.title}`}
                          data={{
                            reviewId: blogReview.reviewId,
                            clubName: blogReview.clubName,
                            generation: blogReview.generation,
                            part: blogReview.jobName,
                            title: blogReview.title,
                            content: blogReview.content,
                            description: blogReview.description,
                            url: blogReview.url,
                            thumbnailUrl: blogReview.imageUrl,
                            blogName: blogReview.blogName,
                          }}
                          isBookmarked={blogReview.isBookmarked}
                        />
                      )
                    }
                    // 서류/면접 후기 또는 기타 카테고리
                    const reviewItem = review as {
                      reviewId?: number
                      clubName: string
                      generation: number
                      jobName: string
                      rate: number
                      title: string
                      answerSummaries?: {
                        questionTitleSummary: string
                        answerSummary: string
                      }[]
                      likeCount: number
                      commentCount: number
                      category?: string
                      result?: string
                    }
                    return (
                      <Review
                        key={`${reviewItem.reviewId}-${reviewItem.title}`}
                        data={{
                          clubName: reviewItem.clubName,
                          generation: reviewItem.generation,
                          part: reviewItem.jobName,
                          rate: reviewItem.rate,
                          likeCount: reviewItem.likeCount,
                          commentCount: reviewItem.commentCount,
                          result: reviewItem.result,
                          title: reviewItem.title,
                          category: reviewItem.category,
                          answerSummaries: reviewItem.answerSummaries,
                        }}
                        onDetailClick={
                          reviewItem.reviewId
                            ? () =>
                                router.push(
                                  AppPath.reviewDetail(
                                    String(reviewItem.reviewId),
                                  ),
                                )
                            : undefined
                        }
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-10 text-grey-color-4">
                  등록된 후기가 없습니다.
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 mb-48">
                  <PaginationWithHook
                    totalPages={totalPages}
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

function BestDocumentTypeBadge({
  type,
  isDesktop,
}: {
  type?: string
  isDesktop: boolean
}) {
  const normalized = type?.toUpperCase() ?? 'DOCUMENT'
  const isInterview = normalized === 'INTERVIEW'
  const isActivity = normalized === 'ACTIVITY'
  const bgClass = isActivity
    ? 'bg-[#d8dfff]'
    : isInterview
      ? 'bg-[#fff5ad]'
      : 'bg-[#eaffe9]'
  const textClass = isActivity
    ? 'text-[#3d5eff]'
    : isInterview
      ? 'text-[#ff9500]'
      : 'text-[#2da715]'
  const label = isActivity ? '활' : isInterview ? '면' : '서'

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shrink-0',
        bgClass,
        isDesktop ? 'size-10' : 'size-8',
      )}
    >
      <span
        className={cn(
          'font-semibold',
          isDesktop ? 'typo-body-1' : 'typo-body-3-1',
          textClass,
        )}
      >
        {label}
      </span>
    </div>
  )
}

function BestReviewCard({
  review,
}: {
  review: {
    reviewId?: number
    clubName: string
    generation?: number
    jobName: string
    title: string
    answerSummaries?: { answerSummary: string }[]
    rate: number
    category?: string
  }
}) {
  const { isDesktop } = useMediaQuery()
  const snippet = review.title || review.answerSummaries?.[0]?.answerSummary || ''
  const meta = [
    review.clubName,
    review.generation ? `${review.generation}기` : null,
    review.jobName,
  ]
    .filter(Boolean)
    .join(' · ')
  const isActivity = review.category?.toUpperCase() === 'ACTIVITY'

  const card = (
    <div
      data-best-card
      className={cn(
        'bg-light-color-1 rounded-[8px] flex flex-col gap-2 cursor-pointer',
        isDesktop ? 'w-[342px] p-6' : 'w-[230px] p-4',
      )}
    >
      <div className="flex items-center gap-3">
        <BestDocumentTypeBadge type={review.category} isDesktop={isDesktop} />
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              'text-grey-color-5',
              isDesktop ? 'typo-body-4-m' : 'typo-caption-2',
            )}
          >
            {meta}
          </span>
          <div className="flex items-center gap-2">
            <StarRating
              value={review.rate}
              onChange={() => {}}
              disabled
              className="[&>button]:p-0 [&_svg]:w-[15px] [&_svg]:h-[15px]"
            />
            <span
              className={cn(
                'text-grey-color-4',
                isDesktop ? 'typo-body-4-m' : 'typo-caption-2',
              )}
            >
              {isActivity ? '만족도' : '난이도'}
            </span>
          </div>
        </div>
      </div>

      {snippet && (
        <p
          className={cn(
            'text-black-color line-clamp-2',
            isDesktop ? 'typo-button-m' : 'typo-caption-1',
          )}
        >
          {snippet}
        </p>
      )}

      <div className="flex items-center gap-1 text-grey-color-3">
        <span className={cn(isDesktop ? 'typo-caption-2' : 'typo-caption-3')}>
          자세히 보기
        </span>
        <ChevronRight className="w-3 h-3" />
      </div>

      <div className="flex items-center">
        <span className="inline-flex items-center rounded-full bg-main-color-3 px-3 py-1 text-main-color-1 typo-caption-2">
          인기
        </span>
      </div>
    </div>
  )

  if (review.reviewId) {
    return (
      <Link
        href={AppPath.reviewDetail(String(review.reviewId))}
        className="block"
      >
        {card}
      </Link>
    )
  }

  return card
}
