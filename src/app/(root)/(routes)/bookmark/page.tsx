'use client'

import React from 'react'
import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import CardOverlay from '@/components/molecules/card/CardOverlay'
import { useBookmarkedClubs, useToggleBookmark } from '@/features/bookmark'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

export default function BookmarkPage() {
  const { isDesktop } = useMediaQuery()
  const { data: bookmarkedClubsData } = useBookmarkedClubs()
  const toggleBookmark = useToggleBookmark()

  const bookmarkedClubs = bookmarkedClubsData?.data?.content || []

  const handleBookmarkClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, clubId: number) => {
      e.stopPropagation()
      toggleBookmark.mutate({
        targetId: clubId,
        type: 'CLUB',
      })
    },
    [toggleBookmark],
  )

  const tabs = [
    {
      value: 'clubs',
      label: 'IT 동아리',
      content: (
        <div className="w-full">
          {bookmarkedClubs.length === 0 ? (
            <div className="text-center py-20">
              <p className="typo-body-2-r text-grey-color-4">
                북마크한 IT 동아리가 없습니다
              </p>
            </div>
          ) : (
            <div
              className={`grid ${isDesktop ? 'grid-cols-3 gap-8' : 'grid-cols-1 gap-4'}`}
            >
              {bookmarkedClubs.map((club) => (
                <CardOverlay
                  key={club.clubId}
                  club={club}
                  isSubscribed={true}
                  onBookmarkClick={handleBookmarkClick}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'document-interview',
      label: '서류/면접 후기',
      content: (
        <div className="w-full">
          <div className="text-center py-20">
            <p className="typo-body-2-r text-grey-color-4">
              북마크한 서류/면접 후기가 없습니다
            </p>
          </div>
        </div>
      ),
    },
    {
      value: 'activity',
      label: '활동 후기',
      content: (
        <div className="w-full">
          <div className="text-center py-20">
            <p className="typo-body-2-r text-grey-color-4">
              북마크한 활동 후기가 없습니다
            </p>
          </div>
        </div>
      ),
    },
    {
      value: 'blog',
      label: '블로그 후기',
      content: (
        <div className="w-full">
          <div className="text-center py-20">
            <p className="typo-body-2-r text-grey-color-4">
              북마크한 블로그 후기가 없습니다
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <main className="w-full min-h-screen bg-white">
      <div className="max-w-275 mx-auto px-5 py-10 desktop:py-16">
        {/* 타이틀 */}
        <h1 className="typo-title-2-1-sb text-black-color mb-8">북마크</h1>

        {/* 탭 */}
        <UnderLineTab tabs={tabs} defaultValue="clubs" />
      </div>
    </main>
  )
}
