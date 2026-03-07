'use client'

import * as React from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CLUB_EXPLORE_BANNER_MOBILE } from '@/assets/images'
import { CLUB_EXPLORE_BANNER_PC } from '@/assets/videos'
import CardOverlay from '@/components/molecules/card/CardOverlay'
import MobileFilterBar from '@/components/molecules/filterBar/MobileFilterBar'
import { MultiDropDown } from '@/components/molecules/multiDropDown/MultiDropDown'
import TabOverlay from '@/components/molecules/tab/TabOverlay'
import { useToggleBookmark, useBookmarkedClubs } from '@/features/bookmark'
import { useInfiniteExploreClubs } from '@/features/explore/queries'
import AppPath from '@/shared/configs/appPath'
import {
  PART_OPTIONS,
  TARGET_OPTIONS,
  WAY_OPTIONS,
} from '@/shared/constants/filters'
import useMediaQuery from '@/shared/hooks/useMediaQuery'
import useQueryState from '@/shared/hooks/useQueryState'
import { useAuth } from '@/shared/providers/auth-provider'
import { tokenCookies } from '@/shared/utils/cookies'
import { ExploreEmailPromptDialog } from './components/ExploreEmailPromptDialog'
import { CLUB_EXPLORE_SORT_OPTIONS } from './constants'
import {
  buildPopupStorageKey,
  normalizeLegacyQuery,
  parseMultiFilterValue,
  shouldOpenEmailPrompt,
} from './utils'

