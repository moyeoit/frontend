import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StarRating } from './StarRating'

const meta = {
  title: 'Atoms/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: () => {},
  },
  argTypes: {
    maxStars: { control: { type: 'number', min: 1, max: 10, step: 1 } },
    size: { control: { type: 'number', min: 12, max: 40, step: 2 } },
    disabled: { control: 'boolean' },
    showLabel: { control: 'boolean' },
  },
} satisfies Meta<typeof StarRating>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  args: {
    value: 3,
    maxStars: 5,
    size: 24,
    disabled: false,
    showLabel: true,
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.value)
    return <StarRating {...args} value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  args: {
    value: 4,
    maxStars: 5,
    disabled: true,
    showLabel: true,
  },
  render: (args) => <StarRating {...args} onChange={() => {}} />,
}

export const CustomLabels: Story = {
  args: {
    value: 2,
    maxStars: 5,
    showLabel: true,
    ratingLabels: {
      1: '아쉬움',
      2: '보통',
      3: '괜찮음',
      4: '좋음',
      5: '아주 좋음',
    },
  },
  render: (args) => {
    const [value, setValue] = React.useState(args.value)
    return <StarRating {...args} value={value} onChange={setValue} />
  },
}
