import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Carousel } from './index'

const slides = [
  { id: 1, title: '슬라이드 1', desc: '리뷰 카드 영역' },
  { id: 2, title: '슬라이드 2', desc: '커뮤니티 하이라이트' },
  { id: 3, title: '슬라이드 3', desc: '구독 가이드' },
  { id: 4, title: '슬라이드 4', desc: '이벤트 배너' },
]

const meta = {
  title: 'Atoms/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[480px]">
      <Carousel opts={{ align: 'start' }}>
        <Carousel.Content className="-ml-4">
          {slides.map((slide) => (
            <Carousel.Item key={slide.id} className="basis-full pl-4">
              <div className="h-44 rounded-2xl border border-light-color-3 bg-light-color-1 p-6">
                <p className="typo-body-2-sb text-black-color">{slide.title}</p>
                <p className="mt-2 typo-body-3-r text-grey-color-4">
                  {slide.desc}
                </p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel.Content>
      </Carousel>
    </div>
  ),
}
