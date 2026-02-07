import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  CommunityCard as CommunityCardRoot,
  CommunityCardContent,
  CommunityCardDescription,
  CommunityCardImage,
  CommunityCardMeta,
  CommunityCardTitle,
} from './communityCard'

const posts = [
  {
    id: 101,
    postType: 'GENERAL',
    title: '서류 합격 후 면접 준비 팁 공유합니다',
    excerpt:
      '면접 준비하면서 정리했던 체크리스트와 실제로 도움된 자료를 공유합니다.',
    author: '민지',
    timeAgo: '2시간 전',
    views: 124,
    likes: 21,
    comments: 6,
    thumbnail: '/images/default.svg',
  },
  {
    id: 102,
    postType: 'QUESTION',
    title: '포트폴리오 발표 때 강조하면 좋은 부분이 있을까요?',
    excerpt:
      '현재 디자인 포지션 지원 중인데 발표 구성 순서가 고민됩니다. 조언 부탁드려요.',
    author: '준호',
    timeAgo: '5시간 전',
    views: 88,
    likes: 12,
    comments: 9,
    thumbnail: '/images/default.svg',
  },
]

const meta = {
  title: 'Molecules/CommunityCard',
  component: CommunityCardRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof CommunityCardRoot>

export default meta
type Story = StoryObj<typeof meta>

export const HorizontalList: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-2xl border border-light-color-3 bg-white-color p-4">
      {posts.map((post) => (
        <CommunityCardRoot
          key={post.id}
          type="horizontal"
          postType={post.postType}
          className="group gap-4"
        >
          <CommunityCardContent>
            <CommunityCardTitle>{post.title}</CommunityCardTitle>
            <CommunityCardDescription>{post.excerpt}</CommunityCardDescription>
            <CommunityCardMeta
              nickname={post.author}
              timeAgo={post.timeAgo}
              views={post.views}
              likes={post.likes}
              comments={post.comments}
              className="mt-3"
            />
          </CommunityCardContent>
          <CommunityCardImage logoUrl={post.thumbnail} alt={post.title} />
        </CommunityCardRoot>
      ))}
    </div>
  ),
}

export const Vertical: Story = {
  render: () => {
    const post = posts[0]
    return (
      <div className="w-full max-w-xl rounded-2xl border border-light-color-3 bg-white-color p-4">
        <CommunityCardRoot
          type="vertical"
          postType={post.postType}
          className="group"
        >
          <CommunityCardImage
            logoUrl={post.thumbnail}
            alt={post.title}
            className="mb-3 !ml-0"
          />
          <CommunityCardContent>
            <CommunityCardTitle>{post.title}</CommunityCardTitle>
            <CommunityCardDescription>{post.excerpt}</CommunityCardDescription>
            <CommunityCardMeta
              nickname={post.author}
              timeAgo={post.timeAgo}
              views={post.views}
              likes={post.likes}
              comments={post.comments}
              className="mt-3"
            />
          </CommunityCardContent>
        </CommunityCardRoot>
      </div>
    )
  },
}
