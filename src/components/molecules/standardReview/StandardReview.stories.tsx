import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import StandardReview from './StandardReview'

const sample = {
  nickname: '김모여',
  clubName: '모여잇',
  generation: '13기',
  part: '개발',
  rating: 4,
  reviewType: '일반 후기',
  date: '2026.02.07',
  title: '지원 과정에서 가장 도움이 되었던 점',
  content:
    '스터디를 통해 문제 해결 과정을 언어화하는 연습을 많이 했던 것이 실제 면접에서 큰 도움이 되었습니다. 특히 질문 의도를 먼저 확인하고, 의사결정 기준을 단계별로 설명하는 방식이 좋았습니다. 이후에는 예상하지 못한 꼬리 질문에도 구조적으로 답할 수 있었습니다.',
  likeCount: 18,
  questions: [
    { question: 'Q1. 지원 시기', answers: ['상반기'] },
    { question: 'Q2. 준비 기간', answers: ['약 4주'] },
    { question: 'Q3. 준비 방법', answers: ['스터디', '모의 면접'] },
  ],
}

const meta = {
  title: 'Molecules/StandardReview',
  component: StandardReview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof StandardReview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-6xl rounded-2xl border border-light-color-3 bg-white-color p-5">
      <StandardReview>
        <div className="flex gap-6">
          <StandardReview.Left>
            <StandardReview.Profile
              nickname={sample.nickname}
              clubName={sample.clubName}
              generation={sample.generation}
              part={sample.part}
            />
            <StandardReview.Questions questions={sample.questions} />
          </StandardReview.Left>

          <StandardReview.Right>
            <StandardReview.Meta
              rating={sample.rating}
              reviewType={sample.reviewType}
              date={sample.date}
            />
            <StandardReview.Content
              title={sample.title}
              content={sample.content}
            />
          </StandardReview.Right>
        </div>

        <StandardReview.Bottom>
          <StandardReview.Likes likeCount={sample.likeCount} />
          <StandardReview.Recommend likeCount={sample.likeCount} />
        </StandardReview.Bottom>
      </StandardReview>
    </div>
  ),
}

export const List: Story = {
  render: () => (
    <div className="w-full max-w-6xl space-y-4">
      {[1, 2].map((idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-light-color-3 bg-white-color p-5"
        >
          <StandardReview>
            <div className="flex gap-6">
              <StandardReview.Left>
                <StandardReview.Profile
                  nickname={`${sample.nickname}${idx}`}
                  clubName={sample.clubName}
                  generation={sample.generation}
                  part={idx % 2 === 0 ? '기획' : '개발'}
                />
                <StandardReview.Questions questions={sample.questions} />
              </StandardReview.Left>

              <StandardReview.Right>
                <StandardReview.Meta
                  rating={idx % 2 === 0 ? 5 : 4}
                  reviewType={sample.reviewType}
                  date={sample.date}
                />
                <StandardReview.Content
                  title={sample.title}
                  content={sample.content}
                />
              </StandardReview.Right>
            </div>

            <StandardReview.Bottom>
              <StandardReview.Likes likeCount={sample.likeCount + idx} />
              <StandardReview.Recommend likeCount={sample.likeCount + idx} />
            </StandardReview.Bottom>
          </StandardReview>
        </div>
      ))}
    </div>
  ),
}