function readStorageBoolean(storage: Storage, key: string): boolean {
  try {
    return storage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function writeStorageBoolean(storage: Storage, key: string, value: boolean) {
  try {
    if (value) {
      storage.setItem(key, 'true')
      return
    }

    storage.removeItem(key)
  } catch {
    // noop
  }
}

export function Explore() {
  const { isDesktop } = useMediaQuery()
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [field] = useQueryState('field')
  const [sort, setSort] = useQueryState('sort')
  const [part, setPart] = useQueryState('part')
  const [way, setWay] = useQueryState('way')
  const [target, setTarget] = useQueryState('target')

  const [isEmailPromptOpen, setIsEmailPromptOpen] = React.useState(false)

  const normalizedLegacyQuery = React.useMemo(
    () => normalizeLegacyQuery({ field, sort, part, way, target }),
    [field, sort, part, way, target],
  )

  const currentSort = normalizedLegacyQuery.query.sort ?? '인기순'
  const currentPart = normalizedLegacyQuery.query.part
  const currentWay = normalizedLegacyQuery.query.way
  const currentTarget = normalizedLegacyQuery.query.target

  React.useEffect(() => {
    if (!normalizedLegacyQuery.shouldCanonicalize) return

    const params = new URLSearchParams(searchParams?.toString() || '')
    const currentUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname

    params.delete('field')

    if (normalizedLegacyQuery.query.sort) {
      params.set('sort', normalizedLegacyQuery.query.sort)
    } else {
      params.delete('sort')
    }

    if (normalizedLegacyQuery.query.part) {
      params.set('part', normalizedLegacyQuery.query.part)
    } else {
      params.delete('part')
    }

    if (normalizedLegacyQuery.query.way) {
      params.set('way', normalizedLegacyQuery.query.way)
    } else {
      params.delete('way')
    }

    if (normalizedLegacyQuery.query.target) {
      params.set('target', normalizedLegacyQuery.query.target)
    } else {
      params.delete('target')
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false })
    }
  }, [normalizedLegacyQuery, pathname, router, searchParams])

  const popupUserId = React.useMemo(() => {
    if (user?.id) {
      return String(user.id)
    }

    return tokenCookies.getUserId()
  }, [user?.id])

  React.useEffect(() => {
    if (!popupUserId || typeof window === 'undefined') {
      setIsEmailPromptOpen(false)
      return
    }

    const eligibleKey = buildPopupStorageKey(popupUserId, 'eligible')
    const neverShowKey = buildPopupStorageKey(popupUserId, 'never-show')
    const sessionDismissedKey = buildPopupStorageKey(
      popupUserId,
      'session-dismissed',
    )

    const eligible = readStorageBoolean(localStorage, eligibleKey)
    const neverShow = readStorageBoolean(localStorage, neverShowKey)
    const sessionDismissed = readStorageBoolean(
      sessionStorage,
      sessionDismissedKey,
    )

    setIsEmailPromptOpen(
      shouldOpenEmailPrompt({ eligible, neverShow, sessionDismissed }),
    )
  }, [popupUserId])

  const handleCloseEmailPrompt = React.useCallback(() => {
    if (!popupUserId || typeof window === 'undefined') {
      setIsEmailPromptOpen(false)
      return
    }

    const sessionDismissedKey = buildPopupStorageKey(
      popupUserId,
      'session-dismissed',
    )

    writeStorageBoolean(sessionStorage, sessionDismissedKey, true)
    setIsEmailPromptOpen(false)
  }, [popupUserId])

  const handleNeverShowEmailPrompt = React.useCallback(() => {
    if (!popupUserId || typeof window === 'undefined') {
      setIsEmailPromptOpen(false)
      return
    }

    const eligibleKey = buildPopupStorageKey(popupUserId, 'eligible')
    const neverShowKey = buildPopupStorageKey(popupUserId, 'never-show')
    const sessionDismissedKey = buildPopupStorageKey(
      popupUserId,
      'session-dismissed',
    )

    writeStorageBoolean(localStorage, neverShowKey, true)
    writeStorageBoolean(localStorage, eligibleKey, false)
    writeStorageBoolean(sessionStorage, sessionDismissedKey, false)
    setIsEmailPromptOpen(false)
  }, [popupUserId])

  const handleConfirmEmailPrompt = React.useCallback(() => {
    if (!popupUserId || typeof window === 'undefined') {
      setIsEmailPromptOpen(false)
      return
    }

    const eligibleKey = buildPopupStorageKey(popupUserId, 'eligible')
    const sessionDismissedKey = buildPopupStorageKey(
      popupUserId,
      'session-dismissed',
    )

    writeStorageBoolean(localStorage, eligibleKey, false)
    writeStorageBoolean(sessionStorage, sessionDismissedKey, false)
    setIsEmailPromptOpen(false)
    router.push(`${AppPath.myPage()}?section=settings-account`)
  }, [popupUserId, router])

  const partArray = React.useMemo(
    () => parseMultiFilterValue(currentPart),
    [currentPart],
  )

  const wayArray = React.useMemo(
    () => parseMultiFilterValue(currentWay),
    [currentWay],
  )

  const targetArray = React.useMemo(
    () => parseMultiFilterValue(currentTarget),
    [currentTarget],
  )

  const handlePartChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setPart('all')
        return
      }

      setPart(values.length > 0 ? values.join(',') : null)
    },
    [setPart],
  )

  const handleWayChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setWay('all')
        return
      }

      setWay(values.length > 0 ? values.join(',') : null)
    },
    [setWay],
  )

  const handleTargetChange = React.useCallback(
    (values: string[]) => {
      if (values.includes('all')) {
        setTarget('all')
        return
      }

      setTarget(values.length > 0 ? values.join(',') : null)
    },
    [setTarget],
  )

  const resetFilters = React.useCallback(() => {
    router.replace(AppPath.clubExplore(), { scroll: false })
  }, [router])

  const queryParams = React.useMemo(
    () => ({
      size: 14,
      part: currentPart && currentPart !== 'all' ? currentPart : undefined,
      way: currentWay && currentWay !== 'all' ? currentWay : undefined,
      target:
        currentTarget && currentTarget !== 'all' ? currentTarget : undefined,
      sort: currentSort,
    }),
    [currentPart, currentSort, currentTarget, currentWay],
  )

  const {
    data: clubsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteExploreClubs(queryParams)
  const { data: bookmarkedClubsData } = useBookmarkedClubs()
  const toggleBookmark = useToggleBookmark()

  const clubs = clubsData?.pages.flatMap((page) => page.content) ?? []
  const bookmarkedClubs = bookmarkedClubsData?.data?.content || []
  const bookmarkedClubIds = new Set(bookmarkedClubs.map((club) => club.clubId))

  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handleBookmarkClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      event.stopPropagation()
      toggleBookmark.mutate({ targetId: clubId, type: 'CLUB' })
    },
    [toggleBookmark],
  )

  return (
    <div className="bg-white-color">
      <div
        className={`relative w-full overflow-hidden ${
          isDesktop ? 'aspect-[1440/320]' : 'aspect-[360/88]'
        }`}
      >
        {isDesktop ? (
          <video
            src={CLUB_EXPLORE_BANNER_PC}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={CLUB_EXPLORE_BANNER_MOBILE}
            alt="탐색하기 히어로 이미지"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div
        className={
          isDesktop ? 'mx-auto max-w-[920px] px-5 pt-14 pb-12' : 'w-full pt-4'
        }
      >
        <div
          className={
            isDesktop
              ? 'mb-12 flex items-center justify-between gap-2'
              : 'pl-5 mb-6'
          }
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
                  onClick={resetFilters}
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

              <TabOverlay
                options={CLUB_EXPLORE_SORT_OPTIONS}
                value={currentSort}
                onChange={(value) => setSort(value)}
                onReset={() => setSort('인기순')}
                className="w-[146px] shrink-0"
              />
            </>
          ) : (
            <MobileFilterBar
              tabs={[
                {
                  id: 'sort',
                  label: '정렬',
                  type: 'sort',
                  options: CLUB_EXPLORE_SORT_OPTIONS,
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
                  label: '모집 대상',
                  type: 'multi',
                  options: TARGET_OPTIONS,
                  value: targetArray,
                  defaultValue: [],
                  onChange: (value) => handleTargetChange(value as string[]),
                  onReset: () => setTarget(null),
                },
              ]}
              onReset={resetFilters}
            />
          )}
        </div>

        <div
          className={`grid ${
            isDesktop ? 'grid-cols-3 gap-8 min-h-100' : 'grid-cols-1 gap-4 px-5'
          }`}
        >
          {clubs.map((club) => (
            <CardOverlay
              key={club.clubId}
              club={club}
              isSubscribed={bookmarkedClubIds.has(club.clubId)}
              onBookmarkClick={handleBookmarkClick}
              size="col3Desktop"
            />
          ))}
        </div>
        <div ref={sentinelRef} className="pb-12" />
      </div>

      <ExploreEmailPromptDialog
        open={isEmailPromptOpen}
        isDesktop={isDesktop}
        onClose={handleCloseEmailPrompt}
        onNeverShow={handleNeverShowEmailPrompt}
        onConfirm={handleConfirmEmailPrompt}
      />
    </div>
  )
}
