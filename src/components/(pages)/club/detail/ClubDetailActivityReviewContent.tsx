'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import MobileFilterBar from '@/components/molecules/filterBar/MobileFilterBar'
import { MultiDropDown } from '@/components/molecules/multiDropDown/MultiDropDown'
import { PaginationWithHook } from '@/components/molecules/pagination'
import type { TabOption } from '@/components/molecules/tab/Tab'
import TabOverlay from '@/components/molecules/tab/TabOverlay'
import Review from '@/components/organisms/review/Review'
import { useToggleBookmark } from '@/features/bookmark'
import { ClubDetailsData, ClubRecruitsData } from '@/features/clubs/types'
import { useSearchReviews } from '@/features/review/queries'
import AppPath from '@/shared/configs/appPath'
import { PART_OPTIONS, SORT_OPTIONS } from '@/shared/constants/filters'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'

interface ClubDetailActivityReviewContentProps {
  clubId: number
  clubDetails: ClubDetailsData | undefined
  recruitsData: ClubRecruitsData | null
}

export default function ClubDetailActivityReviewContent({
  clubId,
}: ClubDetailActivityReviewContentProps) {
  const router = useRouter()
  const toggleBookmark = useToggleBookmark()
  const { isDesktop } = useMediaQuery()

  const [page, setPage] = useQueryState('page')
  const [generation, setGeneration] = useQueryState('generation')
  const [part, setPart] = useQueryState('part')
  const [sort, setSort] = useQueryState('sort')

  const currentPage = React.useMemo(() => parseInt(page || '0'), [page])
  const currentSort = React.useMemo(() => sort || '인기순', [sort])

  // generation 필터 없이 전체 데이터를 불러와서 사용 가능한 generation 목록 추출
  const { data: allActivityReviewsData } = useSearchReviews({
    clubId: Number(clubId),
    category: 'ACTIVITY',
    page: 0,
    size: 200,
  })

  // 데이터에서 사용 가능한 generation 값들을 추출하여 필터 옵션 생성
  const GENERATION_FILTER_OPTIONS = React.useMemo(() => {
    if (!allActivityReviewsData?.content) {
      return [
        {
          title: '기수',
          options: [{ label: '전체', value: 'all' }],
        },
      ]
    }

    // 모든 generation 값 추출 및 중복 제거
    const generations = Array.from(
      new Set(
        allActivityReviewsData.content
          .map((review) => review.generation)
          .filter((gen): gen is number => gen !== null && gen !== undefined),
      ),
    ).sort((a, b) => a - b) // 오름차순 정렬

    return [
      {
        title: '기수',
        options: [
          { label: '전체', value: 'all' },
          ...generations.map((gen) => ({
            label: `${gen}기`,
            value: gen.toString(),
          })),
        ],
      },
    ]
  }, [allActivityReviewsData])

  const generationArray = React.useMemo(() => {
    if (generation === 'all') {
      return ['all']
    }
    if (generation === null || generation === undefined) {
      return []
    }
    return generation ? generation.split(',').filter(Boolean) : []
  }, [generation])

  const partArray = React.useMemo(() => {
    if (part === 'all') {
      return ['all']
    }
    if (part === null || part === undefined) {
      return []
    }
    return part ? part.split(',').filter(Boolean) : []
  }, [part])

  const handleGenerationChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setGeneration('all')
      } else {
        setGeneration(values.length > 0 ? values.join(',') : null)
      }
    },
    [setGeneration],
  )

  const handlePartChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setPart('all')
      } else {
        setPart(values.length > 0 ? values.join(',') : null)
      }
    },
    [setPart],
  )

  const resetFilters = React.useCallback(() => {
    setGeneration(null)
    setPart(null)
    setSort(null)
  }, [setGeneration, setPart, setSort])

  // SORT_OPTIONS에서 인기순만 필터링하고 최신순 추가 (최신순, 인기순 순서)
  const ACTIVITY_SORT_OPTIONS: TabOption[] = React.useMemo(
    () => [
      { label: '최신순', value: '최신순' },
      ...SORT_OPTIONS.filter((option) => option.value === '인기순'),
    ],
    [],
  )

  const { data: activityReviewsData } = useSearchReviews({
    clubId: Number(clubId),
    category: 'ACTIVITY',
    page: currentPage,
    size: 5,
    sort: currentSort === '인기순' ? 'POPULAR' : 'RECENT',
    generation:
      generation && generation !== 'all' ? parseInt(generation) : undefined,
  })

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setPage((newPage - 1).toString())
    },
    [setPage],
  )

  return (
    <div className={`w-full ${isDesktop ? 'pt-10' : 'pt-6'}`}>
      {/* 필터 및 정렬 */}
      {isDesktop ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <MultiDropDown
              groups={GENERATION_FILTER_OPTIONS}
              value={generationArray}
              onChange={handleGenerationChange}
              placeholder="기수"
              maxSummary={1}
              className="w-auto"
            />
            <MultiDropDown
              groups={PART_OPTIONS}
              value={partArray}
              onChange={handlePartChange}
              placeholder="파트"
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
              options={ACTIVITY_SORT_OPTIONS}
              value={currentSort as '인기순' | '최신순'}
              onChange={(value) => setSort(value)}
              onReset={() => setSort('인기순')}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between gap-2">
          <MobileFilterBar
            tabs={[
              {
                id: 'sort',
                label: '정렬',
                type: 'sort',
                options: ACTIVITY_SORT_OPTIONS,
                value: currentSort,
                defaultValue: '인기순',
                onChange: (value) => setSort(value as string),
                onReset: () => setSort('인기순'),
              },
              {
                id: 'generation',
                label: '기수',
                type: 'multi',
                options: GENERATION_FILTER_OPTIONS,
                value: generationArray,
                defaultValue: [],
                onChange: (value) => handleGenerationChange(value as string[]),
                onReset: () => setGeneration(null),
              },
              {
                id: 'part',
                label: '파트',
                type: 'multi',
                options: PART_OPTIONS,
                value: partArray,
                defaultValue: [],
                onChange: (value) => handlePartChange(value as string[]),
                onReset: () => setPart(null),
              },
            ]}
            onReset={resetFilters}
          />
          <div className="flex"></div>
        </div>
      )}

      {activityReviewsData?.content &&
      activityReviewsData.content.length > 0 ? (
        <>
          <div className="space-y-4">
            {activityReviewsData.content.map((review) => (
              <Review
                key={review.reviewId || review.title}
                data={{
                  clubName: review.clubName,
                  generation: review.generation,
                  part: review.jobName,
                  rate: review.rate,
                  likeCount: review.likeCount,
                  commentCount: review.commentCount,
                  category: review.category,
                  title: review.title,
                  answerSummaries: review.answerSummaries,
                }}
                isBookmarked={false}
                onDetailClick={
                  review.reviewId
                    ? () =>
                        router.push(
                          AppPath.reviewDetail(String(review.reviewId)),
                        )
                    : undefined
                }
                onBookmarkClick={() => {
                  if (review.reviewId) {
                    toggleBookmark.mutate({
                      targetId: review.reviewId,
                      type: 'ACTIVITY_REVIEW',
                    })
                  }
                }}
              />
            ))}
          </div>
          {activityReviewsData && activityReviewsData.totalPages > 1 && (
            <div className="mt-8 mb-48">
              <PaginationWithHook
                totalPages={activityReviewsData.totalPages}
                maxVisiblePages={5}
                initialPage={currentPage + 1}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-grey-color-4">
          활동 후기가 없습니다.
        </div>
      )}
    </div>
  )
}
