'use client'

import Image from 'next/image'
import { HERO_IMAGES } from '@/shared/constants/category'
import { PopularCommunityCard } from '@/components/molecules/popularCommunityCard'
import { Tag } from '@/components/atoms/tag'

export default function CommunityPage() {
  return (
    <div>
      {/* Hero 섹션 */}
      <div className="relative h-[280px] flex items-end justify-center px-5 py-18 overflow-hidden max-w-[1440px] mx-auto">
        <Image
          src={HERO_IMAGES.all}
          alt="커뮤니티 히어로 이미지"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col pt-8 px-6 max-w-[1100px] mx-auto ">
        <div className="typo-title-2-b text-black-color mb-4 ">🔥 지금 가장 인기있는</div>
        <div className="flex flex-row gap-4">
          <PopularCommunityCard>
            <div className="flex flex-row gap-[5px] mb-2">
              <Tag
                label="취업준비"
                kind="blogReview"
                size="large"
                className="shrink-0"
              />
              <Tag
                label="인기"
                kind="clubDetail"
                size="large"
                color="lightPurple"
                className="shrink-0"
              />
            </div>
            <PopularCommunityCard.Title>
              프론트엔드 개발 동아리에서 React와 Next.js를 배우며 성장한 경험을 공유합니다
            </PopularCommunityCard.Title>
            <PopularCommunityCard.Description>
              프론트엔드 개발을 함께 공부하고 프로젝트를 진행하는 동아리입니다. React, Next.js, TypeScript 등을 다룹니다. 다양한 프로젝트를 통해 실무 경험을 쌓을 수 있습니다.
            </PopularCommunityCard.Description>
            <PopularCommunityCard.Meta likes={42} comments={15} className="mt-3"/>
          </PopularCommunityCard>
          <PopularCommunityCard postType="QUESTION">
            <div className="flex flex-row gap-[5px] mb-2">
              <Tag
                label="이직/커리어"
                kind="blogReview"
                size="large"
                className="shrink-0"
              />
              <Tag
                label="인기"
                kind="clubDetail"
                size="large"
                color="lightPurple"
                className="shrink-0"
              />
            </div>
            <PopularCommunityCard.Title className="mb-1">
              프론트엔드 개발자로 이직할 때 어떤 스킬이 가장 중요할까요?
            </PopularCommunityCard.Title>
            <PopularCommunityCard.Description className="mb-3">
              프론트엔드 개발자로 이직을 준비하고 있는데, 어떤 기술 스택과 경험이 가장 중요할지 궁금합니다. React, Vue, Angular 중 어떤 것을 우선적으로 학습해야 할까요?
            </PopularCommunityCard.Description>
            <PopularCommunityCard.Meta likes={42} comments={15} className="mt-3"/>
          </PopularCommunityCard>
          <PopularCommunityCard>
            <div className="flex flex-row gap-[5px] mb-2">
              <Tag
                label="취업준비"
                kind="blogReview"
                size="large"
                className="shrink-0"
              />
              <Tag
                label="인기"
                kind="clubDetail"
                size="large"
                color="lightPurple"
                className="shrink-0"
              />
            </div>
            <PopularCommunityCard.Title>
              프론트엔드 개발 동아리에서 React와 Next.js를 배우며 성장한 경험을 공유합니다
            </PopularCommunityCard.Title>
            <PopularCommunityCard.Description>
              프론트엔드 개발을 함께 공부하고 프로젝트를 진행하는 동아리입니다. React, Next.js, TypeScript 등을 다룹니다. 다양한 프로젝트를 통해 실무 경험을 쌓을 수 있습니다.
            </PopularCommunityCard.Description>
            <PopularCommunityCard.Meta likes={42} comments={15} className="mt-3" />
          </PopularCommunityCard>
        </div>

        <div className="mt-12 max-w-[800px] mx-auto">
          <div>목록들</div>
          <div>목록 컴포넌트</div>
        </div>
      </div>
    </div>
  )
}