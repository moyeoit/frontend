import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/atoms/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const CenterModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="solid" size="small">
          다이얼로그 열기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl border-light-color-3">
        <DialogHeader>
          <DialogTitle>게시글을 저장할까요?</DialogTitle>
          <DialogDescription>
            작성 중인 내용을 임시 저장한 뒤 나중에 이어서 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outlined-secondary" size="small">
            취소
          </Button>
          <Button variant="solid" size="small">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Fullscreen: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="solid" size="small">
          전체 화면 열기
        </Button>
      </DialogTrigger>
      <DialogContent
        variant="fullscreen"
        className="p-6"
        showCloseButton={true}
      >
        <div className="mx-auto max-w-2xl space-y-3">
          <h2 className="typo-title-2-m text-black-color">모바일 시트 예시</h2>
          <p className="typo-body-3-r text-grey-color-4">
            fullscreen variant는 화면 전체를 덮는 시트/모달 시나리오에
            사용합니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  ),
}
