import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SideBar } from './Sidebar'

const options = [
  { label: '전체', value: 'all' },
  { label: '공지', value: 'notice' },
  { label: '질문', value: 'question' },
  { label: '자유', value: 'general' },
]

const meta = {
  title: 'Atoms/SideBar',
  component: SideBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    options,
  },
} satisfies Meta<typeof SideBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options,
    defaultValue: 'all',
  },
  render: (args) => (
    <div className="w-56 rounded-xl border border-light-color-3 overflow-hidden">
      <SideBar {...args} />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('notice')

    return (
      <div className="space-y-3">
        <div className="w-56 rounded-xl border border-light-color-3 overflow-hidden">
          <SideBar options={options} value={value} onChange={setValue} />
        </div>
        <p className="typo-body-3-r text-grey-color-4">현재 선택: {value}</p>
      </div>
    )
  },
}
