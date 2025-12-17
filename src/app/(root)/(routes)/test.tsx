'use client'

import {
  CommunityCard,
  CommunityCardOverlay,
} from '@/components/molecules/communityCard'
import type { ClubItem } from '@/features/explore/types'

const mockClubWithImage: ClubItem = {
  clubId: 1,
  clubName: '프론트엔드 개발 동아리',
  description:
    '프론트엔드 개발을 함께 공부하고 프로젝트를 진행하는 동아리입니다. React, Next.js, TypeScript 등을 다룹니다.',
  categories: ['프론트엔드', '웹개발'],
  logoUrl: '/images/default.svg',
  isRecruiting: true,
}

const mockClubWithoutImage: ClubItem = {
  clubId: 2,
  clubName: '백엔드 개발 동아리',
  description:
    '백엔드 개발을 함께 공부하고 프로젝트를 진행하는 동아리입니다. Spring, Node.js, Python 등을 다룹니다.',
  categories: ['백엔드', '서버개발'],
  logoUrl: '',
  isRecruiting: false,
}

export default function Test() {
  const handleBookmarkClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    clubId: number,
  ) => {
    e.stopPropagation()
    console.log('Bookmark clicked:', clubId)
  }

  return (
    <div className="p-8 space-y-12">
      <h1 className="typo-title-1 text-black-color mb-8">
        커뮤니티 카드 종류 테스트
      </h1>

      {/* 1. 가로형 데스크탑 (이미지 있음) */}
      <section className="space-y-4">
        <h2 className="typo-title-2 text-black-color">
          1. 가로형 데스크탑 (이미지 있음)
        </h2>
        <div className="max-w-2xl">
          <CommunityCard
            type="horizontal"
            border={true}
            gap="12px"
            pad="16px"
            className="group cursor-pointer relative"
          >
            <CommunityCard.Image
              logoUrl={mockClubWithImage.logoUrl}
              alt={mockClubWithImage.clubName}
              imageWidth="168px"
              interactive
            />
            <CommunityCard.Bookmark
              isSubscribed={false}
              onClick={(e) => handleBookmarkClick(e, mockClubWithImage.clubId)}
            />
            <CommunityCard.Content className="px-[6px]">
              <CommunityCard.Title>
                {mockClubWithImage.clubName}
              </CommunityCard.Title>
              <CommunityCard.Description>
                {mockClubWithImage.description}
              </CommunityCard.Description>
              <CommunityCard.Meta
                part={mockClubWithImage.categories.join(' · ')}
              />
            </CommunityCard.Content>
            {mockClubWithImage.isRecruiting && (
              <div className="w-[61px] h-[29px] absolute top-[16px] left-[16px] bg-white text-grey-color-5 typo-caption-sb rounded-[73px] border border-light-color-3 z-10 px-3 py-1.5 text-center flex items-center justify-center leading-none">
                모집중
              </div>
            )}
          </CommunityCard>
        </div>
      </section>

      {/* 2. 가로형 데스크탑 (이미지 없음) */}
      <section className="space-y-4">
        <h2 className="typo-title-2 text-black-color">
          2. 가로형 데스크탑 (이미지 없음)
        </h2>
        <div className="max-w-2xl">
          <CommunityCard
            type="horizontal"
            border={true}
            gap="12px"
            pad="16px"
            className="group cursor-pointer relative"
          >
            <CommunityCard.Bookmark
              isSubscribed={true}
              onClick={(e) =>
                handleBookmarkClick(e, mockClubWithoutImage.clubId)
              }
            />
            <CommunityCard.Content className="px-[6px]">
              <CommunityCard.Title>
                {mockClubWithoutImage.clubName}
              </CommunityCard.Title>
              <CommunityCard.Description>
                {mockClubWithoutImage.description}
              </CommunityCard.Description>
              <CommunityCard.Meta
                part={mockClubWithoutImage.categories.join(' · ')}
              />
            </CommunityCard.Content>
          </CommunityCard>
        </div>
      </section>

      {/* 3. 가로형 모바일 (이미지 있음) - Overlay 사용 */}
      <section className="space-y-4">
        <h2 className="typo-title-2 text-black-color">
          3. 가로형 모바일 (이미지 있음) - Overlay 사용
        </h2>
        <div className="max-w-md">
          <CommunityCardOverlay
            club={mockClubWithImage}
            isSubscribed={false}
            onBookmarkClick={handleBookmarkClick}
            type="horizontal"
          />
        </div>
      </section>

      {/* 4. 가로형 모바일 (이미지 없음) - Overlay 사용 */}
      <section className="space-y-4">
        <h2 className="typo-title-2 text-black-color">
          4. 가로형 모바일 (이미지 없음) - Overlay 사용
        </h2>
        <div className="max-w-md">
          <CommunityCardOverlay
            club={mockClubWithoutImage}
            isSubscribed={true}
            onBookmarkClick={handleBookmarkClick}
            type="horizontal"
          />
        </div>
      </section>

      {/* 5. 세로형 (이미지 없음) */}
      <section className="space-y-4">
        <h2 className="typo-title-2 text-black-color">
          5. 세로형 (이미지 없음)
        </h2>
        <div className="max-w-md">
          <CommunityCard
            type="vertical"
            border={true}
            gap="12px"
            pad="16px"
            className="group cursor-pointer relative"
          >
            <CommunityCard.Bookmark
              isSubscribed={false}
              onClick={(e) => handleBookmarkClick(e, mockClubWithImage.clubId)}
            />
            <CommunityCard.Content className="px-[6px]">
              <CommunityCard.Title>
                {mockClubWithImage.clubName}
              </CommunityCard.Title>
              <CommunityCard.Description>
                {mockClubWithImage.description}
              </CommunityCard.Description>
              <CommunityCard.Meta
                part={mockClubWithImage.categories.join(' · ')}
              />
            </CommunityCard.Content>
            {mockClubWithImage.isRecruiting && (
              <div className="w-[61px] h-[29px] absolute top-[16px] left-[16px] bg-white text-grey-color-5 typo-caption-sb rounded-[73px] border border-light-color-3 z-10 px-3 py-1.5 text-center flex items-center justify-center leading-none">
                모집중
              </div>
            )}
          </CommunityCard>
        </div>
      </section>

      {/* 6. 세로형 - Overlay 사용 */}
      <section className="space-y-4">
        <h2 className="typo-title-2 text-black-color">
          6. 세로형 - Overlay 사용
        </h2>
        <div className="max-w-md">
          <CommunityCardOverlay
            club={mockClubWithoutImage}
            isSubscribed={false}
            onBookmarkClick={handleBookmarkClick}
            type="vertical"
          />
        </div>
      </section>
    </div>
  )
}
