'use client'

import { CommunityCard } from '@/components/molecules/communityCard'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

export default function ExamplePage() {
  const { isDesktop } = useMediaQuery()
  return (
    <div className="p-8 space-y-12">
      <h1 className="typo-title-1 text-black-color mb-8">CommunityCard 예시</h1>

      {/* 가로형 데스크탑 (이미지 있음) */}
      <section className="space-y-4 flex justify-center items-center">
        <div className="max-w-[800px] w-full">
          <CommunityCard
            type="horizontal"
            className={`gap-6 pt-8 group cursor-pointer relative ${isDesktop ? 'gap-6' : 'gap-4'}`}
          >
            <CommunityCard.Content className="max-w-[656px] flex-col">
              <CommunityCard.Title>
                프론트엔드 개발
                하가나다라마바사아자차카하가나다라마바사아자차카하가나다라마바사아자차카하가나다라마바사아자차카동아리
              </CommunityCard.Title>
              <CommunityCard.Description>
                프론트엔드 개발을 함께 공부하고 프로젝트를 진행하는
                동아리입니다. React, Next.js, TypeScript 등을 다룹니다. React,
                Next.js, TypeScript 등을
                다룹니다.하가나다라마바사아자차카하가나다라마바사아자차카하가나다라마바사아자차카
                가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카하가나다라마바사아자차카하가나다라마바사아자차카타파하
              </CommunityCard.Description>
              <CommunityCard.Meta
                nickname="프론트"
                timeAgo="30분전"
                views={100}
                likes={100}
                comments={100}
              />
            </CommunityCard.Content>
            <CommunityCard.Image
              logoUrl="/images/default.svg"
              alt="프론트엔드 개발 동아리"
            />
          </CommunityCard>
        </div>
      </section>
    </div>
  )
}
