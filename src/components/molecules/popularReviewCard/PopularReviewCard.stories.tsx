import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PopularReviewCard, PopularReviewCardRoot } from './index'

const items = [
  {
    id: '101',
    category: 'DOCUMENT' as const,
    clubName: '모여잇',
    generation: 13,
    jobName: '디자인',
    rating: 4,
    content:
      '서류는 문제 해결 과정을 중심으로 작성했을 때 피드백이 좋았습니다. 특히 프로젝트별 역할과 결과를 명확히 분리한 것이 효과적이었어요.',
  },
  {
    id: '102',
    category: 'INTERVIEW' as const,
    clubName: '모여잇',
    generation: 13,
    jobName: '개발',
    rating: 5,
    content:
      '면접에서는 기술 선택의 이유와 트레이드오프를 구체적으로 설명한 부분이 가장 좋은 반응을 얻었습니다.',
  },
  {
    id: '103',
    category: 'ACTIVITY' as const,
    clubName: '모여잇',
    generation: 13,
    jobName: '기획',
    rating: 4,
    content:
      '활동 회고는 팀 커뮤니케이션과 일정 관리 경험을 중심으로 정리하면 다른 지원자에게도 도움이 됩니다.',
  },
]

const meta = {
  title: 'Molecules/PopularReviewCard',
  component: PopularReviewCardRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PopularReviewCardRoot>

export default meta
type Story = StoryObj<typeof meta>

export const SingleCard: Story = {
  render: () => {
    const item = items[0]
    return (
      <div className="w-full max-w-sm">
        <PopularReviewCard>
          <PopularReviewCard.Tag />
          <PopularReviewCard.Profile
            reviewCategory={item.category}
            clubName={item.clubName}
            generation={item.generation}
            jobName={item.jobName}
            ratingValue={item.rating}
          />
          <PopularReviewCard.Content>{item.content}</PopularReviewCard.Content>
          <PopularReviewCard.Link reviewId={item.id} />
        </PopularReviewCard>
      </div>
    )
  },
}

export const CardList: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <PopularReviewCard key={item.id}>
          <PopularReviewCard.Tag />
          <PopularReviewCard.Profile
            reviewCategory={item.category}
            clubName={item.clubName}
            generation={item.generation}
            jobName={item.jobName}
            ratingValue={item.rating}
          />
          <PopularReviewCard.Content>{item.content}</PopularReviewCard.Content>
          <PopularReviewCard.Link reviewId={item.id} />
        </PopularReviewCard>
      ))}
    </div>
  ),
}

export const ProfileVariants: Story = {
  render: () => (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-light-color-3 bg-white-color p-4"
        >
          <PopularReviewCard.Profile
            reviewCategory={item.category}
            clubName={item.clubName}
            generation={item.generation}
            jobName={item.jobName}
            ratingValue={item.rating}
          />
        </div>
      ))}
    </div>
  ),
}
