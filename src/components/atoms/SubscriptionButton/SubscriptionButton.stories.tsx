import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SubscriptionButton } from './SubscriptionButton'

const BellIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 17H9M10.5 21H13.5M18 17V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V17L4 19H20L18 17Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const meta = {
  title: 'Atoms/SubscriptionButton',
  component: SubscriptionButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isSubscribed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof SubscriptionButton>

export default meta
type Story = StoryObj<typeof meta>

export const Unsubscribed: Story = {
  args: {
    isSubscribed: false,
  },
}

export const Subscribed: Story = {
  args: {
    isSubscribed: true,
  },
}

export const WithIcon: Story = {
  args: {
    isSubscribed: false,
    icon: <BellIcon />,
  },
}

export const Disabled: Story = {
  args: {
    isSubscribed: true,
    disabled: true,
  },
}
