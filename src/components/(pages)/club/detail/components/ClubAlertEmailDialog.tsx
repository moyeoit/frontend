'use client'

import * as React from 'react'
import { Button } from '@/components/atoms/Button/button'
import { Input } from '@/components/atoms/Input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/molecules/dialog/Dialog'
import { useUpdateUserManage } from '@/features/user/mutations'
import { useUserProfile } from '@/features/user/queries'
import { cn } from '@/shared/utils/cn'

type ClubAlertEmailDialogProps = {
  open: boolean
  isDesktop: boolean
  onOpenChange: (open: boolean) => void
  onConfirmSubscription: () => Promise<void>
}

export function ClubAlertEmailDialog({
  open,
  isDesktop,
  onOpenChange,
  onConfirmSubscription,
}: ClubAlertEmailDialogProps) {
  const { data: userProfile } = useUserProfile()
  const updateUserManageMutation = useUpdateUserManage()
  const [email, setEmail] = React.useState('')

  React.useEffect(() => {
    if (!open) return

    const initialEmail = userProfile?.email?.trim()
    setEmail(initialEmail ?? '')
  }, [open, userProfile?.email])

  const handleConfirm = React.useCallback(async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    try {
      await updateUserManageMutation.mutateAsync({
        name: userProfile?.name,
        subscriptionEmail: trimmedEmail,
        emailAgree: true,
      })
      await onConfirmSubscription()
      onOpenChange(false)
    } catch (error) {
      console.error('모집 알림 설정 실패:', error)
    }
  }, [
    email,
    onConfirmSubscription,
    onOpenChange,
    updateUserManageMutation,
    userProfile?.name,
  ])

  const isPending = updateUserManageMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'border-none bg-white-color',
          isDesktop
            ? 'w-full max-w-[434px] rounded-[20px] px-5 pb-5 pt-6'
            : 'w-full max-w-[276px] rounded-[20px] px-4 pb-5 pt-6',
        )}
      >
        <div className="flex flex-col gap-4 text-center">
          <DialogTitle
            className={cn(
              'text-black-color',
              isDesktop ? 'typo-title-2' : 'typo-body-1-b',
            )}
          >
            모집 알림 수신 메일 확인
          </DialogTitle>
          <p
            className={cn(
              'text-grey-color-4 whitespace-pre-line',
              isDesktop ? 'typo-body-1-3-m' : 'typo-button-m',
            )}
          >
            알림은 아래 주소로 발송됩니다.
            {!isDesktop ? '\n다른 메일 주소로 받고 싶다면 입력해주세요.' : ''}
          </p>
        </div>

        <div
          className={cn('mt-4 flex flex-col', isDesktop ? 'gap-4' : 'gap-2')}
        >
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력해주세요"
            disabled={isPending}
            className={cn(
              'border-none bg-light-color-2',
              isDesktop ? 'h-12 typo-body-3-3-r' : 'h-11 typo-button-m',
            )}
          />
          <DialogDescription
            className={cn(
              'text-grey-color-1 text-center',
              isDesktop ? 'typo-caption-1' : 'typo-smallbody-0',
            )}
          >
            * 알림 메일 설정은 마이페이지 &gt; 계정 관리 에서 확인 가능합니다.
          </DialogDescription>
        </div>

        <DialogFooter className="mt-4 flex flex-row gap-[11px]">
          <DialogClose asChild>
            <button
              type="button"
              className={cn(
                'flex-1 rounded-[100px] border border-light-color-3 text-grey-color-4',
                isDesktop ? 'h-[47px] typo-body-3-b' : 'h-10 typo-caption-1',
              )}
              disabled={isPending}
            >
              취소
            </button>
          </DialogClose>
          <Button
            type="button"
            variant="solid"
            size="medium"
            className={cn(
              'flex-1',
              isDesktop ? 'h-[47px] typo-body-3-b' : 'h-10 typo-caption-1',
            )}
            onClick={handleConfirm}
            disabled={isPending || email.trim().length === 0}
          >
            {isPending ? '저장 중...' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
