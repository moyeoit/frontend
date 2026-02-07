'use client'

import * as React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/molecules/dialog/Dialog'

const CONFIG = {
  post: {
    title: '해당 글을 정말 삭제할까요?\n삭제한 글은 되돌릴 수 없습니다.',
  },
  comment: {
    title: '해당 댓글을 정말 삭제할까요?\n삭제한 댓글은 되돌릴 수 없습니다.',
  },
} as const

export type DeleteConfirmType = keyof typeof CONFIG

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  type: DeleteConfirmType
  isPending?: boolean
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  type,
  isPending = false,
}: DeleteConfirmDialogProps) {
  const config = CONFIG[type]

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-90 sm:max-w-96 rounded-2xl border-none bg-white-color"
      >
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <DialogTitle className="typo-title-2-m text-black-color whitespace-pre-line leading-normal">
              {config.title}
            </DialogTitle>
          </div>
          <DialogFooter className="mt-4 gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 py-2 rounded-full border border-light-color-4 typo-body-3-3-r text-grey-color-4 hover:bg-light-color-1 transition-colors"
              >
                취소
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 py-2 rounded-full bg-main-color-1 typo-body-3-2-sb text-white-color hover:bg-main-color-1/90 transition-colors disabled:opacity-50"
            >
              {isPending ? '삭제 중...' : '삭제'}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
