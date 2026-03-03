import React from 'react'
import { Button } from '@/components/atoms/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/molecules/dialog/Dialog'
import { cn } from '@/shared/utils/cn'

interface NotificationOffConfirmDialogProps {
  open: boolean
  isDesktop: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onConfirmTurnOff: () => void
}

export function NotificationOffConfirmDialog({
  open,
  isDesktop,
  isPending,
  onOpenChange,
  onConfirmTurnOff,
}: NotificationOffConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'rounded-[20px] border-none bg-white-color px-4 py-6',
          isDesktop
            ? 'w-full max-w-[434px]'
            : 'w-[calc(100%-2.5rem)] max-w-[276px]',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center',
            isDesktop ? 'gap-4' : 'gap-3',
          )}
        >
          <DialogTitle
            className={cn(
              'text-center text-black-color',
              isDesktop ? 'typo-title-2-m' : 'typo-body-1-2-sb',
            )}
          >
            알림 수신을 해제하시겠어요?
          </DialogTitle>
          <p
            className={cn(
              'text-center text-grey-color-4 whitespace-pre-line',
              isDesktop ? 'typo-body-1-3-m' : 'typo-body-3-2-m',
            )}
          >
            이메일을 입력하셨더라도,{`\n`}수신 여부를 끄시면 새로운 소식이나
            알림을{`\n`}받으실 수 없습니다.
          </p>
        </div>

        <DialogFooter className="mt-6 flex-row gap-[11px]">
          <Button
            variant="outlined-primary"
            size="medium"
            className="flex-1 h-[47px]"
            onClick={onConfirmTurnOff}
            disabled={isPending}
          >
            수신 해제
          </Button>
          <Button
            variant="solid"
            size="medium"
            className="flex-1 h-[47px]"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            유지하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
