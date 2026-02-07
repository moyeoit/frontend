import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tab, type Tab as TabValue } from './Tab'

const meta = {
  title: 'Molecules/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <Tab />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<TabValue>('popular')

    return (
      <div className="w-[420px] space-y-3">
        <Tab value={value} onChange={setValue} />
        <p className="typo-body-3-r text-grey-color-4">현재 정렬: {value}</p>
      </div>
    )
  },
}
