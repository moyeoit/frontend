import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UnderLineTab } from './UnderLineTab'

const tabs = [
  {
    value: 'overview',
    label: '개요',
    content: (
      <p className="typo-body-3-r text-grey-color-4">
        디자인 시스템 개요와 핵심 원칙을 확인할 수 있습니다.
      </p>
    ),
  },
  {
    value: 'tokens',
    label: '토큰',
    content: (
      <p className="typo-body-3-r text-grey-color-4">
        컬러, 타이포, 간격 토큰 정보를 확인할 수 있습니다.
      </p>
    ),
  },
  {
    value: 'components',
    label: '컴포넌트',
    content: (
      <p className="typo-body-3-r text-grey-color-4">
        공용 컴포넌트의 사용 예시와 상태를 확인할 수 있습니다.
      </p>
    ),
  },
]

const meta = {
  title: 'Atoms/UnderLineTab',
  component: UnderLineTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    tabs,
  },
} satisfies Meta<typeof UnderLineTab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <UnderLineTab tabs={tabs} defaultValue="overview" />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('tokens')

    return (
      <div className="w-[640px] space-y-4">
        <UnderLineTab tabs={tabs} value={value} onValueChange={setValue} />
        <p className="typo-body-3-r text-grey-color-4">현재 선택: {value}</p>
      </div>
    )
  },
}
