'use client'

import Image from 'next/image'
import { XIcon } from '@/assets/icons'
import { Button } from '@/components/atoms/Button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/molecules/dialog/Dialog'
import { cn } from '@/shared/utils/cn'

type ExploreEmailPromptDialogProps = {
  open: boolean
  isDesktop: boolean
  onClose: () => void
  onNeverShow: () => void
  onConfirm: () => void
}

export function ExploreEmailPromptDialog({
  open,
  isDesktop,
  onClose,
  onNeverShow,
  onConfirm,
}: ExploreEmailPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'border-none bg-light-color-1',
          isDesktop
            ? 'w-full max-w-[493px] rounded-[24px] px-5 py-6'
            : 'w-full max-w-[303px] rounded-[16px] px-6 py-6',
        )}
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-full flex items-center justify-between">
            <div className="size-6" />
            <DialogTitle
              className={cn(
                'text-main-color-1 text-center',
                isDesktop ? 'typo-body-1-2-sb' : 'typo-caption-1',
              )}
            >
              이메일 등록 후
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="size-6 flex items-center justify-center text-grey-color-5"
              aria-label="팝업 닫기"
            >
              <XIcon width={24} height={24} />
            </button>
          </div>

          <div
            className={cn(
              'text-black-color text-center whitespace-pre-line',
              isDesktop ? 'typo-title-1-2-sb' : 'typo-body-2-2-sb',
            )}
          >
            {isDesktop ? (
              <>
                모집 알림 받기 버튼 하나만 클릭하면{`\n`}원하는 동아리의 모집
                소식을 바로 받아요!
              </>
            ) : (
              <>버튼 하나만 클릭해도{`\n`}동아리 지원 소식을 바로 받아요!</>
            )}
          </div>

          <div
            className={cn(
              'flex items-center justify-center w-full',
              isDesktop ? 'max-w-[280px]' : '',
            )}
          >
            <Image
              src="/icons/email-connect.svg"
              alt="이메일 등록 안내"
              width={isDesktop ? 280 : 247}
              height={isDesktop ? 280 : 245}
            />
          </div>

          <div className={cn('w-full', isDesktop ? 'pt-2' : 'pt-0')}>
            <Button
              type="button"
              variant="solid"
              size={isDesktop ? 'large' : 'medium'}
              className={cn(
                'w-full',
                isDesktop ? 'typo-body-1-3-m' : 'typo-caption-1',
              )}
              onClick={onConfirm}
            >
              이메일 등록하기
            </Button>
            <button
              type="button"
              onClick={onNeverShow}
              className={cn(
                'w-full mt-3 text-center text-grey-color-1',
                isDesktop ? 'typo-body-1-3-m' : 'typo-caption-1',
              )}
            >
              다시 보지 않기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
