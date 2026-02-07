import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tag } from '@/components/atoms/tag/Tag'
import { CommunityCardMeta } from '@/components/molecules/communityCard/communityCard'
import {
  PopularCommunityCard as PopularCommunityCardRoot,
  PopularCommunityCardDescription,
  PopularCommunityCardTitle,
} from './PopularCommunityCard'

const cards = [
  {
    id: 1,
    postType: 'QUESTION',
    category: '면접',
    title: 'Q. 활동 후기 작성할 때 강조하면 좋은 포인트는?',
    description:
      '합격 후기를 쓸 때 읽는 사람이 바로 적용할 수 있는 항목 위주로 정리하고 싶은데, 구조를 어떻게 잡으면 좋을지 궁금해요.',
    likes: 34,
    comments: 11,
  },
  {
    id: 2,
    postType: 'GENERAL',
    category: '서류',
    title: '포트폴리오 제작 과정 정리',
    description:
      '디자인 포트폴리오를 만들면서 경험한 시행착오와 개선 포인트를 단계별로 공유합니다.',
    likes: 25,
    comments: 8,
  },
]

const meta = {
  title: 'Molecules/PopularCommunityCard',
  component: PopularCommunityCardRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof PopularCommunityCardRoot>

export default meta
type Story = StoryObj<typeof meta>

export const SingleCard: Story = {
  render: () => {
    const card = cards[0]
    return (
      <PopularCommunityCardRoot postType={card.postType}>
        <div className="mb-2 flex gap-[5px]">
          <Tag label={card.category} kind="blogReview" size="large" />
          <Tag
            label="인기"
            kind="clubDetail"
            size="large"
            color="lightPurple"
          />
        </div>
        <PopularCommunityCardTitle>{card.title}</PopularCommunityCardTitle>
        <PopularCommunityCardDescription>
          {card.description}
        </PopularCommunityCardDescription>
        <CommunityCardMeta
          likes={card.likes}
          comments={card.comments}
          className="mt-3"
        />
      </PopularCommunityCardRoot>
    )
  },
}

export const CardList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {cards.map((card) => (
        <PopularCommunityCardRoot key={card.id} postType={card.postType}>
          <div className="mb-2 flex gap-[5px]">
            <Tag label={card.category} kind="blogReview" size="large" />
            <Tag
              label="인기"
              kind="clubDetail"
              size="large"
              color="lightPurple"
            />
          </div>
          <PopularCommunityCardTitle>{card.title}</PopularCommunityCardTitle>
          <PopularCommunityCardDescription>
            {card.description}
          </PopularCommunityCardDescription>
          <CommunityCardMeta
            likes={card.likes}
            comments={card.comments}
            className="mt-3"
          />
        </PopularCommunityCardRoot>
      ))}
    </div>
  ),
}
