'use client'

import * as React from 'react'
import Image from 'next/image'
import MobileFilterBar from '@/components/molecules/filterBar/MobileFilterBar'
import { MultiDropDown } from '@/components/molecules/multiDropDown/MultiDropDown'
import { PaginationWithHook } from '@/components/molecules/pagination'
import BlogReview from '@/components/organisms/blogReview'
import { useBlogReviewSearch } from '@/features/blog-review/queries'
import { PART_OPTIONS } from '@/shared/constants/filters'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'

interface ClubDetailBlogReviewContentProps {
  clubId: number
}

const TYPE_FILTER_OPTIONS = [
  {
    title: '후기종류',
    options: [
      { label: '전체', value: 'all' },
      { label: '서류후기', value: 'DOCUMENT' },
      { label: '면접후기', value: 'INTERVIEW' },
    ],
  },
]

export default function ClubDetailBlogReviewContent({
  clubId,
}: ClubDetailBlogReviewContentProps) {
  const { isDesktop } = useMediaQuery()

  const [page, setPage] = useQueryState('page')
  const [type, setType] = useQueryState('type')
  const [generation, setGeneration] = useQueryState('generation')
  const [part, setPart] = useQueryState('part')

  const currentPage = React.useMemo(() => parseInt(page || '0'), [page])

  const typeArray = React.useMemo(() => {
    if (type === 'all') {
      return ['all']
    }
    if (type === null || type === undefined) {
      return []
    }
    return type ? type.split(',').filter(Boolean) : []
  }, [type])

  const partArray = React.useMemo(() => {
    if (part === 'all') {
      return ['all']
    }
    if (part === null || part === undefined) {
      return []
    }
    return part ? part.split(',').filter(Boolean) : []
  }, [part])

  const handleTypeChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setType('all')
      } else {
        setType(values.length > 0 ? values.join(',') : null)
      }
    },
    [setType],
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
    setType(null)
    setGeneration(null)
    setPart(null)
  }, [setType, setGeneration, setPart])

  const { data: allBlogReviewsData } = useBlogReviewSearch({
    clubId: Number(clubId),
    page: 0,
    size: 200,
  })

  // 데이터에서 사용 가능한 generation 값들을 추출하여 필터 옵션 생성
  const GENERATION_FILTER_OPTIONS = React.useMemo(() => {
    if (!allBlogReviewsData?.content) {
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
        allBlogReviewsData.content
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
  }, [allBlogReviewsData])

  const generationArray = React.useMemo(() => {
    if (generation === 'all') {
      return ['all']
    }
    if (generation === null || generation === undefined) {
      return []
    }
    return generation ? generation.split(',').filter(Boolean) : []
  }, [generation])

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

  const { data: blogReviewsData } = useBlogReviewSearch({
    clubId: Number(clubId),
    page: currentPage,
    size: 200,
    sort: 'POPULAR',
    generation:
      generation && generation !== 'all' ? parseInt(generation) : undefined,
  })

  const filteredReviews = React.useMemo(() => {
    const content = blogReviewsData?.content ?? []
    let filtered = content

    // 파트 필터링
    if (part && part !== 'all') {
      const partArray = part.split(',').filter(Boolean)
      filtered = filtered.filter((review) => partArray.includes(review.jobName))
    }

    return filtered
  }, [blogReviewsData, part])

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setPage((newPage - 1).toString())
    },
    [setPage],
  )

  const totalPages = blogReviewsData?.totalPages ?? 0

  return (
    <div className={`w-full ${isDesktop ? 'pt-10' : 'pt-6'}`}>
      {/* 필터 */}
      {isDesktop ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <MultiDropDown
              groups={TYPE_FILTER_OPTIONS}
              value={typeArray}
              onChange={handleTypeChange}
              placeholder="후기종류"
              maxSummary={1}
              className="w-auto"
            />
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
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between gap-2">
          <MobileFilterBar
            tabs={[
              {
                id: 'type',
                label: '후기종류',
                type: 'multi',
                options: TYPE_FILTER_OPTIONS,
                value: typeArray,
                defaultValue: [],
                onChange: (value) => handleTypeChange(value as string[]),
                onReset: () => setType(null),
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

      {filteredReviews && filteredReviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
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
                onDetailClick={undefined}
              >
                <BlogReview.Thumbnail />
                <BlogReview.Tags />
                <BlogReview.Title />
                <BlogReview.Description />
                <BlogReview.BlogName />
                <BlogReview.BookmarkButton />
              </BlogReview>
            ))}
          </div>
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
        </>
      ) : (
        <div className="text-center py-20 text-grey-color-4">
          블로그 후기가 없습니다.
        </div>
      )}
    </div>
  )
}
