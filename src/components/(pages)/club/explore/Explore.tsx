'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SideBar } from '@/components/atoms/sideBar/Sidebar'
import CardOverlay from '@/components/molecules/card/CardOverlay'
import MobileFilterBar from '@/components/molecules/filterBar/MobileFilterBar'
import { MultiDropDown } from '@/components/molecules/multiDropDown/MultiDropDown'
import TabOverlay from '@/components/molecules/tab/TabOverlay'
import { useToggleBookmark, useBookmarkedClubs } from '@/features/bookmark'
import { useExploreClubs } from '@/features/explore/queries'
import { CATEGORY_OPTIONS, HERO_IMAGES } from '@/shared/constants/category'
import {
  PART_OPTIONS,
  SORT_OPTIONS,
  TARGET_OPTIONS,
  WAY_OPTIONS,
} from '@/shared/constants/filters'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'

export function Explore() {
  const { isDesktop } = useMediaQuery()
  const router = useRouter()
  const [field, setField] = useQueryState('field')
  const [sort, setSort] = useQueryState('sort')
  const [part, setPart] = useQueryState('part')
  const [way, setWay] = useQueryState('way')
  const [target, setTarget] = useQueryState('target')

  const currentField = React.useMemo(() => field || 'all', [field])
  const currentSort = React.useMemo(() => sort || '인기순', [sort])

  const partArray = React.useMemo(() => {
    if (part === 'all') {
      // "전체" 선택 시 ['all'] 반환
      return ['all']
    }
    if (part === null || part === undefined) {
      // 초기 상태 또는 선택 없음 시 빈 배열 반환
      return []
    }
    return part ? part.split(',').filter(Boolean) : []
  }, [part])
  const wayArray = React.useMemo(() => {
    if (way === 'all') {
      // "전체" 선택 시 ['all'] 반환
      return ['all']
    }
    if (way === null || way === undefined) {
      // 초기 상태 또는 선택 없음 시 빈 배열 반환
      return []
    }
    return way ? way.split(',').filter(Boolean) : []
  }, [way])
  const targetArray = React.useMemo(() => {
    if (target === 'all') {
      // "전체" 선택 시 ['all'] 반환
      return ['all']
    }
    if (target === null || target === undefined) {
      // 초기 상태 또는 선택 없음 시 빈 배열 반환
      return []
    }
    return target ? target.split(',').filter(Boolean) : []
  }, [target])

  const handlePartChange = React.useCallback(
    (values: string[]) => {
      // "전체" 선택 시 특별한 값 "all" 사용
      if (values.includes('all')) {
        setPart('all') // "전체" 선택 시 "all"로 설정
      } else {
        setPart(values.length > 0 ? values.join(',') : null)
      }
    },
    [setPart],
  )

  const handleWayChange = React.useCallback(
    (values: string[]) => {
      // "전체" 선택 시 특별한 값 "all" 사용
      if (values.includes('all')) {
        setWay('all') // "전체" 선택 시 "all"로 설정
      } else {
        setWay(values.length > 0 ? values.join(',') : null)
      }
    },
    [setWay],
  )

  const handleTargetChange = React.useCallback(
    (values: string[]) => {
      // "전체" 선택 시 특별한 값 "all" 사용
      if (values.includes('all')) {
        setTarget('all') // "전체" 선택 시 "all"로 설정
      } else {
        setTarget(values.length > 0 ? values.join(',') : null)
      }
    },
    [setTarget],
  )

  const resetFilters = React.useCallback(() => {
    router.replace('/club/explore')
  }, [router])

  const mapCategory = (category: string): string => {
    return category
  }

  const queryParams = {
    page: 0,
    size: 14,
    field: currentField !== 'all' ? mapCategory(currentField) : undefined,
    part: part && part !== 'all' ? part : undefined,
    way: way && way !== 'all' ? way : undefined,
    target: target && target !== 'all' ? target : undefined,
    sort: currentSort,
  }

  const { data: clubsData } = useExploreClubs(queryParams)

  const { data: bookmarkedClubsData } = useBookmarkedClubs()
  const toggleBookmark = useToggleBookmark()

  const clubs = clubsData?.content || []
  const bookmarkedClubs = bookmarkedClubsData?.data?.content || []
  const bookmarkedClubIds = new Set(bookmarkedClubs.map((club) => club.clubId))

  const handleBookmarkClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      e.stopPropagation()
      toggleBookmark.mutate({ targetId: clubId, type: 'CLUB' })
    },
    [toggleBookmark],
  )

  const fieldLabel = React.useMemo(() => {
    return currentField === 'all' ? '전체' : currentField
  }, [currentField])

  return (
    <div className="bg-white-color">
      {/* 히어로 섹션 */}
      {currentField === 'all' && (
        <div className="relative h-[280px] flex items-end justify-center px-5 py-18 overflow-hidden">
          {/* 배경 이미지 */}
          <Image
            src={HERO_IMAGES.all}
            alt={`${fieldLabel} 히어로 이미지`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      {/* 메인 컨텐츠  */}
      <div className="w-full mx-auto flex justify-center">
        {isDesktop && (
          <div className="w-54 shrink-0 px-5 py-14">
            <SideBar
              options={CATEGORY_OPTIONS}
              value={currentField}
              onChange={(value) => setField(value === 'all' ? null : value)}
              className="w-full h-full"
            />
          </div>
        )}

        {/* 동아리 목록 섹션 */}
        <div className={`${isDesktop ? 'px-5 mt-8 pt-6 pb-12' : 'pt-4'}`}>
          <div className="mx-auto max-w-[calc(17.625rem*3+1rem*2)]">
            {/* 필터 바 */}
            <div
              className={`flex flex-row items-center justify-between gap-2  ${isDesktop ? 'mb-12' : 'pl-5 mb-6'}`}
            >
              {isDesktop ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <MultiDropDown
                      groups={PART_OPTIONS}
                      value={partArray}
                      onChange={handlePartChange}
                      placeholder="파트"
                      maxSummary={1}
                      className="w-auto"
                    />
                    <MultiDropDown
                      groups={WAY_OPTIONS}
                      value={wayArray}
                      onChange={handleWayChange}
                      placeholder="방식"
                      maxSummary={1}
                      className="w-auto"
                    />
                    <MultiDropDown
                      groups={TARGET_OPTIONS}
                      value={targetArray}
                      onChange={handleTargetChange}
                      placeholder="모집 대상"
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
                      options={SORT_OPTIONS}
                      value={currentSort as '인기순' | '이름순' | '마감순'}
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
                      options: SORT_OPTIONS,
                      value: currentSort,
                      defaultValue: '인기순',
                      onChange: (value) => setSort(value as string),
                      onReset: () => setSort('인기순'),
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
                    {
                      id: 'way',
                      label: '방식',
                      type: 'multi',
                      options: WAY_OPTIONS,
                      value: wayArray,
                      defaultValue: [],
                      onChange: (value) => handleWayChange(value as string[]),
                      onReset: () => setWay(null),
                    },
                    {
                      id: 'target',
                      label: '모집대상',
                      type: 'multi',
                      options: TARGET_OPTIONS,
                      value: targetArray,
                      defaultValue: [],
                      onChange: (value) =>
                        handleTargetChange(value as string[]),
                      onReset: () => setTarget(null),
                    },
                  ]}
                  onReset={resetFilters}
                />
              )}
            </div>

            {/* 카드 그리드 */}
            <div
              className={`grid ${isDesktop ? 'grid-cols-3 gap-8 pt-0 pb-12' : 'grid-cols-1 gap-4 px-5'}`}
            >
              {clubs.map((club) => (
                <CardOverlay
                  key={club.clubId}
                  club={club}
                  isSubscribed={bookmarkedClubIds.has(club.clubId)}
                  onBookmarkClick={handleBookmarkClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
