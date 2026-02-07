import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/atoms/Button'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

const meta = {
  title: 'Molecules/DeleteConfirmDialog',
  component: DeleteConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirm: () => {},
    type: 'post',
  },
} satisfies Meta<typeof DeleteConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

function DeleteConfirmDialogDemo({
  type,
  isPending = false,
}: {
  type: 'post' | 'comment'
  isPending?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="solid" size="small" onClick={() => setOpen(true)}>
        삭제 확인 열기
      </Button>
      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        type={type}
        isPending={isPending}
      />
    </>
  )
}

export const Post: Story = {
  render: () => <DeleteConfirmDialogDemo type="post" />,
}

export const Comment: Story = {
  render: () => <DeleteConfirmDialogDemo type="comment" />,
}

export const Pending: Story = {
  render: () => <DeleteConfirmDialogDemo type="post" isPending />,
}
