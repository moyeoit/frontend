'use client'

import { CommunityCard } from '@/components/molecules/communityCard'
import { PopularReviewCard } from '@/components/molecules/popularReviewCard'
import BlogReview from '@/components/organisms/blogReview'
import useMediaQuery from '@/shared/hooks/useMediaQuery'

const MOCK_BLOG_REVIEW = {
  reviewId: 1,
  clubName: '동아리명',
  generation: 12,
  part: '프론트엔드 개발자',
  title: '블로그 리뷰 컴포넌트 test',
  description:
    '동아리 활동을 통해 React, Next.js를 배우고 실제 프로젝트에 참여했던 경험을 공유합니다.',
  url: '',
  thumbnailUrl: '/images/default.svg',
  blogName: '개발 블로그',
}

export default function ExamplePage() {
  const { isDesktop } = useMediaQuery()
  return (
    <div className="p-8 space-y-12">
      <h1 className="typo-title-1 text-black-color mb-8">컴포넌트 예시</h1>

      <section className="space-y-4">
        <h2 className="typo-title-2-1-sb text-black-color">
          인기 후기 컴포넌트 (홈 피드, 후기 메인 사용)
        </h2>
        <div className="flex justify-center items-start w-full px-4">
          <div className="grid w-full items-start max-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PopularReviewCard>
              {/* <PopularReviewCard.Tag /> */}
              <PopularReviewCard.Profile
                category="DOCUMENT"
                clubName="동아리명"
                generation={12}
                jobName="프론트엔드 개발자"
                ratingValue={4}
              />
              <PopularReviewCard.Content>
                직무 경험이 없으면 힘들게 느껴 질 수도 있는 압박질문이 있었고
                어쩌구저쩌구가나다라마바사
              </PopularReviewCard.Content>
              <PopularReviewCard.Link reviewId="1" />
            </PopularReviewCard>
            <PopularReviewCard>
              <PopularReviewCard.Tag />
              <PopularReviewCard.Profile
                category="INTERVIEW"
                clubName="동아리명"
                generation={12}
                jobName="프론트엔드 개발자"
                ratingValue={4}
              />
              <PopularReviewCard.Content>
                직무 경험이 없으면 힘들게 느껴 질 수도 있는 압박질문이 있었고
                어쩌구저쩌구가나다라마바사
              </PopularReviewCard.Content>
              <PopularReviewCard.Link reviewId="25" />
            </PopularReviewCard>
            <PopularReviewCard>
              <PopularReviewCard.Tag />
              <PopularReviewCard.Profile
                category="ACTIVITY"
                clubName="동아리명"
                generation={12}
                jobName="프론트엔드 개발자"
                ratingValue={4}
              />
              <PopularReviewCard.Content>
                직무 경험이 없으면 힘들게 느껴 질 수도 있는 압박질문이 있었고
                어쩌구저쩌구가나다라마바사
              </PopularReviewCard.Content>
              <PopularReviewCard.Link reviewId="26" />
            </PopularReviewCard>
          </div>
        </div>
      </section>

      {/* BlogReview 예시 - data, children 혼합 사용 가능 */}
      <section className="space-y-4">
        <h2 className="typo-title-2-1-sb text-black-color">BlogReview</h2>
        <div className="flex justify-center items-center">
          <div className="space-y-4">
            <BlogReview data={MOCK_BLOG_REVIEW} isBookmarked={true}>
              <BlogReview.Thumbnail />
              <BlogReview.Tags />
              <BlogReview.Title>타이틀 테스트</BlogReview.Title>
              <BlogReview.Description />
              <BlogReview.BlogName />
              <BlogReview.BookmarkButton />
            </BlogReview>
          </div>
        </div>
      </section>

      {/* CommunityCard 예시 */}
      <section className="space-y-4">
        <h2 className="typo-title-2-1-sb text-black-color">CommunityCard</h2>
        <div className="flex justify-center items-center">
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
        </div>
      </section>
    </div>
  )
}
