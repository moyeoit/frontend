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

interface EmailConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailConfirmDialog({
  open,
  onOpenChange,
}: EmailConfirmDialogProps) {
  const { data: userProfile } = useUserProfile()
  const updateUserInfoMutation = useUpdateUserManage()
  const [email, setEmail] = React.useState('')

  React.useEffect(() => {
    if (userProfile?.email) {
      setEmail(userProfile.email)
    }
  }, [userProfile?.email])

  const handleConfirm = async () => {
    if (!userProfile) return

    try {
      await updateUserInfoMutation.mutateAsync({
        name: userProfile.name,
        subscriptionEmail: email,
        emailAgree: true,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('이메일 업데이트 실패:', error)
    }
  }

  const isPending = updateUserInfoMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-90 sm:max-w-96 rounded-3xl border-none bg-white-color"
      >
        <div className="flex flex-col gap-4">
          <DialogTitle className="text-center">
            모집 알림 수신 메일 확인
          </DialogTitle>
          <p className="typo-body-1-3-m text-grey-color-4 text-center">
            알림은 아래 주소로 발송됩니다. <br />
            다른 메일 주소로 받고 싶다면 입력해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            disabled={isPending}
            className="p-3 border-none bg-light-color-2 typo-body-3-3-r"
          />
        </div>

        <DialogDescription className="text-grey-color-1">
          * 알림 메일 설정은 마이페이지 &gt; 계정 관리 에서 확인 가능합니다.
        </DialogDescription>

        <DialogFooter className="mt-4 gap-3 flex flex-row">
          <DialogClose asChild>
            <button
              type="button"
              className="flex-1 py-2 rounded-full border border-light-color-4 typo-body-3-3-r text-grey-color-4 hover:bg-light-color-1 transition-colors"
            >
              취소
            </button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || !email}
            variant="solid"
            size="medium"
            className="flex-1"
          >
            {isPending ? '저장 중...' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
