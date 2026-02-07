import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from './Label'

const meta = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '이메일',
  },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="label-email" {...args} />
      <input
        id="label-email"
        className="w-64 rounded-md border border-light-color-3 px-3 py-2"
        placeholder="email@example.com"
      />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="label-required">
        비밀번호 <span className="text-[#f44336]">*</span>
      </Label>
      <input
        id="label-required"
        type="password"
        className="w-64 rounded-md border border-light-color-3 px-3 py-2"
        placeholder="8자 이상 입력"
      />
    </div>
  ),
}

export const DisabledPeer: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="label-disabled">비활성 입력</Label>
      <input
        id="label-disabled"
        disabled
        className="w-64 rounded-md border border-light-color-3 px-3 py-2"
        value="disabled"
        readOnly
      />
    </div>
  ),
}
